import { HeroHome } from "@/components/blocks/heroes/hero-home";
import { TrustBar } from "@/components/blocks/proof/trust-bar";
import { LogoMarquee } from "@/components/blocks/proof/logo-marquee";
import { AudienceSplit } from "@/components/blocks/content/audience-split";
import { BenefitList } from "@/components/blocks/content/benefit-list";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { FeaturedKits } from "@/components/blocks/product/featured-kits";
import { GameCornerBand } from "@/components/blocks/content/game-corner-band";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { PressRail } from "@/components/blocks/proof/press-rail";
import { CTABand } from "@/components/blocks/content/cta-band";
import { AssistantSection } from "@/features/assistant/components/assistant-section";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import {
  getAudienceHubs,
  getBenefits,
  getFeaturedProducts,
  getImpactStats,
  getCredentialGroups,
  getPillars,
  getAlignments,
  getPressCuttings,
} from "@/services/cms";

/* CMS-driven, changes rarely, must be instant. Webhook revalidation will make
   this a ceiling rather than a latency once Sanity is wired. */
export const revalidate = 3600;

/**
 * The home page was the one route that never called buildMetadata, so it
 * inherited the root layout's metadata - which carries no canonical. The most
 * linked-to page on the site was the only one without one.
 *
 * `title.absolute` opts out of the layout's "%s | Khel Shiksha" template,
 * which would otherwise render "Khel Shiksha - Learning Through Play | Khel
 * Shiksha". Not `title: null` - that removes the <title> element altogether,
 * which is a serious WCAG failure and exactly what the axe suite caught.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: `${SITE.name} | ${SITE.secondary}`,
    description:
      "Gamified experiential learning kits, teacher training and classroom ecosystems for schools across India. Aligned to NEP 2020 and NCF 2023.",
    path: "/",
  }),
  title: { absolute: `${SITE.name} | ${SITE.secondary}` },
};

export default async function HomePage() {
  const [
    audiences,
    benefits,
    pillars,
    featured,
    stats,
    alignments,
    credentials,
    press,
  ] = await Promise.all([
    getAudienceHubs(),
    getBenefits(),
    getPillars(),
    getFeaturedProducts(4),
    getImpactStats(),
    getAlignments(),
    getCredentialGroups(),
    getPressCuttings(),
  ]);

  return (
    <>
      <HeroHome />
      <TrustBar alignments={alignments} />

      {/* Directly after the trust bar, while "is this real?" is still the
          question. The rail is the short answer; /impact is the long one. */}
      <LogoMarquee
        groups={credentials}
        eyebrow="Where our work has gone"
        title="Built with, and for, these institutions."
      />
      <AudienceSplit audiences={audiences} />
      <BenefitList benefits={benefits} />
      <PillarGrid pillars={pillars} />
      <FeaturedKits products={featured} pillars={pillars} />
      <GameCornerBand />
      <AssistantSection />

      <StatBand
        stats={stats}
        cta={{ label: "See our impact in full", href: "/impact" }}
      />

      {/* AFTER THE NUMBERS, BEFORE THE ASK, and that order is the argument.

          The stat band is us saying what we delivered. This is other people
          having looked at it and written about it, which is the only kind of
          proof a reader cannot suspect us of having authored. Putting it
          between the claim and the "Book a Demo" band means the last thing
          before the ask is somebody else's word rather than ours.

          The brief here was a scrolling band of customer feedback. There are
          no testimonials to show - see the note in press-rail.tsx and the
          empty array in content/impact.ts - so this shows the coverage that
          genuinely exists instead of quotes that do not. */}
      <PressRail
        cuttings={press}
        eyebrow="In the press"
        title="What the papers have written about the work."
      />
      {/* THE ONE PAGE THAT GETS THE MASCOT, and the only one that asks for it.

          This band closes nine pages. It carries the figure here because the
          home page is the only one where the reader has not yet chosen who
          they are - a principal reading /schools or an officer reading
          /government has already self-selected into a register the mascot
          works against, and /impact spends its whole length establishing that
          the numbers are audited.

          It is also the last thing on the page, which is the point. The hero
          stays deliberately restrained - its LCP is the headline TEXT, and
          KhelVerse already has a die character driving the rotating word, so
          a second, glossier one in that viewport would be two characters
          competing to be the same idea. Opening quiet and closing warm is the
          right order for a page whose job is to be believed first and liked
          second. */}
      <CTABand
        title="Let's transform"
        accent="Vidyalayas"
        lede="A model for future-ready education, starting with one classroom in your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "Explore the kits", href: "/products" }}
        mascot
      />
    </>
  );
}
