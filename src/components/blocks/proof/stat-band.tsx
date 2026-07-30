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

        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat._id} delay={staggerDelay(i)}>
              <div className="flex flex-col items-center gap-2 text-center">
                <dd className="order-1 text-display-2 font-extrabold text-brand">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="order-2 max-w-[16ch] text-[0.9375rem] font-bold text-ink">
                  {stat.label}
                </dt>
                {stat.detail ? (
                  <p className="order-3 max-w-[22ch] text-body-sm text-ink-muted">
                    {stat.detail}
                  </p>
                ) : null}
              </div>
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
