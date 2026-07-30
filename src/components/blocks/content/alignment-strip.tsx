import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";

interface Alignment {
  framework: string;
  claim: string;
  detail: string;
}

/**
 * Scheme alignment, stated explicitly and by name.
 *
 * A district education officer is evaluating against a procurement checklist.
 * "Aligned with national frameworks" is worth nothing to them; "NCF 2023,
 * competency-based experiential learning" is the sentence they can act on.
 */
export function AlignmentStrip({
  alignments,
  eyebrow = "Strategic alignment",
  title = "Built against the missions you already",
  accent = "report on.",
}: {
  alignments: Alignment[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}) {
  return (
    <Section labelledBy="alignment-heading">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          id="alignment-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alignments.map((item, i) => (
            <Reveal as="li" key={item.framework} delay={staggerDelay(i)}>
              <Card className="flex h-full flex-col gap-2 p-6">
                <p className="text-[0.8125rem] font-extrabold tracking-[0.06em] text-brand uppercase">
                  {item.framework}
                </p>
                <h3 className="text-[1.0625rem] font-bold text-ink">
                  {item.claim}
                </h3>
                <p className="text-body-sm text-ink-muted">{item.detail}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
