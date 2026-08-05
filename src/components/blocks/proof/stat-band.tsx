import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Counter } from "@/components/ui/counter";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { ImpactStat } from "@/services/cms/types";

export function StatBand({
  stats,
  eyebrow = "Proven impact",
  title = "What we have",
  accent = "actually delivered.",
  cta,
}: {
  stats: ImpactStat[];
  eyebrow?: string;
  title?: string;
  accent?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <Section labelledBy="impact-heading">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          id="impact-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          align="center"
        />

        {/* A <dl> may contain <div> wrappers, but only ONE level of them, and
            a <p> is not allowed inside at all. The previous markup nested
            Reveal's div inside another div and put the detail in a <p>, which
            broke the dt/dd association - invisible on screen, but it made the
            figures unreadable as a definition list. Reveal now IS the wrapper.

            DOM order is dt → dd (label, then value) so a screen reader says
            "Educational kits delivered: 12,000+". CSS `order` flips it
            visually so the big number still reads first. */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat._id}
              delay={staggerDelay(i)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <dt className="text-ink order-2 max-w-[16ch] text-[0.9375rem] font-bold">
                {stat.label}
              </dt>
              <dd className="text-display-2 text-brand order-1 font-extrabold">
                <Counter to={stat.value} suffix={stat.suffix} />
              </dd>
              {stat.detail ? (
                <dd className="text-body-sm text-ink-muted order-3 max-w-[22ch]">
                  {stat.detail}
                </dd>
              ) : null}
            </Reveal>
          ))}
        </dl>

        {cta ? (
          <div className="flex justify-center">
            <ButtonLink href={cta.href} variant="secondary">
              {cta.label}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
