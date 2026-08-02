import { Container } from "@/components/ui/container";

type Alignment = { framework: string };

/**
 * Credibility before pitch.
 *
 * This sits immediately below the hero, requiring no scroll, because the
 * question a principal or district officer arrives with is "is this
 * legitimate and has the government already approved it" — not "what do you
 * sell". It is the most valuable element on the homepage.
 *
 * ## One idea per tier
 *
 * The previous version stacked four short claims, a row of institution chips
 * and a second row of mission chips, and read as a wall of labels — because
 * it was saying the same thing three times. "PM SHRI schools" sat directly
 * above a PM SHRI chip. "UNICEF learning modules" sat above a UNICEF chip.
 * "NCF 2023 compliant" sat above an NCF 2023 chip. All four were repeated
 * again by StatBand further down the same page.
 *
 * Now each tier says something the others do not, in descending weight:
 * the single strongest proof as a sentence, then who it was delivered with,
 * then what it is built against.
 *
 * ## Why the chips are gone
 *
 * A pill with a border and a hover state looks like a filter or a button.
 * These are neither — they are names, and clicking them does nothing. Set as
 * plain wordmarks in a flowing row they read as what they are, and the wildly
 * uneven name lengths (GEDA against "Education Department, Government of
 * Gujarat") stop being ragged boxes and become ordinary text.
 *
 * Title case rather than the previous uppercase for the same reason: forty
 * three tracked-out capitals is a wall, not a logo strip.
 *
 * ## The two lists stay separate
 *
 * Institutions are bodies Khel Shiksha has delivered work with. Missions are
 * national programmes the kits are built against. Merging them into one row
 * would imply an endorsement by Fit India and Mission LiFE that nobody has
 * given, so the second tier is phrased "Built against" and reads as prose.
 *
 * Both render as type, not logo images: the marks were read by inference from
 * a print scan and we hold neither vector files nor written permission
 * (blocker #2). Stating the association in type is honest; reproducing an
 * unlicensed mark is not.
 */
export function TrustBar({
  alignments,
}: {
  alignments: Alignment[];
}) {
  return (
    <section aria-labelledby="trust-heading" className="pt-4 pb-2 sm:pt-6">
      <Container>
        <div className="flex flex-col items-center gap-5 rounded-[var(--radius-2xl)] border border-rule bg-sunken px-6 py-9 text-center sm:gap-6 sm:px-10 sm:py-10">
          <h2 id="trust-heading" className="text-h3 font-bold text-balance text-ink">
            <span className="text-brand-deep">12,000+ kits</span> delivered to
            PM SHRI schools across Gujarat
          </h2>

          {/* The institution wordmarks that used to sit here are gone: the
              logo rail immediately below now shows the same organisations as
              actual marks, and naming them twice in adjacent blocks read as
              padding rather than as proof. The headline claim and the
              framework line stay, because neither is repeated anywhere. */}

          <p className="measure text-[0.75rem] text-ink-subtle sm:text-[0.8125rem]">
            Built against{" "}
            {alignments.map((alignment, i) => (
              <span key={alignment.framework}>
                {i > 0 ? (i === alignments.length - 1 ? " and " : ", ") : ""}
                <span className="font-semibold text-ink-muted">
                  {alignment.framework}
                </span>
              </span>
            ))}
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
