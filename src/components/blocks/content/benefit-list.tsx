import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { Benefit } from "@/services/cms/types";

/**
 * "Shifting from rote memorization to Learning by Doing."
 *
 * Numbered because these five ARE an enumerated set from the brochure — the
 * numbers encode something true, they are not decoration. On desktop the
 * heading pins while the list scrolls past it; the pinning is pure CSS
 * `position: sticky`, so there is no scroll library and nothing to load.
 */
export function BenefitList({ benefits }: { benefits: Benefit[] }) {
  return (
    <Section labelledBy="why-heading">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle
            id="why-heading"
            eyebrow="Why experiential?"
            title="Shifting from rote memorization to"
            accent="Learning by Doing."
            lede="Five things that change in a classroom when a child handles an idea instead of only hearing it."
          />
        </div>

        <ol className="flex flex-col">
          {benefits.map((benefit, i) => (
            <Reveal as="li" key={benefit._id} delay={staggerDelay(i, 50, 200)}>
              <div className="flex gap-5 border-b border-rule py-7 first:pt-0 last:border-b-0">
                <span
                  aria-hidden="true"
                  className="tabular mt-1 text-[0.8125rem] font-bold text-brand"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-h3 font-bold text-ink">
                    {benefit.title}
                  </h3>
                  <p className="text-body text-ink-muted">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
