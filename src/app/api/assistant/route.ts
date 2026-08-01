import { headers } from "next/headers";
import { z } from "zod";
import { hashIp, rateLimit } from "@/lib/rate-limit";
import { answerQuestion, isAssistantConfigured } from "@/services/ai";

/**
 * Streaming endpoint for the site assistant.
 *
 * Node runtime, not edge: the grounding prompt is built from services/cms,
 * which is the seam Sanity will eventually sit behind, and that will not be
 * edge-safe.
 */
export const runtime = "nodejs";

/* An LLM call is the most expensive thing on this site and the endpoint is
   public, so the limits are tighter than the lead form's and bound both the
   question and the conversation. */
const MAX_QUESTION_CHARS = 600;
const MAX_TURNS = 12;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(MAX_QUESTION_CHARS),
      }),
    )
    .min(1)
    .max(MAX_TURNS),
});

function textError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  if (!isAssistantConfigured()) {
    /* The panel is not rendered at all without a key, so reaching this means
       a direct call. Say so plainly rather than 500ing. */
    return textError("The assistant is not enabled on this site.", 503);
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return textError("Send a JSON body.", 400);
  }
  if (!parsed.success) {
    return textError("That question was too long or malformed.", 400);
  }

  /* Same identify-or-fall-back-to-a-global-ceiling shape as the lead action:
     bucketing every unidentifiable visitor together on one small limit would
     lock out everyone behind a shared egress. */
  const headerList = await headers();
  const ipHash = hashIp(headerList.get("x-forwarded-for"));
  const allowed = ipHash
    ? await rateLimit(`ai:${ipHash}`, { limit: 12, windowSec: 3600 })
    : await rateLimit("ai:unidentified", { limit: 300, windowSec: 3600 });

  if (!allowed) {
    return textError(
      "You've asked a few questions already. Please book a demo and we'll answer properly.",
      429,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of answerQuestion(parsed.data.messages)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        /* The upstream key, model name and account details are in these
           errors. Log them; send the visitor a sentence. */
        console.error("[assistant] generation failed", error);
        controller.enqueue(
          encoder.encode(
            "\n\nSorry — something went wrong answering that. " +
              "Please try again, or call us on +91 97798 73333.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      /* Without this a proxy may buffer the whole response and defeat the
         streaming entirely. */
      "x-accel-buffering": "no",
    },
  });
}
