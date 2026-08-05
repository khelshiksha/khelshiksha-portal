import type { Benefit, FaqItem } from "@/services/cms/types";

/** Vision and mission, verbatim in substance from the company profile. */
export const vision =
  "To democratise joy-based, experiential learning for every child, transforming classrooms into vibrant hubs of discovery.";

export const mission = [
  "Empowering students through activity-based learning aligned with NEP 2020.",
  "Fostering critical thinking, empathy and life-long curiosity.",
  "Bridging the gap between conceptual knowledge and real-world application.",
];

/** "Shifting from rote memorization to Learning by Doing." - the 5 benefits. */
export const benefits: Benefit[] = [
  {
    _id: "benefit-1",
    title: "Understand concepts faster",
    description:
      "A child who has built a balanced plate remembers what one is. Handling an idea shortens the distance between hearing it and holding it.",
    order: 1,
  },
  {
    _id: "benefit-2",
    title: "Build confidence through participation",
    description:
      "In a game, every child has a turn. The quiet child at the back of a lecture is a player here, and participation is what confidence is made of.",
    order: 2,
  },
  {
    _id: "benefit-3",
    title: "Improve teamwork and communication",
    description:
      "Our kits are built for groups of three to six. Children have to explain their reasoning to each other, which is a harder and more useful skill than producing an answer.",
    order: 3,
  },
  {
    _id: "benefit-4",
    title: "Strengthen problem-solving ability",
    description:
      "Every kit puts a child in front of a problem with more than one route through it. They learn to choose an approach, not to recall a procedure.",
    order: 4,
  },
  {
    _id: "benefit-5",
    title: "Connect learning with real life",
    description:
      "Road signs, food groups, local birdcalls, the weather outside. The content of our games is the world the child walks home through.",
    order: 5,
  },
];

/** National missions the programme is built against - from "Why Choose Us". */
export const alignments = [
  {
    framework: "NEP 2020",
    claim: "Activity-based, competency-first learning",
    detail:
      "Every kit is designed around a competency a child demonstrates, not a chapter they complete.",
  },
  {
    framework: "NCF 2023",
    claim: "Competency-based experiential learning",
    detail:
      "Kits map to stage-appropriate curricular goals, with the mapping stated on each product page.",
  },
  {
    framework: "Fit India Movement",
    claim: "Physical well-being and active lifestyles",
    detail:
      "Movement-based kits bring daily physical activity into the classroom, not only the playground.",
  },
  {
    framework: "Mission LiFE",
    claim: "Climate-conscious living",
    detail:
      "Environmental kits connect global concepts to choices a child can make locally, this week.",
  },
  {
    framework: "Eat Right India",
    claim: "Nutrition awareness from the early years",
    detail:
      "Food and nutrition are taught through building and choosing, not through memorising a chart.",
  },
];

export const faqs: FaqItem[] = [
  {
    _id: "faq-time",
    question: "How much of my teachers' time does this take?",
    answer:
      "Training is a single day, delivered at your school by our team. After that, kits are designed to fit inside an existing period. Most run 20 to 30 minutes, and each comes with a facilitation guide, so no lesson planning is added to a teacher's week.",
    audience: "schools",
    order: 1,
  },
  {
    _id: "faq-rollout",
    question: "What does a rollout actually involve?",
    answer:
      "A short audit visit to understand your grades and space, installation of the Game Corner shelf unit and kits, a day of teacher training, and then a review at the end of the first term. We handle delivery and installation.",
    audience: "schools",
    order: 2,
  },
  {
    _id: "faq-grades",
    question: "Which grades is this suitable for?",
    answer:
      "Our current kits span pre-primary to Grade 8, with most concentrated in Grades 1 to 5. Each kit states its age band, and the Game Corner is organised so a teacher can find something appropriate for their class in seconds.",
    audience: "schools",
    order: 3,
  },
  {
    _id: "faq-curriculum",
    question: "Does this replace curriculum time or add to it?",
    answer:
      "It uses it. Every kit maps to specific curricular goals under NCF 2023, so an Aryabhata session is a maths period taught differently, not an extra-curricular activity competing for space in the timetable.",
    audience: "schools",
    order: 4,
  },
  {
    _id: "faq-measure",
    question: "How do we know it is working?",
    answer:
      "Each kit lists observable outcomes, things a teacher can watch a child do. We review these with your staff at the end of the first term and share what we see across the school.",
    audience: "schools",
    order: 5,
  },
  {
    _id: "faq-pricing",
    question: "What does it cost?",
    answer:
      "Kits are supplied as part of a school programme rather than sold individually, so pricing depends on the number of grades, the size of your school and whether training is included. Tell us about your school and we will share options.",
    audience: "schools",
    order: 6,
  },
  {
    _id: "faq-parent-home",
    question: "Can we use these at home?",
    answer:
      "Most kits are designed for groups of three to six, so they work well with siblings or a few friends. Tell us your child's age and what they enjoy and we will point you to the ones that suit.",
    audience: "parents",
    order: 1,
  },
  {
    _id: "faq-parent-screen",
    question: "Is there any screen time involved?",
    answer:
      "None. Every kit is physical: cards, boards, tiles and movement. The only exception is Naturebola, which uses a simple sound playback card rather than a device.",
    audience: "parents",
    order: 2,
  },
  {
    _id: "faq-govt-scale",
    question: "Can you deliver at district scale?",
    answer:
      "We have delivered over 12,000 kits to PM SHRI schools across Gujarat, including manufacturing, logistics and teacher training. We are happy to walk through how that programme was run.",
    audience: "government",
    order: 1,
  },
  {
    _id: "faq-govt-align",
    question: "Which schemes does this support?",
    answer:
      "The programme is built against NEP 2020 and NCF 2023, and the five pillars map onto Fit India, Mission LiFE and Eat Right India. Each kit states its alignment explicitly rather than in general terms.",
    audience: "government",
    order: 2,
  },
];
