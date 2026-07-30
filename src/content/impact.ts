import type { ImpactStat, Partner, Testimonial } from "@/services/cms/types";

/**
 * IMPORTANT — every figure here is traceable to the company profile brochure
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
 * Named credibility markers from the brochure.
 *
 * Logo images are deliberately absent — the marks were read by inference from
 * a print scan, and we do not hold vector files or written permission yet
 * (blocker #2, docs/architecture/14-implementation-roadmap.md). Until then
 * these render as typographic wordmarks, which states the association without
 * reproducing a mark we have no licence to use.
 */
export const partners: Partner[] = [
  { _id: "p-unicef", name: "UNICEF", partnerType: "ngo", showOnHomepage: true, order: 1 },
  { _id: "p-pmshri", name: "PM SHRI", partnerType: "govt", showOnHomepage: true, order: 2 },
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
  { _id: "p-geda", name: "GEDA", partnerType: "govt", showOnHomepage: true, order: 5 },
  {
    _id: "p-yogasana",
    name: "World Yogasana",
    partnerType: "institution",
    showOnHomepage: true,
    order: 6,
  },
];

/**
 * DELIBERATELY EMPTY.
 *
 * Testimonials attributed to named principals and teachers are records about
 * real people. Writing plausible-sounding quotes and presenting them as
 * genuine would be fabrication, regardless of how clearly they were labelled
 * in the code — the rendered page would read as real endorsement.
 *
 * The component handles the empty case by omitting the section entirely, so
 * the page is complete without them. Collecting three real quotes (one
 * principal, one teacher, one parent) from the PM SHRI deployments is a
 * content task and is tracked as such.
 */
export const testimonials: Testimonial[] = [];
