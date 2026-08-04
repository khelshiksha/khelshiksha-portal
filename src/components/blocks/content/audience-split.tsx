import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { LinkCard } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import { PILLAR_ACCENT_CLASS } from "@/lib/constants";
import type { AudienceHub } from "@/services/cms/types";

/**
 * The most important section on the homepage.
 *
 * Navigation leads with WHO you are because a principal and a parent need
 * completely different proof and completely different next actions. This is
 * the fork that sends each of them down the right path.
 */
export function AudienceSplit({ audiences }: { audiences: AudienceHub[] }) {
  return (
    <Section tint="bg-surface" labelledBy="audience-heading">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          id="audience-heading"
          eyebrow="Start here"
          title="Who are we"
          accent="helping today?"
          lede="The same kits, explained for the decision you are actually making."
          align="center"
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, i) => (
            <Reveal as="li" key={audience.key} delay={staggerDelay(i)}>
              <LinkCard
                href={audience.slug}
                tint={audience.tint}
                className="flex h-full flex-col gap-3 p-7"
              >
                <h3 className="text-h3 text-ink font-bold">
                  {audience.eyebrow.replace(/^For /, "")}
                </h3>
                <p className="text-body-sm text-ink-muted flex-1">
                  {audience.lede}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-[0.8125rem] font-bold ${PILLAR_ACCENT_CLASS[audience.tint]}`}
                >
                  {audience.primaryCta.label}
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </span>
              </LinkCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
