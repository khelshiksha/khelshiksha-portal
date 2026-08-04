# 9. API Design

Three surfaces, each chosen for a specific reason:

| Surface              | Used for                                                | Why                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server Actions**   | Form mutations — leads, bookings, downloads, newsletter | Progressive enhancement: forms work with JS disabled. No hand-written fetch, no API route to secure separately.                                                                       |
| **Route Handlers**   | Streaming AI, webhooks, search, OG images               | Server Actions cannot stream tokens to the client cleanly. Anything that needs a `ReadableStream`, a raw request body (HMAC verification), or a non-HTML response is a Route Handler. |
| **RSC direct fetch** | All content reads                                       | A Server Component calling Sanity directly is the fastest possible path. There is no reason to put an HTTP hop between our server and our CMS.                                        |

**There is no REST/GraphQL API for our own frontend.** Building one would be inventing a
network boundary inside a single deployment.

---

## Server Actions — mutations

```ts
// features/leads/actions.ts
"use server";

import { leadSchema } from "./schema"; // the same zod schema the form uses
import { rateLimit } from "@/lib/rate-limit";
import { leadRepo } from "@/services/db/repositories/lead";
import { sendLeadNotification } from "./notifications";
import { hashIp } from "@/lib/utils";
import { headers } from "next/headers";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLead(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult<{ leadId: string }>> {
  // 1. Honeypot — a bot fills every field it sees.
  if (formData.get("company_website"))
    return { ok: true, data: { leadId: "noop" } };

  // 2. Validate. Client-side validation is UX; this is the actual check.
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 3. Rate limit on hashed IP — never store the raw address.
  const ipHash = hashIp((await headers()).get("x-forwarded-for"));
  if (!(await rateLimit(`lead:${ipHash}`, { limit: 5, windowSec: 3600 }))) {
    return {
      ok: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // 4. Persist, then notify. Notification failure must not lose the lead.
  const lead = await leadRepo.create({ ...parsed.data, ipHash });
  void sendLeadNotification(lead).catch(reportError);

  return { ok: true, data: { leadId: lead.id } };
}
```

Consumed with `useActionState` so the form degrades to a plain HTML POST without JS.

| Action                | Location                         | Returns                                 |
| --------------------- | -------------------------------- | --------------------------------------- |
| `submitLead`          | `features/leads/actions.ts`      | `{ leadId }`                            |
| `bookDemo`            | `features/leads/actions.ts`      | `{ bookingId }`                         |
| `requestResource`     | `features/resources/actions.ts`  | `{ downloadUrl }` (signed, 15-min TTL)  |
| `subscribeNewsletter` | `features/newsletter/actions.ts` | `{ status: 'pending' }` — double opt-in |
| `submitApplication`   | `features/careers/actions.ts`    | `{ applicationId }`                     |

Every action follows the same five steps: honeypot → validate → rate-limit → persist → notify.

---

## Route Handlers

| Route                    | Method | Purpose                                                                             |
| ------------------------ | ------ | ----------------------------------------------------------------------------------- |
| `/api/revalidate`        | POST   | Sanity webhook. HMAC-verified with `SANITY_WEBHOOK_SECRET`, then `revalidateTag()`. |
| `/api/draft`             | GET    | Enter/exit preview mode. Secret-guarded.                                            |
| `/api/search`            | GET    | `?q=&facets=` → results. Serves the prebuilt index and runs tier-2 filtering.       |
| `/api/og`                | GET    | Dynamic OG image via `ImageResponse` (edge).                                        |
| `/api/ai/advisor`        | POST   | **Streaming.** Product recommendation conversation.                                 |
| `/api/ai/lesson-planner` | POST   | **Streaming.** Generates a lesson plan.                                             |
| `/api/ai/chat`           | POST   | **Streaming.** General site assistant.                                              |

---

## The AI layer

### Model selection

| Feature              | Model           | Effort   | Reasoning                                                                                                                    |
| -------------------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Product Advisor      | `claude-opus-5` | `medium` | Conversational recommendation over a ~10-product catalogue. Needs judgment about a child's needs, not deep reasoning.        |
| Lesson Planner       | `claude-opus-5` | `high`   | The hardest task here — must produce a genuinely usable 40-minute plan mapped to NCF outcomes. Quality is the whole product. |
| Activity Generator   | `claude-opus-5` | `medium` |                                                                                                                              |
| Parent Guide         | `claude-opus-5` | `medium` |                                                                                                                              |
| Chatbot              | `claude-opus-5` | `low`    | Mostly retrieval-shaped answers over site content.                                                                           |
| Search intent parser | `claude-opus-5` | `low`    | Structured extraction. Latency-sensitive — it sits in the search box.                                                        |

**Pricing:** `claude-opus-5` is **$5 / $25 per million tokens** (input / output), 1M context,
128K max output. `claude-haiku-4-5` ($1 / $5, 200K context) is the obvious cost lever for the
intent parser and chatbot if volume justifies it — but that is a business decision about
quality-vs-cost, not an engineering default. Start on Opus 5 everywhere, measure with the
token columns in `AiConversation`, then downgrade specific features deliberately.

**Prompt caching is what makes this affordable.** The product catalogue + pedagogy framing is a
stable ~8K-token prefix, identical on every request. Cached with a 1-hour TTL, it bills at
~0.1× on reads instead of full price. Opus 5's minimum cacheable prefix is **512 tokens**, so
even the smaller feature prompts cache.

> Watch `usage.cache_read_input_tokens`. If it is ~0 across repeated requests, something
> volatile leaked into the prefix — a timestamp, a session id, a non-deterministic
> `JSON.stringify` of the catalogue. That is the failure mode to check first.

### Ports — the abstraction that keeps AI swappable

```ts
// services/ai/ports.ts
export interface AdvisorPort {
  recommend(input: {
    messages: ChatMessage[];
    audience: "parent" | "teacher" | "school";
  }): Promise<ReadableStream<Uint8Array>>;
}

export interface LessonPlannerPort {
  plan(input: {
    grade: string;
    subject: string;
    durationMinutes: number;
    productId?: string;
    objectives?: string[];
  }): Promise<ReadableStream<Uint8Array>>;
}

export interface IntentParserPort {
  parse(query: string): Promise<ProductFilterState>; // non-streaming, structured
}
```

Route handlers depend on the interface. `@anthropic-ai/sdk` is imported in exactly one file:
`services/ai/client.ts`.

### Streaming: why a Route Handler, not a Server Action

Server Actions are the right tool for the forms above, but they are a poor fit for token
streaming — they are RPC-shaped, and streaming through them requires either an experimental
streamable-value abstraction or returning an async generator that the client must unwrap. A
Route Handler returning a `ReadableStream` is the platform-native path: it works with plain
`fetch`, it is cancellable via `AbortSignal`, and it needs no extra library.

```ts
// services/ai/advisor.ts
import { anthropic } from "./client";
import { buildCatalogueContext } from "./context";
import { ADVISOR_SYSTEM } from "./prompts/advisor";
import { recordConversation } from "./telemetry";

export async function streamAdvice({ messages, audience }: AdvisorInput) {
  const stream = anthropic.messages.stream({
    model: "claude-opus-5",
    max_tokens: 4096,
    // Adaptive thinking is on by default on Opus 5. `summarized` is opt-in —
    // without it, thinking blocks stream with empty text and the UI shows a
    // long pause before any output appears.
    thinking: { type: "adaptive", display: "summarized" },
    output_config: { effort: "medium" },
    system: [
      { type: "text", text: ADVISOR_SYSTEM },
      {
        type: "text",
        text: await buildCatalogueContext(audience),
        // Stable prefix → cached for an hour. Volatile content goes in `messages`.
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ],
    messages,
    tools: [searchCatalogueTool, checkAvailabilityTool],
  });

  return stream;
}
```

```ts
// app/api/ai/advisor/route.ts
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, audience } = advisorRequestSchema.parse(await req.json());

  if (
    !(await rateLimit(`ai:${await sessionHash()}`, {
      limit: 20,
      windowSec: 3600,
    }))
  ) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const llm = await streamAdvice({ messages, audience });
  const encoder = new TextEncoder();

  const body = new ReadableStream({
    async start(controller) {
      try {
        llm.on("text", (delta) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`),
          );
        });

        const final = await llm.finalMessage();

        // Opus 5 safety classifiers can decline a request. This is a
        // successful HTTP 200 with stop_reason "refusal" — not an exception.
        // Check it before reading content.
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "declined" })}\n\n`,
            ),
          );
        }

        void recordConversation({ feature: "PRODUCT_ADVISOR", final });
      } catch (err) {
        reportError(err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "failed" })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
    cancel: () => llm.abort(), // user navigated away — stop paying for tokens
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

**Three details that matter:**

1. `stream.finalMessage()` — do not hand-roll a promise around `.on()` events. The SDK already
   handles completion, error and abort states.
2. `cancel: () => llm.abort()` — without this, a user closing the tab leaves generation running
   against the provider, consuming quota nobody will ever read.
3. **No `temperature`, `top_p`, or `top_k` anywhere.** Those parameters are rejected with a 400
   on Opus 5. Behaviour is steered by the system prompt and `effort`.

### Refusal fallback

Enabled by default on the AI routes. A policy decline is re-served by a fallback model inside
the same call rather than surfacing as a dead end to a teacher:

```ts
anthropic.beta.messages.stream({
  model: "claude-opus-5",
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default", // routes by refusal category — no model list to maintain
  /* … */
});
```

### Tool use — grounding the model in the real catalogue

The advisor must never invent a kit. It is given tools instead of a memorised list:

```ts
const searchCatalogueTool = {
  name: "search_catalogue",
  description:
    "Search the Khel Shiksha learning-kit catalogue. Call this whenever the user " +
    "describes a child, a class, a subject, or a learning goal — before recommending " +
    "anything. Never recommend a kit that was not returned by this tool.",
  input_schema: {
    type: "object",
    properties: {
      ageMin: { type: "integer" },
      ageMax: { type: "integer" },
      subjects: { type: "array", items: { type: "string" } },
      skills: { type: "array", items: { type: "string" } },
      setting: { type: "string", enum: ["indoor", "outdoor", "either"] },
    },
    required: [],
    additionalProperties: false,
  },
  strict: true,
};
```

The description is **prescriptive about when to call it**, not just what it does — that is what
actually drives tool-call rate. `strict: true` guarantees the input validates, so the handler
never defends against a malformed shape.

Execution uses the SDK's tool runner rather than a hand-written loop; the tool function itself
queries Sanity and returns only fields the model needs.

### Intent parser — structured output, no streaming

```ts
const FilterSchema = z.object({
  ageMin: z.number().nullable(),
  ageMax: z.number().nullable(),
  subjects: z.array(z.enum(SUBJECTS)),
  skills: z.array(z.enum(SKILLS)),
  pillars: z.array(z.enum(PILLARS)),
  setting: z.enum(["indoor", "outdoor", "either"]).nullable(),
  confidence: z.number().min(0).max(1),
});

export async function parseIntent(query: string) {
  const res = await anthropic.messages.parse({
    model: "claude-opus-5",
    max_tokens: 1024,
    output_config: { effort: "low", format: zodOutputFormat(FilterSchema) },
    system: [
      {
        type: "text",
        text: INTENT_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: query }],
  });
  return res.parsed_output;
}
```

`"my child likes maths"` → `{ subjects: ['maths'], ageMin: null, confidence: 0.8 }`.
Below `confidence: 0.5` the UI falls back to keyword search rather than showing a confident
wrong answer.

### Guardrails

| Risk                              | Mitigation                                                                                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hallucinated products             | Tool-grounded. The system prompt states plainly: recommend only kits returned by `search_catalogue`.                                                             |
| Prompt injection via CMS content  | Catalogue context is inserted as data with explicit delimiters, and the system prompt states that content inside them is never an instruction.                   |
| Cost runaway                      | Per-session rate limit (20 req/hr), `max_tokens` caps, `cancel` on disconnect, token telemetry per feature.                                                      |
| Silent quality decay              | `wasHelpful` thumbs on every AI response → a weekly report.                                                                                                      |
| **AI presented as authoritative** | Every AI surface carries a visible `AIDisclosure`: _"Suggestions generated by AI — please review before classroom use."_ Non-negotiable in an education product. |
| Availability                      | Every AI feature has a non-AI path. The advisor degrades to the guided finder; search degrades to keyword. **No journey depends on the AI service being up.**    |

---

## Error handling & conventions

- Route handlers return `{ error: string, code: string }` with a correct status. Never a 200
  with an error body.
- SDK errors are caught with typed classes (`Anthropic.RateLimitError`,
  `Anthropic.APIConnectionError`), most-specific first — never by string-matching messages.
- User-facing copy never exposes an internal error. `reportError()` sends the detail to Sentry.
- Server Actions return the `ActionResult` discriminated union above — they do not throw for
  expected failure.
