import "server-only";
import { GoogleGenAI } from "@google/genai";
import { getFaqs, getPillars, getProducts } from "@/services/cms";
import { AUDIENCE_KEYS, SITE } from "@/lib/constants";
import { FEATURES } from "@/lib/features";
import { formatAgeRange, formatDuration, formatGroupSize } from "@/lib/utils";

/**
 * The AI port — architecture decision D4.
 *
 * THIS IS THE ONLY FILE IN THE CODEBASE THAT IMPORTS A MODEL SDK. Everything
 * else — the route handler, the UI, the grounding, the rate limiting — calls
 * `answerQuestion` and knows nothing about the provider. Preserve that. It is
 * why swapping the underlying model provider changed this file and no other,
 * and it is what makes the next swap cheap.
 *
 * Two operational properties to keep in mind when reading the rest:
 *
 *  - REQUESTS ARE RATE LIMITED BY THE PROVIDER, not only by this application.
 *    When the provider's limit is reached the API errors, the route streams
 *    its fallback, and the visitor is given the phone number instead.
 *    Degraded rather than broken, by design — but it means "the assistant is
 *    quiet today" has an external cause worth checking before debugging code.
 *
 *  - PROMPTS AND RESPONSES MAY LEAVE THE SYSTEM. Anything sent to the model
 *    is handled under the provider's terms, which can include retention and
 *    use for product improvement depending on the account. That is why the
 *    rule in the system prompt about never repeating a named child is
 *    load-bearing rather than decorative: it is the last control before data
 *    leaves this codebase.
 */

/**
 * Candidate models, best first.
 *
 * A single hardcoded name broke the assistant in production the day it
 * shipped: `gemini-2.5-flash` returned 404 "no longer available to new
 * users". Google retires and closes off model IDs on their own schedule —
 * 2.0 Flash is already shut down — and this code has no way to know when.
 *
 * So: try each in order, and step to the next ONLY on the specific "this
 * model does not exist for you" error. Every other failure — a bad key, a
 * rate limit, a safety block — propagates immediately, because retrying a
 * different model would neither fix it nor tell us anything, and would turn
 * one failed request into three.
 *
 * Flash rather than Flash-Lite deliberately. The rules in the system prompt —
 * never state a price, never repeat a named child — are instructions to the
 * model rather than code, and reliable instruction-following is exactly what
 * the smaller variant trades away. The cheaper model would be a false economy
 * here: the constraints it would start ignoring are the safety ones.
 *
 * Set GEMINI_MODEL to pin one and skip the list entirely.
 */
const MODEL_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
] as const;

const MODELS: readonly string[] = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : MODEL_CANDIDATES;

/** A 404 from the models endpoint means "not this one", not "give up". */
function isModelUnavailable(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  if (status !== 404) return false;
  const message = String((error as { message?: string } | null)?.message ?? "");
  return /not found|not available|no longer available|is not supported/i.test(
    message,
  );
}

/**
 * 700 was too tight and answers were being cut off mid-sentence in
 * production — "...particularly to" and "4. **" both landed on screen.
 *
 * Two things eat this budget. The obvious one is the answer. The other is
 * that Gemini 3 models think before answering and those tokens count against
 * the same ceiling, so a 700 limit could leave only a few hundred for the
 * visible reply. The ceiling is a safety net against a runaway generation,
 * not a length target — the system prompt is what keeps answers to two or
 * three paragraphs, and it does that far more reliably than truncation, which
 * produces a broken sentence rather than a shorter answer.
 */
const MAX_TOKENS = 2000;

/**
 * The single gate. Both the UI and the route handler ask this and nothing
 * else, so the feature can never be half-present — a rendered panel backed by
 * a refusing endpoint would be worse than either.
 *
 * FEATURES.assistant is checked FIRST, and that order is deliberate: it is a
 * manual switch (see lib/features) and it has to win even when GOOGLE_API_KEY
 * is still set. Leaving the key in place while the switch is off is the
 * intended way to take the feature out of service, because restoring it is
 * then one boolean rather than a hunt for a lost credential.
 */
export function isAssistantConfigured(): boolean {
  if (!FEATURES.assistant) return false;
  return Boolean(process.env.GOOGLE_API_KEY);
}

export interface AssistantTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Grounding.
 *
 * The catalogue, pillars and FAQs are read through services/cms and pasted
 * into the system prompt rather than left to the model's memory. A model
 * inventing an eighth kit, or an age band a kit does not have, would be a
 * factual claim about a real product made to a real principal. Everything the
 * assistant is allowed to assert is in this string.
 */
async function buildSystemPrompt(): Promise<string> {
  /* getFaqs is scoped to one audience because each page shows only its own.
     The assistant does not know who is typing, so it gets all of them. */
  const [products, pillars, faqGroups] = await Promise.all([
    getProducts(),
    getPillars(),
    Promise.all([...AUDIENCE_KEYS, "general" as const].map((a) => getFaqs(a))),
  ]);
  const faqs = faqGroups.flat();

  /* The age band is written as an INSTRUCTION, not as a fact.
     Stated as "Ages 8-12 years" alongside duration and group size it read as
     one more attribute to summarise, and Aryabhata (8-12) was recommended to
     a parent asking about a six-year-old. Phrased as a rule about who it is
     NOT for, it is much harder to skim past. */
  const catalogue = products
    .map(
      (p) =>
        `- ${p.title} (/products/${p.slug}) — ${p.tagline} ` +
        `FOR AGES ${p.ageMin}-${p.ageMax} ONLY; do not recommend it for a ` +
        `child under ${p.ageMin} or over ${p.ageMax}. ` +
        `${formatAgeRange(p.ageMin, p.ageMax)}, ${formatDuration(p.durationMinutes)}, ` +
        `${formatGroupSize(p.groupSizeMin, p.groupSizeMax)}. ` +
        `Pillars: ${p.pillars.join(", ")}. Subjects: ${p.subjects.join(", ")}. ` +
        `${p.descriptionInstitutional}`,
    )
    .join("\n");

  const pillarList = pillars
    .map((p) => `- ${p.title} (/approach/pillars/${p.slug}): ${p.description}`)
    .join("\n");

  const faqList = faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  return `You are the Khel Shiksha assistant on khelshiksha.com.

Khel Shiksha makes gamified experiential learning kits, a physical "Game Corner"
shelf for classrooms, and teacher training for schools (Vidyalayas) across India,
mainly Gujarat. Tagline: "${SITE.tagline}". Aligned to NEP 2020 and NCF 2023.

Your job is to answer a visitor's question about the kits, the pillars, teacher
training, curriculum alignment, or how a rollout works — and then point them to
the right page or to booking a demo.

## The complete kit catalogue
${catalogue}

## The five learning pillars
${pillarList}

## Answers the team has already given
${faqList}

## Contact
Phone: ${SITE.phones.join(", ")}. Email: ${SITE.email}.
Demo booking: /contact?type=school-demo

## Rules — these are not style preferences

1. ONLY describe kits that appear in the catalogue above. There is no other
   kit. If asked about one not listed, say it is not in the current published
   range and offer to pass the question to the team.
2. RESPECT THE AGE BANDS. When a visitor names an age or a class, recommend
   only kits whose band actually covers it. Check the number before you
   suggest anything. If nothing in the range fits — a six-year-old wanting
   maths, for instance, when the only maths kit starts at eight — say so
   plainly, name the nearest kits that DO fit their age whatever the subject,
   and mention the one they will grow into. A parent acting on a
   recommendation for the wrong age discovers the mistake when the box is
   already open.
3. NEVER state, estimate, imply or compare a price, discount, or budget.
   Kits are supplied as part of a school programme and pricing depends on
   grades, school size and whether training is included. Always route pricing
   questions to /contact.
4. NEVER ask for, invite, or repeat any detail about an individual child —
   no name, school, age, photo, or performance. If a visitor volunteers such
   a detail, do not repeat it back. Ask for the class or grade band instead.
5. Do not invent statistics. The verifiable ones are: over 12,000 kits
   delivered to PM SHRI schools in Gujarat; specialised learning modules
   developed for UNICEF; five learning pillars. Nothing else is a number you
   may state.
6. If you do not know, say so plainly and give the contact route. A wrong
   answer to a principal is worse than no answer.
7. Answer in the language the visitor writes in. If they write in Gujarati,
   answer entirely in Gujarati.

## Format — the panel renders your reply as PLAIN TEXT

It does not render Markdown. Asterisks, hashes and backticks appear on screen
exactly as you type them, so a bolded kit name arrives as **Aryabhata** and
reads as a mistake.

- No Markdown of any kind: no **bold**, no *italics*, no \`code\`, no # headings.
- No numbered or bulleted lists. If you are comparing kits, use a short
  paragraph per kit and start it with the kit's name followed by a dash.
- No headings, no labels like "Call to action:" or "Summary:". Those are notes
  to yourself, not something a visitor should ever read.
- When you point at a page, write its NAME followed by the path in
  parentheses: "read more about Aryabhata (/products/aryabhata)" or "you can
  book a demo (/contact?type=school-demo)". The interface turns that into a
  link on the name and hides the path, so the sentence reads normally. A bare
  path left in a sentence reads like a piece of code.

## Style
Two or three short paragraphs at most. Plain sentences, no marketing
adjectives, no emoji. Address the visitor directly as "you". Finish your last
sentence — a complete short answer is better than a longer one that stops
mid-thought.`;
}

/**
 * Streams an answer as plain text chunks.
 *
 * Streaming rather than a single response: first token arrives in well under a
 * second, so the panel starts filling immediately instead of showing a spinner
 * for the length of a full generation. It also keeps the request clear of
 * platform response timeouts.
 */
export async function* answerQuestion(
  history: AssistantTurn[],
): AsyncGenerator<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");

  const client = new GoogleGenAI({ apiKey });

  /* Built once, outside the loop — it reads the whole catalogue and would be
     wasteful to rebuild per model attempt. */
  const systemInstruction = await buildSystemPrompt();

  /* Gemini calls the assistant role "model", not "assistant". Mapping it here
     rather than changing AssistantTurn keeps the provider's vocabulary inside
     the port, which is the point of having one. */
  const contents = history.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  for (const [index, model] of MODELS.entries()) {
    let stream;
    try {
      stream = await client.models.generateContentStream({
        model,
        contents,
        config: { systemInstruction, maxOutputTokens: MAX_TOKENS },
      });
    } catch (error) {
      const isLast = index === MODELS.length - 1;
      if (isModelUnavailable(error) && !isLast) {
        console.warn(
          `[assistant] model ${model} unavailable, trying ${MODELS[index + 1]}`,
        );
        continue;
      }
      throw error;
    }

    /* Logged so the working model can be pinned via GEMINI_MODEL instead of
       paying for a failed call on every request. */
    if (index > 0) console.info(`[assistant] answered with ${model}`);

    for await (const chunk of stream) {
      /* Undefined on chunks that carry only metadata (safety ratings, usage),
         which arrive interleaved with the text ones. */
      if (chunk.text) yield chunk.text;
    }
    return;
  }
}
