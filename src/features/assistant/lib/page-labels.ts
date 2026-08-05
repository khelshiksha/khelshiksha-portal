import { ROUTES } from "@/lib/constants";
import { getPillars, getProducts } from "@/services/cms";

/**
 * Human names for the paths the assistant is allowed to mention.
 *
 * Built from services/cms rather than hardcoded so a renamed kit renames its
 * link too - a static list here would silently drift from the catalogue the
 * model is grounded on, which is the one thing this whole feature is trying
 * to avoid.
 *
 * Computed on the server and handed to the panel as a prop: the client has no
 * reason to pull the catalogue over the wire just to caption a link.
 */
export async function getPageLabels(): Promise<Record<string, string>> {
  const [products, pillars] = await Promise.all([getProducts(), getPillars()]);

  return {
    /* Longest, most specific paths matter most - a demo link is the single
       most valuable thing the assistant can hand someone. */
    "/contact?type=school-demo": "book a demo",
    [ROUTES.contact]: "contact us",
    [ROUTES.products]: "our learning kits",
    [ROUTES.pillars]: "the five pillars",
    [ROUTES.gameCorner]: "the Game Corner",
    [ROUTES.whyExperiential]: "why experiential learning works",
    [ROUTES.approach]: "our approach",
    [ROUTES.schools]: "our schools programme",
    [ROUTES.teachers]: "teacher training",
    [ROUTES.parents]: "kits for parents",
    [ROUTES.government]: "government and NGO partnerships",
    [ROUTES.impact]: "our impact",
    [ROUTES.about]: "about Khel Shiksha",
    [ROUTES.privacy]: "our privacy policy",
    [ROUTES.terms]: "our terms",

    ...Object.fromEntries(
      products.map((p) => [`${ROUTES.products}/${p.slug}`, p.title]),
    ),
    ...Object.fromEntries(
      pillars.map((p) => [`${ROUTES.pillars}/${p.slug}`, p.title]),
    ),
  };
}
