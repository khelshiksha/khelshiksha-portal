import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { TimelineStep } from "@/services/cms/types";

/**
 * How a rollout actually works.
 *
 * Shown as a sequence because it IS one — the numbering and the connecting
 * rule encode real order, not decoration. This directly answers the question
 * a principal arrives with ("how much of my staff's time will this cost me")
 * and is the reason /schools converts.
 */
export function TimelineSteps({
  steps,
  eyebrow = "How it works",
  title = "From first visit to first",
  accent = "measured term.",
}: {
  steps: TimelineStep[];
  eyebrow?: string;
  title?: string;
  accent?: string;
}) {
  return (
    <Section tint="bg-surface" labelledBy="timeline-heading">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          id="timeline-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
        />

        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step._id} delay={staggerDelay(i)}>
              <div className="relative flex h-full flex-col gap-3">
                {/* Connecting rule — decorative, and hidden on the last item
                    so it never trails off the end of the row. */}
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-[13px] left-8 hidden h-0.5 w-[calc(100%-1rem)] bg-rule lg:block"
                  />
                ) : null}

                <span className="relative z-10 inline-flex size-7 items-center justify-center rounded-full bg-brand text-[0.75rem] font-bold text-on-brand">
                  {i + 1}
                </span>

                <p className="text-[0.75rem] font-bold tracking-[0.1em] text-brand uppercase">
                  {step.label}
                </p>
                <h3 className="text-h3 font-bold text-ink">{step.title}</h3>
                <p className="text-body-sm text-ink-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
