import { audiences } from "@/content/audiences";
import { impactStats, partners, testimonials } from "@/content/impact";
import { pillars } from "@/content/pillars";
import { products } from "@/content/products";
import { alignments, benefits, faqs, mission, vision } from "@/content/site";
import { credentialGroups } from "@/content/credentials";
import { pressCuttings } from "@/content/press";
import type { AudienceKey, PillarKey } from "@/lib/constants";
import type {
  AudienceHub,
  CredentialGroup,
  PressCutting,
  Benefit,
  FaqItem,
  ImpactStat,
  Partner,
  Pillar,
  Product,
  Testimonial,
} from "./types";

/**
 * THE CONTENT BOUNDARY.
 *
 * Every read of site content goes through this module. Today it is backed by
 * typed local files under src/content; when a Sanity project exists these
 * functions become GROQ queries and NOTHING ELSE IN THE CODEBASE CHANGES.
 *
 * That is the whole point of the indirection - see decision D1. Pages and
 * components must never import from src/content directly.
 *
 * The functions are async even though the local implementation is
 * synchronous, so that the swap does not turn every call site into a
 * refactor.
 */

/* --- Products ----------------------------------------------------------- */

export async function getProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => a.order - b.order);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  const product = await getProductBySlug(slug);
  if (!product) return [];
  return product.relatedSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
}

export async function getProductsByPillar(key: PillarKey): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.pillars.includes(key));
}

/* --- Pillars ------------------------------------------------------------ */

export async function getPillars(): Promise<Pillar[]> {
  return [...pillars].sort((a, b) => a.order - b.order);
}

export async function getPillarBySlug(
  slug: string,
): Promise<Pillar | undefined> {
  return pillars.find((p) => p.slug === slug);
}

export async function getPillarSlugs(): Promise<string[]> {
  return pillars.map((p) => p.slug);
}

/* --- Audience hubs ------------------------------------------------------ */

export async function getAudienceHub(
  key: AudienceKey,
): Promise<AudienceHub | undefined> {
  return audiences.find((a) => a.key === key);
}

export async function getAudienceHubs(): Promise<AudienceHub[]> {
  return audiences;
}

/* --- Proof and site copy ------------------------------------------------ */

export async function getImpactStats(): Promise<ImpactStat[]> {
  return impactStats;
}

export async function getPartners(): Promise<Partner[]> {
  return [...partners]
    .filter((p) => p.showOnHomepage)
    .sort((a, b) => a.order - b.order);
}

/** Currently empty by design - see the note in src/content/impact.ts. */
export async function getTestimonials(
  audience?: AudienceKey,
): Promise<Testimonial[]> {
  return audience
    ? testimonials.filter((t) => t.audience === audience)
    : testimonials;
}

export async function getBenefits(): Promise<Benefit[]> {
  return [...benefits].sort((a, b) => a.order - b.order);
}

export async function getFaqs(
  audience: AudienceKey | "general",
): Promise<FaqItem[]> {
  return faqs
    .filter((f) => f.audience === audience)
    .sort((a, b) => a.order - b.order);
}

export async function getAlignments() {
  return alignments;
}

export async function getVisionAndMission() {
  return { vision, mission };
}

export type * from "./types";

/* --- Credibility -------------------------------------------------------- */

export async function getCredentialGroups(): Promise<CredentialGroup[]> {
  return credentialGroups;
}

export async function getPressCuttings(): Promise<PressCutting[]> {
  return pressCuttings;
}
