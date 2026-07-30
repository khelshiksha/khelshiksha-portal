import type { MetadataRoute } from "next";
import { SITE, ROUTES } from "@/lib/constants";
import { getPillarSlugs, getProductSlugs } from "@/services/cms";

/** Generated from the content layer — a new kit appears without a code change. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, pillarSlugs] = await Promise.all([
    getProductSlugs(),
    getPillarSlugs(),
  ]);

  const now = new Date();
  const url = (path: string) => new URL(path, SITE.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(ROUTES.home), changeFrequency: "weekly", priority: 1 },
    { url: url(ROUTES.schools), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.teachers), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.parents), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.government), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.products), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.approach), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.whyExperiential), changeFrequency: "monthly", priority: 0.7 },
    { url: url(ROUTES.pillars), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.gameCorner), changeFrequency: "monthly", priority: 0.7 },
    { url: url(ROUTES.impact), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.about), changeFrequency: "monthly", priority: 0.6 },
    { url: url(ROUTES.contact), changeFrequency: "yearly", priority: 0.6 },
    { url: url(ROUTES.privacy), changeFrequency: "yearly", priority: 0.2 },
    { url: url(ROUTES.terms), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticRoutes,
    ...productSlugs.map((slug) => ({
      url: url(`${ROUTES.products}/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...pillarSlugs.map((slug) => ({
      url: url(`${ROUTES.pillars}/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ].map((entry) => ({ lastModified: now, ...entry }));
}
