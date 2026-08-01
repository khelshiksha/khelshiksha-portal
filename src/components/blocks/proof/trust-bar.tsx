import { Container } from "@/components/ui/container";
import type { Partner } from "@/services/cms/types";

type Alignment = { framework: string };

/**
 * Credibility before pitch.
 *
 * This sits immediately below the hero, requiring no scroll, because the
 * question a principal or district officer arrives with is "is this
 * legitimate and has the government already approved it" — not "what do you
 * sell". It is the most valuable element on the homepage.
 *
 * Institutions and missions sit under one heading because they answer the
 * same question, but they are NOT the same claim and the markup keeps them
 * apart: the first list is bodies Khel Shiksha has delivered work with, the
 * second is national programmes the kits are built against. Flattening them
 * into one undifferentiated row would imply an endorsement by Fit India and
 * Mission LiFE that nobody has given.
 *
 * Both render as typographic chips, not logo images: the marks were read by
 * inference from a print scan and we hold neither vector files nor written
 * permission (blocker #2). Stating the association in type is honest;
 * reproducing an unlicensed mark is not.
 */
const CLAIMS = [
  "12,000+ kits delivered",
  "PM SHRI schools",
  "UNICEF learning modules",
  "NCF 2023 compliant",
];

export function TrustBar({
  partners,
  alignments,
}: {
  partners: Partner[];
  alignments: Alignment[];
}) {
  return (
    <section aria-labelledby="trust-heading" className="pt-4 pb-2 sm:pt-6">
      <Container>
        <div className="border-rule bg-sunken flex flex-col gap-8 rounded-[var(--radius-2xl)] border px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2
              id="trust-heading"
              className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase"
            >
              Trusted by institutions &amp; missions
            </h2>

            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {CLAIMS.map((claim, i) => (
                <li key={claim} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-rule-strong">
                      ·
                    </span>
                  ) : null}
                  <span className="text-ink text-[0.9375rem] font-bold">
                    {claim}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {partners.map((partner) => (
              <li
                key={partner._id}
                className="border-rule-strong/60 bg-surface text-ink-muted hover:border-brand hover:text-ink rounded-full border px-4 py-2 text-[0.75rem] font-bold tracking-[0.08em] uppercase transition-colors"
              >
                {partner.name}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-3">
            <p className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
              Built against
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {alignments.map((alignment) => (
                <li
                  key={alignment.framework}
                  className="bg-brand-tint text-brand-deep rounded-full px-4 py-2 text-[0.75rem] font-bold tracking-[0.08em] uppercase"
                >
                  {alignment.framework}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
