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
            <div className="border-rule bg-sunken h-full rounded-[var(--radius-xl)] border p-8">
              <h3 className="text-h3 text-ink-muted font-bold">
                {problem.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-4">
                {problem.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Minus
                      size={18}
                      aria-hidden="true"
                      className="text-ink-subtle mt-1 shrink-0"
                    />
                    <span className="text-body text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="bg-tint-mint h-full rounded-[var(--radius-xl)] border border-transparent p-8">
              <h3 className="text-h3 text-ink font-bold">{outcome.heading}</h3>
              <ul className="mt-5 flex flex-col gap-4">
                {outcome.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check
                      size={18}
                      aria-hidden="true"
                      className="text-pillar-mint mt-1 shrink-0"
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
