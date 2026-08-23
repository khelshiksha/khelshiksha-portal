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
 * Kit names are NOT translated. "Project SURAKSHA" and "Aryabhata" are the
 * products' actual names, printed on the boxes that arrive at the school;
 * translating them would leave a teacher unable to match the site to the kit
 * in their hands.
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
          label: "Project SURAKSHA",
          href: `${ROUTES.products}/project-suraksha`,
        },
        { label: "Aryabhata", href: `${ROUTES.products}/aryabhata` },
        { label: "Yoga Safari", href: `${ROUTES.products}/yoga-safari` },
        { label: "Brainy Bee", href: `${ROUTES.products}/brainy-bee` },
      ],
    },
    /* ABOUT US WAS REACHABLE ONLY FROM THE FOOTER, which is to say only by
       someone who had already scrolled a full page looking for it. It is one
       of the sections the company brief leads with, and "who are these
       people" is a question a principal asks BEFORE reading the programme,
       not after.

       It goes in this menu rather than the header bar because that bar is
       already at its width limit - see nav.forSchools in
       i18n/dictionaries/en.ts. The menu grid widens from three columns to
       four to take it. */
    {
      heading: t.menu.company,
      links: [
        {
          label: t.menu.aboutUs,
          href: ROUTES.about,
          description: t.menu.aboutUsDesc,
        },
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
