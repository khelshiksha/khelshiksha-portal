/**
 * Shared vocabulary. Spec: docs/architecture/01-information-architecture.md
 * Route strings live here so a rename is one edit, not a grep.
 */

export const SITE = {
  name: "Khel Shiksha",
  tagline: "Build • Play • Learn",
  secondary: "Learning Through Play",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://khelshiksha.com",
  locale: "en_IN",
  phones: ["+91 99798 73333", "+91 91731 48292"],
  email: "adminkhelshiksha@gmail.com",
  /* EVERY URL HERE IS ONE THE COMPANY CONFIRMED. The Instagram handle used to
     be `khelshiksha`, which was a guess and was wrong - the real one is
     `khelshikshagames`. Facebook and X were guesses too and have been removed
     rather than corrected, because nobody has confirmed those accounts exist.
     A social icon that 404s costs more trust than an absent one, and these
     are rendered in the footer of every page and emitted as schema.org
     `sameAs`, where a wrong URL tells Google the wrong entity is us.
     Do not add a network here until someone has opened the link. */
  social: {
    instagram: "https://www.instagram.com/khelshikshagames",
    linkedin: "https://in.linkedin.com/company/khelshiksha",
    youtube: "https://www.youtube.com/channel/UCwJYHjd7qiL0_z1VeA5pJew",
  },
} as const;

export const ROUTES = {
  home: "/",
  schools: "/schools",
  /* Retired as a hub, kept as a constant: it is the SOURCE of the permanent
     redirect in next.config.ts, and the assistant still recognises the path
     in older conversation links.

     NOTHING ELSE MAY REFERENCE THIS. It is not in the navigation, not in the
     sitemap and not on the 404 page - all three pointed here for a while
     after the hub was deleted, which made the nav advertise a 301 and the
     sitemap publish one. If you are adding a use of ROUTES.teachers, you
     almost certainly want ROUTES.schools. */
  teachers: "/teachers",
  parents: "/parents",
  government: "/government",
  corporate: "/corporate",
  approach: "/approach",
  whyExperiential: "/approach/why-experiential",
  pillars: "/approach/pillars",
  gameCorner: "/approach/game-corner",
  products: "/products",
  impact: "/impact",
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/* --- The 5 Pillars ------------------------------------------------------ */

export const PILLAR_KEYS = [
  "foundational-learning",
  "health-nutrition",
  "climate-education",
  "future-readiness",
  "life-skills",
] as const;

export type PillarKey = (typeof PILLAR_KEYS)[number];

/** Tints are backgrounds only; ink on each clears 14.6:1. */
export type PillarTint = "sky" | "blush" | "mint" | "peach" | "lavender";

export const PILLAR_TINT_CLASS: Record<PillarTint, string> = {
  sky: "bg-tint-sky",
  blush: "bg-tint-blush",
  mint: "bg-tint-mint",
  peach: "bg-tint-peach",
  lavender: "bg-tint-lavender",
};

export const PILLAR_ACCENT_CLASS: Record<PillarTint, string> = {
  sky: "text-pillar-sky",
  blush: "text-pillar-blush",
  mint: "text-pillar-mint",
  peach: "text-pillar-peach",
  lavender: "text-pillar-lavender",
};

export const PILLAR_BORDER_CLASS: Record<PillarTint, string> = {
  sky: "border-pillar-sky",
  blush: "border-pillar-blush",
  mint: "border-pillar-mint",
  peach: "border-pillar-peach",
  lavender: "border-pillar-lavender",
};

/* --- Audiences ---------------------------------------------------------- */

/**
 * FOUR HUBS, AND "teachers" IS NO LONGER ONE OF THEM.
 *
 * Schools and Teachers were separate hubs reading the same programme from two
 * sides - the principal's and the classroom's - and the split cost more than
 * it bought. A principal evaluating the kits still wanted to know what lands
 * on their staff's desks, and a head of department arriving on /teachers had
 * to cross to /schools to find out what a rollout involves. The teacher
 * material is now the "Teacher Capacity Building" section of /schools, which
 * is where both readers were already ending up.
 *
 * /teachers still resolves - it is a permanent redirect to /schools, wired in
 * next.config.ts, because the URL has been live and indexed.
 *
 * "corporate" replaces it. CSR is a different reader with a different
 * decision (a grant, not a purchase) and different proof (alignment with
 * national missions, inclusive design, reporting), which is exactly the test
 * for whether something deserves its own hub.
 */
export const AUDIENCE_KEYS = [
  "schools",
  "parents",
  "government",
  "corporate",
] as const;
export type AudienceKey = (typeof AUDIENCE_KEYS)[number];

/* --- Product facets ----------------------------------------------------- */
/* NOTE: 8 facets, not 9. `budget` is deliberately absent - decision D7 makes
   products a portfolio with no public pricing. */

export const SUBJECTS = [
  "maths",
  "language",
  "science",
  "evs",
  "health",
  "values",
  "life-skills",
] as const;
export type Subject = (typeof SUBJECTS)[number];

export const SUBJECT_LABEL: Record<Subject, string> = {
  maths: "Maths",
  language: "Language",
  science: "Science",
  evs: "EVS",
  health: "Health",
  values: "Values",
  "life-skills": "Life Skills",
};

export const SKILLS = [
  "problem-solving",
  "teamwork",
  "communication",
  "creativity",
  "motor-skills",
  "focus",
  "memory",
  "empathy",
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABEL: Record<Skill, string> = {
  "problem-solving": "Problem solving",
  teamwork: "Teamwork",
  communication: "Communication",
  creativity: "Creativity",
  "motor-skills": "Motor skills",
  focus: "Focus",
  memory: "Memory",
  empathy: "Empathy",
};

export const SETTINGS = ["indoor", "outdoor", "either"] as const;
export type Setting = (typeof SETTINGS)[number];

export const SETTING_LABEL: Record<Setting, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
  either: "Indoor or outdoor",
};

export const GRADE_BANDS = [
  "pre-primary",
  "1-2",
  "3-5",
  "6-8",
  "9-10",
] as const;
export type GradeBand = (typeof GRADE_BANDS)[number];

export const GRADE_LABEL: Record<GradeBand, string> = {
  "pre-primary": "Pre-primary",
  "1-2": "Grades 1–2",
  "3-5": "Grades 3–5",
  "6-8": "Grades 6–8",
  "9-10": "Grades 9–10",
};

export const AGE_BANDS = [
  { key: "3-5", label: "3–5", min: 3, max: 5 },
  { key: "6-8", label: "6–8", min: 6, max: 8 },
  { key: "9-11", label: "9–11", min: 9, max: 11 },
  { key: "12-14", label: "12–14", min: 12, max: 14 },
  { key: "14+", label: "14+", min: 14, max: 18 },
] as const;

export const DURATION_BANDS = [
  { key: "under-15", label: "Under 15 min", max: 15 },
  { key: "15-30", label: "15–30 min", min: 15, max: 30 },
  { key: "30-45", label: "30–45 min", min: 30, max: 45 },
  { key: "45-plus", label: "45 min +", min: 45 },
] as const;

export const GROUP_SIZES = [
  { key: "solo", label: "Solo", min: 1, max: 1 },
  { key: "pair", label: "Pair", min: 2, max: 2 },
  { key: "small", label: "Small group (3–6)", min: 3, max: 6 },
  { key: "class", label: "Whole class", min: 7, max: 60 },
] as const;

/** The physical Game Corner shelf compartments, per the brochure. */
export const SHELF_KEYS = [
  "wellbeing-values",
  "nutrition-health",
  "nature-discovery",
  "math-thinking",
  "teamwork-citizenship",
  "environment-sustainability",
] as const;
export type ShelfKey = (typeof SHELF_KEYS)[number];

export const SHELF_LABEL: Record<ShelfKey, string> = {
  "wellbeing-values": "Wellbeing & Values",
  "nutrition-health": "Nutrition & Health",
  "nature-discovery": "Nature & Discovery",
  "math-thinking": "Math & Thinking",
  "teamwork-citizenship": "Teamwork & Citizenship",
  "environment-sustainability": "Environment & Sustainability",
};

/** National frameworks the programme aligns to. */
export const FRAMEWORKS = [
  "NEP 2020",
  "NCF 2023",
  "FLN",
  "Fit India Movement",
  "Mission LiFE",
  "Eat Right India",
] as const;
export type Framework = (typeof FRAMEWORKS)[number];
