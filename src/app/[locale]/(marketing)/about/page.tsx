import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionFigure } from "@/components/ui/section-figure";
import { FounderGrid } from "@/components/blocks/content/founder-grid";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { CTABand } from "@/components/blocks/content/cta-band";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import {
  getFounders,
  getImpactStats,
  getVisionAndMission,
} from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Khel Shiksha builds gamified experiential learning kits and teacher training for Vidyalayas across India, in partnership with UNICEF and the Government of Gujarat.",
  path: "/about",
});

export default async function AboutPage() {
  const [{ vision, mission }, stats, founders] = await Promise.all([
    getVisionAndMission(),
    getImpactStats(),
    getFounders(),
  ]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="flex flex-col gap-12">
          {/* THE FIGURE SHOWS THE BENCH, NOT A CLASSROOM, and that is the
              whole reason this page gets one.

              Every other figure on the site is children using the product.
              Here the reader is asking who we are, and the honest answer is
              the three people designing the games - which is also the only
              claim on this page a photograph can actually support. A
              classroom shot here would just be the Schools hub again.

              Laid out as a row rather than through HeroAudience: this page
              has no hub, no eyebrow CTA pair and no tint band, so it borrows
              only the figure component. `items-start` because the headline
              column here is prose that keeps growing, and bottom-aligning it
              against a fixed 4:5 box strands the lede. */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <SectionTitle
              level={1}
              eyebrow="About us"
              title="We build curiosity, not"
              accent="educational toys."
              lede={vision}
            />

            <SectionFigure
              image={{
                src: "/images/sections/about-workshop.webp",
                alt: "Three Khel Shiksha designers at a workbench developing a board game, with printed game cards laid out, colour proofs, wooden tokens and a finished kit box on the table.",
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {mission.map((item, i) => (
              <Reveal key={item} delay={staggerDelay(i)}>
                <div className="border-rule bg-surface h-full rounded-[var(--radius-lg)] border p-6">
                  <p className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
                    Mission {i + 1}
                  </p>
                  <p className="text-body text-ink mt-2">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* AFTER THE MISSION, BEFORE THE NUMBERS. The page argues what we are
          for, then who is behind it, then what that has produced - which is
          the order a reader asks those things in.

          Renders nothing while content/founders.ts is empty, which it is
          until real names and bios exist. See the note in that file. */}
      <FounderGrid founders={founders} />

      <StatBand
        stats={stats}
        eyebrow="Credibility"
        title="What we have"
        accent="actually delivered."
      />

      <CTABand
        title="Let's transform"
        accent="Vidyalayas."
        lede="A model for future-ready education, starting with one classroom in your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "See our approach", href: "/approach" }}
      />
    </>
  );
}
