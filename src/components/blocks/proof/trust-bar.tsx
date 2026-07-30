import { Container } from "@/components/ui/container";
import type { Partner } from "@/services/cms/types";

/**
 * Credibility before pitch.
 *
 * This sits immediately below the hero, requiring no scroll, because the
 * question a principal or district officer arrives with is "is this
 * legitimate and has the government already approved it" — not "what do you
 * sell". It is the most valuable element on the homepage.
 *
 * Partners render as typographic wordmarks, not logo images: the marks were
 * read by inference from a print scan and we hold neither vector files nor
 * written permission (blocker #2). Stating the association in type is honest;
 * reproducing an unlicensed mark is not.
 */
export function TrustBar({ partners }: { partners: Partner[] }) {
  return (
    <section
      aria-label="Credentials and partners"
      className="border-y border-rule bg-sunken"
    >
      <Container className="flex flex-col gap-6 py-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          {[
            "12,000+ kits delivered",
            "PM SHRI schools",
            "UNICEF learning modules",
            "NCF 2023 compliant",
          ].map((claim, i) => (
            <li key={claim} className="flex items-center gap-3">
              {i > 0 ? (
                <span aria-hidden="true" className="text-rule-strong">
                  ·
                </span>
              ) : null}
              <span className="text-[0.9375rem] font-bold text-ink">
                {claim}
              </span>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {partners.map((partner) => (
            <li
              key={partner._id}
              className="text-[0.8125rem] font-bold tracking-[0.1em] text-ink-subtle uppercase transition-colors hover:text-ink-muted"
            >
              {partner.name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
