import type { ImpactStat, Partner, Testimonial } from "@/services/cms/types";

/**
 * IMPORTANT - every figure here is traceable to the company profile brochure
 * (see docs/brand-context.md). Nothing on this page is estimated, rounded up,
 * or inferred.
 *
 * If a number cannot be sourced, it does not appear. A credibility section
 * that contains one invented statistic is worse than a shorter one, because
 * the audience for this page (principals, district officers, funders) checks.
 */
export const impactStats: ImpactStat[] = [
  {
    _id: "stat-kits",
    value: 12000,
    suffix: "+",
    label: "Educational kits delivered",
    detail: "To PM SHRI schools across Gujarat",
  },
  {
    _id: "stat-unicef",
    value: 1,
    label: "UNICEF partnership",
    detail: "Specialised learning modules developed",
  },
  {
    _id: "stat-pillars",
    value: 5,
    label: "Learning pillars",
    detail: "A complete ecosystem, not a product line",
  },
  {
    _id: "stat-championship",
    value: 1,
    label: "World championship kit",
    detail: "Veer's Yogasana Game Kit, built concept to product",
  },
];

/**
 * Named credibility markers, sourced from the company profile brochure.
 *
 * THESE RENDER AS TYPOGRAPHIC WORDMARKS, NOT AS LOGO IMAGES, and that is a
 * rule rather than a temporary state.
 *
 * An organisation's name set in type states a factual association. A
 * reproduction of its logo is a use of its trade mark, and most institutions
 * - government bodies and international agencies especially - publish brand
 * guidelines restricting third-party use, particularly where it could be read
 * as an endorsement.
 *
 * So a logo image belongs here only when two things are true: a licensed
 * vector asset exists (not a mark traced or inferred from a print scan), and
 * permission for this specific use is on file. Until both hold, the wordmark
 * is the correct and safe representation. See content/credentials.ts, which
 * handles the marks that do meet that bar and separates them by what they
 * actually claim.
 */
export const partners: Partner[] = [
  {
    _id: "p-unicef",
    name: "UNICEF",
    partnerType: "ngo",
    showOnHomepage: true,
    order: 1,
  },
  {
    _id: "p-pmshri",
    name: "PM SHRI",
    partnerType: "govt",
    showOnHomepage: true,
    order: 2,
  },
  {
    _id: "p-gujcost",
    name: "GUJCOST",
    partnerType: "govt",
    showOnHomepage: true,
    order: 3,
  },
  {
    _id: "p-edu-guj",
    name: "Education Department, Government of Gujarat",
    partnerType: "govt",
    showOnHomepage: true,
    order: 4,
  },
  {
    _id: "p-geda",
    name: "GEDA",
    partnerType: "govt",
    showOnHomepage: true,
    order: 5,
  },
  {
    _id: "p-yogasana",
    name: "World Yogasana",
    partnerType: "institution",
    showOnHomepage: true,
    order: 6,
  },
  /* On the brochure's credibility row (docs/brand-context.md) but missed when
     this list was first written. */
  {
    _id: "p-baps",
    name: "BAPS",
    partnerType: "institution",
    showOnHomepage: true,
    order: 7,
  },
];

/**
 * DELIBERATELY EMPTY.
 *
 * Testimonials attributed to named principals and teachers are records about
 * real people. Writing plausible-sounding quotes and presenting them as
 * genuine would be fabrication, regardless of how clearly they were labelled
 * in the code - the rendered page would read as real endorsement.
 *
 * The component handles the empty case by omitting the section entirely, so
 * the page is complete without them. Collecting three real quotes (one
 * principal, one teacher, one parent) from the PM SHRI deployments is a
 * content task and is tracked as such.
 */
export const testimonials: Testimonial[] = [];
