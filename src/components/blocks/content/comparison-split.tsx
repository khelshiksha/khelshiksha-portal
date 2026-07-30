import { Check, Minus } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { AudienceHub } from "@/services/cms/types";

/**
 * "Today" versus "With Khel Shiksha".
 *
 * Each side uses a distinct ICON as well as a distinct colour, because colour
 * is never the only signal — this reads correctly in greyscale and in Windows
 * High Contrast Mode.
 */
export function ComparisonSplit({
  problem,
  outcome,
}: {
  problem: AudienceHub["problem"];
  outcome: AudienceHub["outcome"];
}) {
  return (
    <Section labelledBy="comparison-heading">
      <Container>
        <h2 id="comparison-heading" className="sr-only">
          What changes with Khel Shiksha
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[var(--radius-xl)] border border-rule bg-sunken p-8">
              <h3 className="text-h3 font-bold text-ink-muted">
                {problem.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-4">
                {problem.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Minus
                      size={18}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-subtle"
                    />
                    <span className="text-body text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="h-full rounded-[var(--radius-xl)] border border-transparent bg-tint-mint p-8">
              <h3 className="text-h3 font-bold text-ink">{outcome.heading}</h3>
              <ul className="mt-5 flex flex-col gap-4">
                {outcome.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check
                      size={18}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-pillar-mint"
                    />
                    <span className="text-body text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
