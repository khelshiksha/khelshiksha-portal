import { ROUTES } from "./constants";
import type { Dictionary } from "./i18n";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

/**
 * Navigation leads with WHO you are, not WHAT we sell - a principal and a
 * parent need completely different proof and different next actions.
 *
 * Products are deliberately NOT top-level. They live under "What We Do" as
 * evidence, so a visitor who wants to understand the approach is never dumped
 * into a grid of boxes.
 *
 * These are FUNCTIONS OF THE DICTIONARY, not constants. They used to be
 * exported arrays with English labels baked in, which meant the navigation -
 * the one component on every page - could never be translated no matter how
 * complete the dictionary was.
 *
 * Hrefs stay unprefixed. Locale prefixing happens at the point of rendering,
 * through localeHref, so this file never has to know which language it is in.
 *
 * Kit names are NOT translated. "Aryabhata" and "Brainy Bee" are the
 * products' actual names, printed on the boxes that arrive at the school;
 * translating them would leave a teacher unable to match the site to the kit
 * in their hands.
 *
 * That reasoning now cuts the other way for one of them: the kit the company
 * renamed to "Road Safety" is still boxed as "Project SURAKSHA". Until the
 * printing catches up, a teacher holding the box will not find that name on
 * this site. Flagged rather than worked around - a parenthetical here would
 * be a website apologising for a label it does not control.
 */
export function audienceNav(t: Dictionary): NavLink[] {
  return [
    { label: t.nav.forSchools, href: ROUTES.schools },
    { label: t.nav.forParents, href: ROUTES.parents },
    /* nav.government, not menu.governmentNgos: the bar's copy is shorter
       than the menu's and the footer's. See the width budget on
       nav.forSchools in i18n/dictionaries/en.ts. */
    { label: t.nav.government, href: ROUTES.government },
    /* Last, not in the Teachers slot it replaced. The first three are the
       readers who arrive looking for a product; CSR arrives looking for a
       programme to fund, and putting it second would push Parents down the
       list for the larger audience's benefit. */
    { label: t.nav.forCorporate, href: ROUTES.corporate },
  ];
}

export function whatWeDoMenu(t: Dictionary): NavGroup[] {
  return [
    {
      heading: t.menu.theApproach,
      links: [
        {
          label: t.menu.learningThroughPlay,
          href: ROUTES.approach,
          description: t.menu.learningThroughPlayDesc,
        },
        {
          label: t.menu.whyExperiential,
          href: ROUTES.whyExperiential,
          description: t.menu.whyExperientialDesc,
        },
        {
          label: t.menu.gameCorner,
          href: ROUTES.gameCorner,
          description: t.menu.gameCornerDesc,
        },
      ],
    },
    {
      heading: t.menu.fivePillars,
      links: [
        {
          label: t.pillars["foundational-learning"],
          href: `${ROUTES.pillars}/foundational-learning`,
        },
        {
          label: t.pillars["health-nutrition"],
          href: `${ROUTES.pillars}/health-nutrition`,
        },
        {
          label: t.pillars["climate-education"],
          href: `${ROUTES.pillars}/climate-education`,
        },
        {
          label: t.pillars["future-readiness"],
          href: `${ROUTES.pillars}/future-readiness`,
        },
        {
          label: t.pillars["life-skills"],
          href: `${ROUTES.pillars}/life-skills`,
        },
      ],
    },
    {
      heading: t.menu.learningKits,
      links: [
        { label: t.menu.allKits, href: ROUTES.products },
        {
          label: "Road Safety",
          href: `${ROUTES.products}/road-safety`,
        },
        { label: "Aryabhata", href: `${ROUTES.products}/aryabhata` },
        { label: "Yoga Safari", href: `${ROUTES.products}/yoga-safari` },
        { label: "Brainy Bee", href: `${ROUTES.products}/brainy-bee` },
      ],
    },
    /* ABOUT US IS NOT IN THIS MENU, deliberately, and this column is what is
       left after it moved out.

       It was here for one release, as a way to surface a page that had been
       footer-only. It is now a top-level item in the bar instead, and listing
       it in both places would mean the same link twice on one screen - the
       thing that made the old hero's buttons redundant with the header.

       Impact stays because the bar has no room for it, so this column is the
       only place in the header it appears. One link is a thin column, and it
       is still the right column: it is the only Company-register page in a
       menu otherwise made of programme and product. */
    {
      heading: t.menu.company,
      links: [
        {
          label: t.menu.ourImpact,
          href: ROUTES.impact,
          description: t.menu.ourImpactDesc,
        },
      ],
    },
  ];
}

export function footerGroups(t: Dictionary): NavGroup[] {
  return [
    {
      heading: t.menu.explore,
      links: [
        { label: t.menu.learningThroughPlay, href: ROUTES.approach },
        { label: t.menu.fivePillars, href: ROUTES.pillars },
        { label: t.menu.learningKits, href: ROUTES.products },
        { label: t.menu.gameCorner, href: ROUTES.gameCorner },
        { label: t.menu.ourImpact, href: ROUTES.impact },
      ],
    },
    {
      heading: t.menu.forYou,
      links: [
        { label: t.menu.schools, href: ROUTES.schools },
        { label: t.menu.parents, href: ROUTES.parents },
        { label: t.menu.governmentNgos, href: ROUTES.government },
        { label: t.menu.corporate, href: ROUTES.corporate },
      ],
    },
    {
      heading: t.menu.company,
      links: [
        { label: t.menu.aboutUs, href: ROUTES.about },
        { label: t.nav.contact, href: ROUTES.contact },
        { label: t.menu.privacy, href: ROUTES.privacy },
        { label: t.menu.terms, href: ROUTES.terms },
      ],
    },
  ];
}
