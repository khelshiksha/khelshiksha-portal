import "server-only";
import { GoogleGenAI } from "@google/genai";
import { getFaqs, getPillars, getProducts } from "@/services/cms";
import { AUDIENCE_KEYS, SITE } from "@/lib/constants";
import { formatAgeRange, formatDuration, formatGroupSize } from "@/lib/utils";

/**
 * The AI port — decision D4.
 *
 * This is the ONLY file in the codebase that imports a model SDK. Everything
 * else calls `answerQuestion`. That boundary is why moving from Anthropic to
 * Gemini touched this file and nothing else — not the route handler, not the
 * UI, not the grounding, not the rate limiting.
 *
 * Gemini because it is the best of the genuinely free tiers and signs in with
 * the existing Google account. Two consequences to keep in mind:
 *
 *  - The free tier has a daily request cap. When it is exhausted the API
 *    errors, the route streams its fallback, and the visitor is given the
 *    phone number. Degraded, not broken — but worth watching.
 *  - Free-tier prompts and responses may be used by Google to improve their
 *    products. The privacy policy says so. This is the material difference
 *    from a paid tier and the reason the rule below about child details is
 *    load-bearing rather than decorative.
 */

/** Flash-class by default. Check AI Studio for the current free-tier models. */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

/* Deliberately small. Answers are two or three short paragraphs — a visitor
   wants a route to the right page, not an essay, and an unbounded budget on a
   public endpoint is an unbounded bill. */
const MAX_TOKENS = 700;

export function isAssistantConfigured(): boolean {
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

  const catalogue = products
    .map(
      (p) =>
        `- ${p.title} (/products/${p.slug}) — ${p.tagline} ` +
        `Ages ${formatAgeRange(p.ageMin, p.ageMax)}, ${formatDuration(p.durationMinutes)}, ` +
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
2. NEVER state, estimate, imply or compare a price, discount, or budget.
   Kits are supplied as part of a school programme and pricing depends on
   grades, school size and whether training is included. Always route pricing
   questions to /contact.
3. NEVER ask for, invite, or repeat any detail about an individual child —
   no name, school, age, photo, or performance. If a visitor volunteers such
   a detail, do not repeat it back. Ask for the class or grade band instead.
4. Do not invent statistics. The verifiable ones are: over 12,000 kits
   delivered to PM SHRI schools in Gujarat; specialised learning modules
   developed for UNICEF; five learning pillars. Nothing else is a number you
   may state.
5. If you do not know, say so plainly and give the contact route. A wrong
   answer to a principal is worse than no answer.
6. Answer in the language the visitor writes in. If they write in Gujarati,
   answer entirely in Gujarati.

## Style
Two or three short paragraphs at most, plain sentences, no marketing
adjectives, no emoji, no bullet lists unless comparing kits. Refer to pages by
their path (for example /products/aryabhata) so the interface can link them.
Address the visitor directly as "you".`;
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

  const stream = await client.models.generateContentStream({
    model: MODEL,
    /* Gemini calls the assistant role "model", not "assistant". Mapping it
       here rather than changing AssistantTurn keeps the provider's vocabulary
       inside the port, which is the point of having one. */
    contents: history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    config: {
      systemInstruction: await buildSystemPrompt(),
      maxOutputTokens: MAX_TOKENS,
    },
  });

  for await (const chunk of stream) {
    /* Undefined on chunks that carry only metadata (safety ratings, usage),
       which arrive interleaved with the text ones. */
    if (chunk.text) yield chunk.text;
  }
}
