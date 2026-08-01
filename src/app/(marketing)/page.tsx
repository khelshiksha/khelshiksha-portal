import { HeroHome } from "@/components/blocks/heroes/hero-home";
import { TrustBar } from "@/components/blocks/proof/trust-bar";
import { AudienceSplit } from "@/components/blocks/content/audience-split";
import { BenefitList } from "@/components/blocks/content/benefit-list";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { FeaturedKits } from "@/components/blocks/product/featured-kits";
import { GameCornerBand } from "@/components/blocks/content/game-corner-band";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { CTABand } from "@/components/blocks/content/cta-band";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import {
  getAudienceHubs,
  getBenefits,
  getFeaturedProducts,
  getImpactStats,
  getPartners,
  getPillars,
} from "@/services/cms";

/* CMS-driven, changes rarely, must be instant. Webhook revalidation will make
   this a ceiling rather than a latency once Sanity is wired. */
export const revalidate = 3600;

/**
 * The home page was the one route that never called buildMetadata, so it
 * inherited the root layout's metadata — which carries no canonical. The most
 * linked-to page on the site was the only one without one.
 *
 * `title.absolute` opts out of the layout's "%s | Khel Shiksha" template,
 * which would otherwise render "Khel Shiksha — Learning Through Play | Khel
 * Shiksha". Not `title: null` — that removes the <title> element altogether,
 * which is a serious WCAG failure and exactly what the axe suite caught.
 */
export const metadata: Metadata = {
  ...buildMetadata({
    title: `${SITE.name} — ${SITE.secondary}`,
    description:
      "Gamified experiential learning kits, teacher training and classroom ecosystems for schools across India. Aligned to NEP 2020 and NCF 2023.",
    path: "/",
  }),
  title: { absolute: `${SITE.name} — ${SITE.secondary}` },
};

export default async function HomePage() {
  const [audiences, benefits, pillars, featured, stats, partners] =
    await Promise.all([
      getAudienceHubs(),
      getBenefits(),
      getPillars(),
      getFeaturedProducts(4),
      getImpactStats(),
      getPartners(),
    ]);

  return (
    <>
      <HeroHome />
      <TrustBar partners={partners} />
      <AudienceSplit audiences={audiences} />
      <BenefitList benefits={benefits} />
      <PillarGrid pillars={pillars} />
      <FeaturedKits products={featured} pillars={pillars} />
      <GameCornerBand />
      <StatBand
        stats={stats}
        cta={{ label: "See our impact in full", href: "/impact" }}
      />
      <CTABand
        title="Let's transform"
        accent="Vidyalayas"
        lede="A model for future-ready education — starting with one classroom in your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "Explore the kits", href: "/products" }}
      />
    </>
  );
}
