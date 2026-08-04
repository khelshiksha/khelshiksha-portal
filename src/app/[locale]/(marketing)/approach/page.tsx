import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { BenefitList } from "@/components/blocks/content/benefit-list";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { AlignmentStrip } from "@/components/blocks/content/alignment-strip";
import { GameCornerBand } from "@/components/blocks/content/game-corner-band";
import { CTABand } from "@/components/blocks/content/cta-band";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import {
  getAlignments,
  getBenefits,
  getPillars,
  getVisionAndMission,
} from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Learning Through Play",
  description:
    "The philosophy behind every Khel Shiksha kit: shifting from rote memorization to learning by doing, across five pillars of holistic development.",
  path: "/approach",
});

export default async function ApproachPage() {
  const [benefits, pillars, alignments, { vision, mission }] =
    await Promise.all([
      getBenefits(),
      getPillars(),
      getAlignments(),
      getVisionAndMission(),
    ]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[{ name: "Learning Through Play", path: "/approach" }]}
        />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="flex flex-col gap-12">
          <SectionTitle
            level={1}
            eyebrow="Our approach"
            title="Learning through"
            accent="play."
            lede={vision}
          />

          <ul className="grid gap-4 sm:grid-cols-3">
            {mission.map((item, i) => (
              <Reveal as="li" key={item} delay={staggerDelay(i)}>
                <div className="border-rule bg-surface h-full rounded-[var(--radius-lg)] border p-6">
                  <span
                    aria-hidden="true"
                    className="tabular text-brand text-[0.8125rem] font-bold"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-body text-ink mt-2">{item}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <BenefitList benefits={benefits} />
      <PillarGrid pillars={pillars} />
      <GameCornerBand />
      <AlignmentStrip alignments={alignments} />

      <CTABand
        title="See it working in"
        accent="your classroom."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "Browse the kits", href: "/products" }}
      />
    </>
  );
}
