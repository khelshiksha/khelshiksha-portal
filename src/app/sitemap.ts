import type { MetadataRoute } from "next";
import { SITE, ROUTES } from "@/lib/constants";
import { getPillarSlugs, getProductSlugs } from "@/services/cms";

/** Generated from the content layer - a new kit appears without a code change. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, pillarSlugs] = await Promise.all([
    getProductSlugs(),
    getPillarSlugs(),
  ]);

  const url = (path: string) => new URL(path, SITE.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(ROUTES.home), changeFrequency: "weekly", priority: 1 },
    { url: url(ROUTES.schools), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.parents), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.government), changeFrequency: "weekly", priority: 0.9 },
    /* ROUTES.teachers is deliberately ABSENT: it is a 301 to /schools now,
       and a sitemap that advertises a redirect asks a crawler to spend
       budget discovering that. The redirect exists for inbound links, not
       to be published. */
    { url: url(ROUTES.corporate), changeFrequency: "weekly", priority: 0.9 },
    { url: url(ROUTES.products), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.approach), changeFrequency: "monthly", priority: 0.8 },
    {
      url: url(ROUTES.whyExperiential),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: url(ROUTES.pillars), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.gameCorner), changeFrequency: "monthly", priority: 0.7 },
    { url: url(ROUTES.impact), changeFrequency: "monthly", priority: 0.8 },
    { url: url(ROUTES.about), changeFrequency: "monthly", priority: 0.6 },
    { url: url(ROUTES.contact), changeFrequency: "yearly", priority: 0.6 },
    { url: url(ROUTES.privacy), changeFrequency: "yearly", priority: 0.2 },
    { url: url(ROUTES.terms), changeFrequency: "yearly", priority: 0.2 },
  ];

  /* No lastModified. It used to be `new Date()` on every entry, which meant
     all 26 URLs claimed to have changed at the moment of the last deploy - 
     including the privacy policy. Google treats an unreliable lastmod as a
     reason to stop trusting the field, so an absent one is strictly better
     than a wrong one. It comes back when the content layer carries real
     dates (Sanity has _updatedAt). */
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
  ];
}
