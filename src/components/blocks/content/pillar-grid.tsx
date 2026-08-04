import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { LinkCard } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import { PILLAR_ACCENT_CLASS } from "@/lib/constants";
import { PillarIcon } from "@/components/icons/pillar-icon";
import type { Pillar } from "@/services/cms/types";

export function PillarGrid({
  pillars,
  eyebrow = "The 5 Pillars",
  title = "A complete learning ecosystem for",
  accent = "holistic development.",
  lede,
}: {
  pillars: Pillar[];
  eyebrow?: string;
  title?: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <Section labelledBy="pillars-heading">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          id="pillars-heading"
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          lede={lede}
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar._id} delay={staggerDelay(i)}>
              <LinkCard
                href={`/approach/pillars/${pillar.slug}`}
                tint={pillar.tint}
                className="flex h-full flex-col gap-3 p-6"
              >
                <PillarIcon
                  name={pillar.icon}
                  className={PILLAR_ACCENT_CLASS[pillar.tint]}
                />
                <h3 className="text-h3 text-ink font-bold">{pillar.title}</h3>
                <p className="text-body-sm text-ink-muted flex-1">
                  {pillar.shortDescription}
                </p>
                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className={`${PILLAR_ACCENT_CLASS[pillar.tint]} transition-transform duration-150 group-hover:translate-x-1`}
                />
              </LinkCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
