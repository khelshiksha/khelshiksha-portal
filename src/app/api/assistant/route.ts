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

/* Our OWN previous answers come back as conversation history, and they are
   routinely longer than a question. Capping every message at the question
   limit meant the first question worked and every follow-up failed with "too
   long or malformed" — the model's reply could not survive the round trip
   back through validation. Bounded by what we actually generate:
   maxOutputTokens is 700, so ~3000 characters, with headroom. */
const MAX_ANSWER_CHARS = 8000;

const MAX_TURNS = 12;

/* Belt and braces on payload size, since a client could send 12 near-limit
   assistant turns and nothing above would object. */
const MAX_TOTAL_CHARS = 24_000;

/**
 * Role-dependent length limits.
 *
 * Note that the assistant turns are supplied by the CLIENT, so a crafted
 * request can put words in the assistant's mouth as fake history. That is
 * inherent to stateless chat and is bounded rather than prevented: the system
 * instruction is sent separately on every call and takes precedence over
 * conversation content, the grounding facts are re-sent each time, and the
 * blast radius is a visitor misleading themselves in their own browser.
 * Server-side session state would close it properly and is not worth a
 * datastore for an FAQ widget.
 */
const bodySchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          role: z.literal("user"),
          content: z.string().trim().min(1).max(MAX_QUESTION_CHARS),
        }),
        z.object({
          role: z.literal("assistant"),
          content: z.string().trim().min(1).max(MAX_ANSWER_CHARS),
        }),
      ]),
    )
    .min(1)
    .max(MAX_TURNS)
    .refine(
      (messages) =>
        messages.reduce((sum, m) => sum + m.content.length, 0) <=
        MAX_TOTAL_CHARS,
      { message: "conversation too long" },
    )
    /* Gemini expects the exchange to end on the human's turn, and a trailing
       assistant message would mean asking the model to continue its own reply
       rather than answer anything. */
    .refine((messages) => messages[messages.length - 1]?.role === "user", {
      message: "last message must be from the user",
    }),
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
    /* Say which limit was hit. The visitor can act on "shorten your question"
       and on "start a new conversation"; they can do nothing with a single
       message covering both. */
    const tooLong = parsed.error.issues.some(
      (issue) =>
        issue.code === "too_big" ||
        issue.message === "conversation too long" ||
        issue.code === "too_small",
    );
    return textError(
      tooLong
        ? "That's longer than the assistant can take. Try a shorter question, or reload the page to start a fresh conversation."
        : "That request wasn't understood. Please reload the page and try again.",
      400,
    );
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
