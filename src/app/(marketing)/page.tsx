import { HeroHome } from "@/components/blocks/heroes/hero-home";
import { TrustBar } from "@/components/blocks/proof/trust-bar";
import { AudienceSplit } from "@/components/blocks/content/audience-split";
import { BenefitList } from "@/components/blocks/content/benefit-list";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { FeaturedKits } from "@/components/blocks/product/featured-kits";
import { GameCornerBand } from "@/components/blocks/content/game-corner-band";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { CTABand } from "@/components/blocks/content/cta-band";
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
