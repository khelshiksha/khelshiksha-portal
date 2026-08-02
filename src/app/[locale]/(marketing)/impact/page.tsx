import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { AlignmentStrip } from "@/components/blocks/content/alignment-strip";
import { CTABand } from "@/components/blocks/content/cta-band";
import { LogoWall } from "@/components/blocks/proof/logo-wall";
import { PressGallery } from "@/components/blocks/proof/press-gallery";
import { VideoPanel } from "@/components/blocks/media/video-panel";
import {
  getAlignments,
  getCredentialGroups,
  getImpactStats,
  getPressCuttings,
} from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Our Impact",
  description:
    "12,000+ learning kits delivered to PM SHRI schools across Gujarat, learning modules developed for UNICEF, and a kit built for the 1st World Yogasana Sports Championship.",
  path: "/impact",
});

export default async function ImpactPage() {
  const [stats, alignments, credentials, cuttings] = await Promise.all([
    getImpactStats(),
    getAlignments(),
    getCredentialGroups(),
    getPressCuttings(),
  ]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs trail={[{ name: "Our Impact", path: "/impact" }]} />
      </Container>

      <Section className="pt-10 pb-0 sm:pt-12">
        <Container>
          <SectionTitle
            level={1}
            eyebrow="Proven impact"
            title="Delivered at scale,"
            accent="already."
            lede="Every figure below is traceable to work we have actually done. Nothing here is estimated or rounded up — the people who read this page check."
          />
        </Container>
      </Section>

      <StatBand stats={stats} eyebrow="" title="By the numbers" accent="" />

      <AlignmentStrip alignments={alignments} />

      <LogoWall groups={credentials} tone="sunken" />

      <PressGallery
        cuttings={cuttings}
        heading="In the press"
        intro="Gujarati coverage of our training sessions and classroom programmes. Shown as scanned, not retyped."
      />

      <VideoPanel
        heading="See a session"
        intro="What a Khel Shiksha classroom actually looks like when the kits come out."
      />

      <CTABand
        title="Bring this to your"
        accent="district."
        primary={{ label: "Request a proposal", href: "/contact?type=government" }}
        secondary={{ label: "Book a demo", href: "/contact?type=school-demo" }}
      />
    </>
  );
}
