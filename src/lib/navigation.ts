import { ROUTES } from "./constants";

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
 * Navigation leads with WHO you are, not WHAT we sell — a principal and a
 * parent need completely different proof and different next actions.
 *
 * Products are deliberately NOT top-level. They live under "What We Do" as
 * evidence, so a visitor who wants to understand the approach is never dumped
 * into a grid of boxes.
 */
export const audienceNav: NavLink[] = [
  { label: "For Schools", href: ROUTES.schools },
  { label: "For Teachers", href: ROUTES.teachers },
  { label: "For Parents", href: ROUTES.parents },
  { label: "Government", href: ROUTES.government },
];

export const whatWeDoMenu: NavGroup[] = [
  {
    heading: "The Approach",
    links: [
      {
        label: "Learning Through Play",
        href: ROUTES.approach,
        description: "The philosophy behind every kit",
      },
      {
        label: "Why Experiential?",
        href: ROUTES.whyExperiential,
        description: "Five things that change in a classroom",
      },
      {
        label: "The Game Corner",
        href: ROUTES.gameCorner,
        description: "A learning zone inside your school",
      },
    ],
  },
  {
    heading: "The 5 Pillars",
    links: [
      { label: "Foundational Learning", href: `${ROUTES.pillars}/foundational-learning` },
      { label: "Health & Nutrition", href: `${ROUTES.pillars}/health-nutrition` },
      { label: "Climate Education", href: `${ROUTES.pillars}/climate-education` },
      { label: "Future Readiness", href: `${ROUTES.pillars}/future-readiness` },
      { label: "Life Skills", href: `${ROUTES.pillars}/life-skills` },
    ],
  },
  {
    heading: "Learning Kits",
    links: [
      { label: "All learning kits", href: ROUTES.products },
      { label: "Project SURAKSHA", href: `${ROUTES.products}/project-suraksha` },
      { label: "Aryabhata", href: `${ROUTES.products}/aryabhata` },
      { label: "Yoga Safari", href: `${ROUTES.products}/yoga-safari` },
      { label: "Brainy Bee", href: `${ROUTES.products}/brainy-bee` },
    ],
  },
];

export const footerGroups: NavGroup[] = [
  {
    heading: "Explore",
    links: [
      { label: "Learning Through Play", href: ROUTES.approach },
      { label: "The 5 Pillars", href: ROUTES.pillars },
      { label: "Learning Kits", href: ROUTES.products },
      { label: "The Game Corner", href: ROUTES.gameCorner },
      { label: "Our Impact", href: ROUTES.impact },
    ],
  },
  {
    heading: "For you",
    links: [
      { label: "Schools", href: ROUTES.schools },
      { label: "Teachers", href: ROUTES.teachers },
      { label: "Parents", href: ROUTES.parents },
      { label: "Government & NGOs", href: ROUTES.government },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Terms", href: ROUTES.terms },
    ],
  },
];
