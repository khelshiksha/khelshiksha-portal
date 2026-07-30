import type { AudienceHub } from "@/services/cms/types";

/**
 * The four audience hubs. Each drives exactly ONE primary action — the
 * difference between a site that converts and a site with eleven buttons.
 * Spec: docs/architecture/01-information-architecture.md#conversion-architecture
 */
export const audiences: AudienceHub[] = [
  {
    key: "schools",
    slug: "/schools",
    eyebrow: "For Schools",
    title: "A complete learning ecosystem for your",
    titleAccent: "Vidyalaya.",
    lede: "Kits, a Game Corner, and a day of teacher training — installed and running inside one term, without adding to your staff's planning load.",
    tint: "sky",
    primaryCta: { label: "Book a Demo", href: "/contact?type=school-demo" },
    secondaryCta: { label: "See the learning kits", href: "/products" },
    problem: {
      heading: "What most classrooms run into",
      items: [
        "Children can recite a definition but cannot use it a week later.",
        "The same four children answer every question; the rest wait.",
        "Activity-based learning is mandated, but nobody has time to design the activities.",
        "There is no way to see whether a change in method actually worked.",
      ],
    },
    outcome: {
      heading: "What changes with Khel Shiksha",
      items: [
        "Concepts are handled, not just heard — and retention follows.",
        "Every child has a turn, because the format requires it.",
        "Teachers get ready-made, curriculum-mapped activities with facilitation guides.",
        "Each kit states observable outcomes a teacher can actually watch for.",
      ],
    },
    timeline: [
      {
        _id: "s1",
        label: "Week 0",
        title: "Audit visit",
        description:
          "We visit your school, look at your grades, timetable and space, and agree which pillars to start with.",
        order: 1,
      },
      {
        _id: "s2",
        label: "Week 2",
        title: "Install",
        description:
          "The Game Corner shelf unit and kits are delivered and set up. Nothing for your staff to assemble.",
        order: 2,
      },
      {
        _id: "s3",
        label: "Week 3",
        title: "Train",
        description:
          "One day, at your school, with your teachers. They leave having played every kit they will be running.",
        order: 3,
      },
      {
        _id: "s4",
        label: "End of term",
        title: "Review",
        description:
          "We sit with your staff, look at what the outcomes are showing, and adjust which kits are in rotation.",
        order: 4,
      },
    ],
    included: [
      {
        title: "The learning kits",
        description:
          "Physical game kits across the five pillars, chosen for your grade range.",
      },
      {
        title: "The Game Corner",
        description:
          "A branded shelf unit that gives the kits a home in the classroom, organised by theme so a teacher can find one in seconds.",
      },
      {
        title: "Teacher training",
        description:
          "A full day at your school. Teachers play every kit themselves before they run it with children.",
      },
      {
        title: "Facilitation guides",
        description:
          "Every kit ships with a guide covering setup, difficulty variations and what to watch for.",
      },
    ],
  },
  {
    key: "teachers",
    slug: "/teachers",
    eyebrow: "For Teachers",
    title: "Activities you can run",
    titleAccent: "tomorrow morning.",
    lede: "Curriculum-mapped games with facilitation guides, difficulty variations, and outcomes you can actually observe. Built by people who have stood in front of a Grade 4 class.",
    tint: "mint",
    primaryCta: { label: "Browse the kits", href: "/products" },
    secondaryCta: { label: "Ask us a question", href: "/contact?type=teacher" },
    problem: {
      heading: "What makes activity-based learning hard",
      items: [
        "Designing a good activity takes longer than teaching the lesson.",
        "Most 'activities' online are craft, not learning.",
        "Group work descends into three children working and three watching.",
        "You cannot tell whether it worked until the unit test, by which point it is too late.",
      ],
    },
    outcome: {
      heading: "What we hand you",
      items: [
        "Kits that fit inside one period, with setup measured in minutes.",
        "A facilitation guide with three difficulty levels per kit.",
        "Formats built for groups of three to six, where every child has a turn.",
        "Observable outcomes — specific things to watch a child do, during the session.",
      ],
    },
  },
  {
    key: "parents",
    slug: "/parents",
    eyebrow: "For Parents",
    title: "Learning that feels like",
    titleAccent: "playing.",
    lede: "Screen-free games your child will actually ask to play again — built around the things they are learning at school, without feeling like more school.",
    tint: "peach",
    primaryCta: { label: "Find the right kit", href: "/products" },
    secondaryCta: { label: "Talk to us", href: "/contact?type=parent" },
    problem: {
      heading: "What parents tell us",
      items: [
        "They can do the homework but cannot explain the idea behind it.",
        "Everything engaging seems to involve a screen.",
        "Educational games arrive, get played twice, and go into a cupboard.",
        "It is hard to tell what is genuinely useful and what is packaging.",
      ],
    },
    outcome: {
      heading: "What our kits do differently",
      items: [
        "Built for repeat play — the difficulty grows with the child.",
        "Entirely physical. No screen, no app, no subscription.",
        "Designed for two to six players, so it works with siblings or friends.",
        "Each kit tells you plainly what your child will be able to do afterwards.",
      ],
    },
  },
  {
    key: "government",
    slug: "/government",
    eyebrow: "For Government & NGOs",
    title: "Delivered at district scale,",
    titleAccent: "already.",
    lede: "Over 12,000 kits delivered to PM SHRI schools across Gujarat, learning modules developed for UNICEF, and a programme built against NEP 2020, NCF 2023, Fit India, Mission LiFE and Eat Right India.",
    tint: "lavender",
    primaryCta: {
      label: "Request a proposal",
      href: "/contact?type=government",
    },
    secondaryCta: { label: "See our approach", href: "/approach" },
    problem: {
      heading: "What scale usually breaks",
      items: [
        "A pilot that works in ten schools cannot be manufactured for a thousand.",
        "Training the first cohort is easy; training the next four hundred is not.",
        "Materials arrive but are never used, because nobody showed teachers how.",
        "Nothing measurable comes back that can be reported to a funder or a department.",
      ],
    },
    outcome: {
      heading: "What we have already done",
      items: [
        "12,000+ kits manufactured, delivered and installed across Gujarat.",
        "A train-the-trainer model that scales beyond our own team.",
        "Specialised learning modules developed with UNICEF.",
        "Per-kit observable outcomes that roll up into school and district reporting.",
      ],
    },
  },
];

export function getAudience(key: string): AudienceHub | undefined {
  return audiences.find((a) => a.key === key);
}
