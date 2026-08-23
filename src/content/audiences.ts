import type { AudienceHub } from "@/services/cms/types";

/**
 * The four audience hubs. Each drives exactly ONE primary action - the
 * difference between a site that converts and a site with eleven buttons.
 * Spec: docs/architecture/01-information-architecture.md#conversion-architecture
 *
 * TEACHERS IS NOT A HUB ANY MORE. Its material is the "Teacher Capacity
 * Building" section of the Schools hub - the reasoning is on AUDIENCE_KEYS in
 * lib/constants.ts, and /teachers permanently redirects. Corporate & CSR took
 * the slot it left.
 */
export const audiences: AudienceHub[] = [
  {
    key: "schools",
    slug: "/schools",
    eyebrow: "For Schools & Teachers",
    title: "The Experiential",
    titleAccent: "Learning Zone.",
    lede: "Shifting from rote memorization to Learning by Doing. Kits, a Game Corner and a day of teacher training: installed and running inside one term, without adding to your staff's planning load.",
    image: {
      src: "/images/sections/schools-cart.webp",
      /* Describes what the headline does not: the setting, the age group and
         the product. See the alt note in ui/section-figure.tsx. */
      alt: "Schoolchildren in uniform gathered around a Khel Shiksha cart in a school courtyard, choosing learning kits from its shelves while two of them play a board game on the fold-out table.",
    },
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
        "Concepts are handled, not just heard, and retention follows.",
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
    features: [
      {
        eyebrow: "Transform your campus",
        title: "A gamified ecosystem inside your",
        titleAccent: "library.",
        body: "Create a dedicated learning zone in your library or activity room. The kit includes 60+ innovative, age-appropriate educational tools, sized for classroom activities, a weekly period or a student club.",
        points: [
          {
            title: "60+ educational tools",
            description:
              "Across the five pillars and the whole pre-primary to Grade 8 range, so one zone serves the entire school rather than a single year group.",
          },
          {
            title: "A room, not a cupboard",
            description:
              "The Game Corner shelf unit gives the kits a permanent, visible home. Materials that live in a store room are materials nobody uses.",
          },
          {
            title: "Built for the timetable you have",
            description:
              "Most kits run 20 to 30 minutes, which is inside an existing period. Nothing here asks you to find new hours in the week.",
          },
          {
            title: "Clubs and weekly periods",
            description:
              "The same zone runs a library period, an activity class and an after-school club, because the kits are organised by theme rather than by lesson.",
          },
        ],
      },
      {
        /* THIS IS THE MERGED /teachers HUB. Its problem/outcome framing -
           designing an activity taking longer than teaching the lesson, group
           work collapsing into three children working and three watching -
           is preserved here as the four points, because that framing is what
           made the old hub worth reading. The rest of that page (kits,
           pillars, FAQs, enquiry) already existed on this one.
           See AUDIENCE_KEYS in lib/constants.ts for why they merged. */
        eyebrow: "Teacher capacity building",
        title: "Your teachers leave having",
        titleAccent: "played every kit.",
        body: "We run comprehensive orientation programmes for educators: a full day, at your school, with your staff. Activity-based learning is mandated everywhere and supported almost nowhere, and the gap is usually training rather than willingness.",
        points: [
          {
            title: "Activities that are ready to run",
            description:
              "Designing a good activity takes longer than teaching the lesson. These arrive designed, curriculum-mapped and tested in real classrooms.",
          },
          {
            title: "Three difficulty levels per kit",
            description:
              "The facilitation guide covers setup, variations and what to watch for, so one kit serves a mixed-ability class instead of the middle of it.",
          },
            {
            title: "Formats where every child has a turn",
            description:
              "Built for groups of three to six. Group work descends into three children working and three watching only when the format lets it.",
          },
          {
            title: "Feedback before the unit test",
            description:
              "Each kit states observable outcomes - specific things to watch a child do, during the session - rather than leaving you to wait for a mark.",
          },
        ],
      },
    ],
  },
  {
    key: "parents",
    slug: "/parents",
    eyebrow: "For Parents",
    title: "Meaningful screen-free",
    titleAccent: "bonding.",
    lede: "Bring home the joy of experiential learning and turn everyday playtime into an opportunity for growth. Screen-free games your child will actually ask to play again, without feeling like more school.",
    image: {
      src: "/images/sections/parents-home.webp",
      /* Names the absence, because the absence is the claim. */
      alt: "A mother, father and two children sitting on a mat on the floor of their home, playing a Khel Shiksha board game together with cards and counters spread between them. No screens anywhere in the room.",
    },
    tint: "peach",
    primaryCta: { label: "Find the right kit", href: "/products" },
    secondaryCta: { label: "Talk to us", href: "/contact?type=parent" },
    problem: {
      heading: "What parents tell us",
      items: [
        "They can do the homework but cannot explain the idea behind it.",
        "Everything engaging seems to involve a screen.",
        "Educational games arrive, get played twice and go into a cupboard.",
        "It is hard to tell what is genuinely useful and what is packaging.",
      ],
    },
    outcome: {
      heading: "What our kits do differently",
      items: [
        "Built for repeat play: the difficulty grows with the child.",
        "Entirely physical. No screen, no app, no subscription.",
        "Designed for two to six players, so it works with siblings or friends.",
        "Each kit tells you plainly what your child will be able to do afterwards.",
      ],
    },
    features: [
      {
        eyebrow: "Where to start at home",
        title: "Three kits that make a child a",
        titleAccent: "playful thinker.",
        body: "Carefully designed board and card games, built for the kitchen table rather than the classroom. Create unforgettable family moments out of the half hour after dinner.",
        points: [
          {
            title: "Aahar",
            description:
              "Builds early awareness of good food choices. A child who has built a balanced plate a dozen times stops needing to be told what one is.",
          },
          {
            title: "Yoga Safari",
            description:
              "Enhances focus and mental calmness through asanas learned as a game. Movement, breathing and stillness, without a mat or a lecture.",
          },
          {
            title: "Aryabhata",
            description:
              "Strengthens arithmetic and logical thinking. Mental maths becomes something a child races a sibling at rather than something they are tested on.",
          },
        ],
      },
    ],
  },
  {
    key: "government",
    slug: "/government",
    eyebrow: "For Government & NGOs",
    title: "Scaling education",
    titleAccent: "through play.",
    lede: "Trusted by state educational bodies, with the manufacturing and large-scale delivery capacity to drive foundational learning across the country. Our experiential learning tools are fully NCF 2023 compliant.",
    image: {
      src: "/images/sections/government-scale.webp",
      /* Says "hundreds", because the headline says "scale" and a reader who
         cannot see the picture is otherwise told nothing about the volume
         that is the entire point of the frame. */
      alt: "Hundreds of Khel Shiksha kit boxes stacked in columns across a school distribution hall, with an education officer holding a clipboard discussing the delivery with a headmaster.",
    },
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
    features: [
      {
        /* EVERY FIGURE AND NAME HERE IS FROM THE COMPANY PROFILE, and this
           list is the reason the government hub converts. Nothing gets
           rounded up or added on the strength of "we probably also". The same
           rule that governs content/impact.ts governs this block. */
        eyebrow: "Proven impact & credibility",
        title: "What we have already",
        titleAccent: "delivered.",
        points: [
          {
            title: "12,000+ kits to PM SHRI schools",
            description:
              "Manufactured, delivered and installed across Gujarat, with teacher training run alongside the rollout.",
          },
          {
            title: "Learning modules for UNICEF",
            description:
              "Specialised modules developed in partnership, to a brief set by the agency rather than adapted from our catalogue.",
          },
          {
            title: "The Veer's Yogasana Game Kit",
            description:
              "Developed concept to final product for the 1st World Yogasana Sports Championship.",
          },
        ],
      },
      {
        eyebrow: "Teacher capacity building",
        title: "Training that scales past",
        titleAccent: "our own team.",
        body: "We conduct comprehensive orientation programmes to empower educators. At district scale the constraint is never the materials - it is whether the four hundredth teacher was trained as well as the first.",
        points: [
          {
            title: "A train-the-trainer model",
            description:
              "District and cluster resource persons are trained to run the orientation themselves, so the programme does not stall at the width of our calendar.",
          },
          {
            title: "Delivered at the school",
            description:
              "One day, on site, with the staff who will run the kits. They leave having played every one of them.",
          },
          {
            title: "Materials that get used",
            description:
              "The usual failure at scale is a store room of unopened boxes. Training is what separates a delivery from a programme.",
          },
        ],
      },
    ],
  },
  {
    key: "corporate",
    slug: "/corporate",
    eyebrow: "For Corporate & CSR",
    title: "Partner for grassroots",
    titleAccent: "educational impact.",
    lede: "Invest in the future by empowering early childhood education. We partner with organisations to create inclusive, impactful learning environments, and report back on what they produced.",
    image: {
      src: "/images/sections/corporate-inclusive.webp",
      /* "Taking her turn", not "being included". The alt text carries the
         same distinction the photograph does, for the reader who only gets
         the alt text. */
      alt: "Five schoolchildren playing a board game around a low table in a bright activity room, one of them in a wheelchair taking her turn at the board, with a Khel Shiksha shelf unit of kits behind them.",
    },
    tint: "mint",
    primaryCta: {
      label: "Partner with us",
      href: "/contact?type=corporate",
    },
    secondaryCta: { label: "See our impact", href: "/impact" },
    problem: {
      heading: "What CSR education spend runs into",
      items: [
        "Materials are funded and delivered, and nobody can say whether they were used.",
        "Reporting arrives as photographs of a handover rather than as outcomes.",
        "Programmes are designed for the average child and quietly exclude the rest.",
        "The alignment to a national mission is asserted in the deck and nowhere in the product.",
      ],
    },
    outcome: {
      heading: "What a partnership with us produces",
      items: [
        "Tools built against Mission LiFE, Fit India and Eat Right India at the design stage, not the deck stage.",
        "Adaptive resources for diverse learners, including CWSN.",
        "Periodic engagement and progress reports, on a schedule agreed up front.",
        "Per-kit observable outcomes that roll up into something a board can read.",
      ],
    },
    features: [
      {
        eyebrow: "Why partner with us",
        title: "Three things a funder can",
        titleAccent: "actually check.",
        points: [
          {
            title: "Strategic alignment",
            description:
              "Our tools support national missions including Mission LiFE, the Fit India Movement and Eat Right India. Each kit states which one and how, on its own product page.",
          },
          {
            title: "Inclusive design",
            description:
              "We provide adaptive resources designed for diverse learners, including Children with Special Needs (CWSN), rather than a single version that most of a class can use.",
          },
          {
            title: "Measurable impact",
            description:
              "Complete transparency through periodic engagement and progress reports, built on the observable outcomes each kit already carries.",
          },
        ],
      },
    ],
  },
];

export function getAudience(key: string): AudienceHub | undefined {
  return audiences.find((a) => a.key === key);
}
