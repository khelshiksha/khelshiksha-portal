import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { CTABand } from "@/components/blocks/content/cta-band";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import { getImpactStats, getVisionAndMission } from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Khel Shiksha builds gamified experiential learning kits and teacher training for Vidyalayas across India, in partnership with UNICEF and the Government of Gujarat.",
  path: "/about",
});

export default async function AboutPage() {
  const [{ vision, mission }, stats] = await Promise.all([
    getVisionAndMission(),
    getImpactStats(),
  ]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="flex flex-col gap-12">
          <SectionTitle
            level={1}
            eyebrow="About us"
            title="We build curiosity, not"
            accent="educational toys."
            lede={vision}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {mission.map((item, i) => (
              <Reveal key={item} delay={staggerDelay(i)}>
                <div className="h-full rounded-[var(--radius-lg)] border border-rule bg-surface p-6">
                  <p className="text-[0.6875rem] font-bold tracking-[0.12em] text-ink-subtle uppercase">
                    Mission {i + 1}
                  </p>
                  <p className="mt-2 text-body text-ink">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <StatBand stats={stats} eyebrow="Credibility" title="What we have" accent="actually delivered." />

      <CTABand
        title="Let's transform"
        accent="Vidyalayas."
        lede="A model for future-ready education — starting with one classroom in your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "See our approach", href: "/approach" }}
      />
    </>
  );
}
