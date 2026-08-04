import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { CTABand } from "@/components/blocks/content/cta-band";
import { getPillars } from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "The 5 Pillars",
  description:
    "Foundational learning, health and nutrition, climate education, future readiness and life skills — a complete ecosystem for holistic development.",
  path: "/approach/pillars",
});

export default async function PillarsPage() {
  const pillars = await getPillars();

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { name: "Learning Through Play", path: "/approach" },
            { name: "The 5 Pillars", path: "/approach/pillars" },
          ]}
        />
      </Container>

      <Section className="pt-10 pb-0 sm:pt-12">
        <Container>
          <SectionTitle
            level={1}
            eyebrow="The 5 Pillars"
            title="A complete learning ecosystem for"
            accent="holistic development."
            lede="Every kit sits under one of five pillars. Together they cover what a child needs beyond the syllabus — and each maps to a national mission a school already reports on."
          />
        </Container>
      </Section>

      <PillarGrid
        pillars={pillars}
        eyebrow=""
        title="Explore each pillar"
        accent=""
      />

      <CTABand
        title="Which pillars matter most to"
        accent="your school?"
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
      />
    </>
  );
}
