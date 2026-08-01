/**
 * The five zones of KhelVerse.
 *
 * These are NOT invented subjects. Each one is a real pillar with a real page,
 * so the world is navigation rather than scenery: hovering a zone shows a
 * principal something true about the programme, and clicking it goes where the
 * label says. A world of made-up districts would look the same and mean
 * nothing.
 *
 * Order is the walking order around the island, which is also the order the
 * die hops in and therefore the order the headline words appear in. Five
 * zones, five words — see hero-artwork's HeroWords tuple.
 */
export type Zone = {
  slug: string;
  label: string;
  blurb: string;
  /** Grid origin of the zone's platform. */
  gx: number;
  gy: number;
  accent: string;
};

export const PLATFORM = 2.8;
export const PLATFORM_H = 0.52;

export const ZONES: readonly Zone[] = [
  {
    slug: "foundational-learning",
    label: "Foundational Learning",
    blurb: "Numeracy and literacy through play",
    gx: 0.6,
    gy: 3.6,
    accent: "var(--pillar-sky)",
  },
  {
    slug: "climate-education",
    label: "Climate Education",
    blurb: "Mission LiFE in the classroom",
    gx: 3.6,
    gy: 0.6,
    accent: "var(--pillar-mint)",
  },
  {
    slug: "future-readiness",
    label: "Future Readiness",
    blurb: "STEM, curiosity and problem solving",
    gx: 7.6,
    gy: 2.4,
    accent: "var(--pillar-lavender)",
  },
  {
    slug: "health-nutrition",
    label: "Health & Nutrition",
    blurb: "Fit India and Eat Right India",
    gx: 7.8,
    gy: 6.2,
    accent: "var(--pillar-peach)",
  },
  {
    slug: "life-skills",
    label: "Life Skills",
    blurb: "Teamwork, expression and confidence",
    gx: 3.4,
    gy: 8.0,
    accent: "var(--pillar-blush)",
  },
];

/** Centre of a zone's platform, in grid units. */
export function zoneCentre(zone: Zone) {
  return { gx: zone.gx + PLATFORM / 2, gy: zone.gy + PLATFORM / 2 };
}

/** Discovery Square — the plaza the paths radiate from. */
export const PLAZA = { gx: 4.4, gy: 4.4, size: 2.6, h: 0.2 };
export const PLAZA_CENTRE = {
  gx: PLAZA.gx + PLAZA.size / 2,
  gy: PLAZA.gy + PLAZA.size / 2,
};
