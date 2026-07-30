import type { Pillar } from "@/services/cms/types";

/**
 * The 5 Pillars, from the company profile brochure:
 * "A Complete Learning Ecosystem for Holistic Development".
 */
export const pillars: Pillar[] = [
  {
    _id: "pillar-fln",
    key: "foundational-learning",
    slug: "foundational-learning",
    title: "Foundational Learning",
    shortDescription: "Strengthening early literacy and numeracy.",
    description:
      "The years before Grade 3 decide how a child meets everything after them. Our foundational kits build number sense and early reading through play, so that fluency arrives as confidence rather than as drill.",
    tint: "sky",
    icon: "fln",
    order: 1,
  },
  {
    _id: "pillar-health",
    key: "health-nutrition",
    slug: "health-nutrition",
    title: "Health & Nutrition",
    shortDescription: "Promoting well-being and holistic physical fitness.",
    description:
      "Children learn what a balanced plate looks like by building one, and learn what their body can do by moving it. Health becomes a daily habit rather than a chapter to be revised before an exam.",
    tint: "blush",
    icon: "health",
    order: 2,
  },
  {
    _id: "pillar-climate",
    key: "climate-education",
    slug: "climate-education",
    title: "Climate Education",
    shortDescription: "Building environmentally responsible citizens.",
    description:
      "Climate is taught as something a child can act on, not something to be frightened of. Our kits connect local weather, water and waste to choices a nine-year-old can actually make this week.",
    tint: "mint",
    icon: "climate",
    order: 3,
  },
  {
    _id: "pillar-future",
    key: "future-readiness",
    slug: "future-readiness",
    title: "Future Readiness",
    shortDescription: "Early-stage career awareness and goal setting.",
    description:
      "Long before a child picks a stream, they can discover what kinds of work exist and what they enjoy doing. These activities widen the field of what a child imagines is possible for them.",
    tint: "peach",
    icon: "future",
    order: 4,
  },
  {
    _id: "pillar-life",
    key: "life-skills",
    slug: "life-skills",
    title: "Life Skills",
    shortDescription: "Instilling road safety, ethics and civic responsibility.",
    description:
      "Crossing a road safely, waiting your turn, telling the truth when it costs something. These are learned by rehearsal, and rehearsal is what a well-designed game gives a classroom.",
    tint: "lavender",
    icon: "life",
    order: 5,
  },
];
