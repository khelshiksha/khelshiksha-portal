import type { Product } from "@/services/cms/types";

/**
 * The six kits described in the company profile brochure.
 *
 * INCOMPLETE BY DESIGN. The brochure's Game Corner shelf also shows Santulan,
 * Climato, Vasudhaiv Kutumbkam and one title that could not be read from the
 * print scan. Those are deliberately absent rather than invented - see
 * docs/architecture/14-implementation-roadmap.md, blocker #1. Adding them is a
 * data-entry task once the catalogue arrives.
 *
 * Age bands, durations and group sizes below are reasonable defaults derived
 * from each game's described mechanics; they need confirming with the same
 * catalogue. Everything else comes straight from the brochure.
 */
export const products: Product[] = [
  {
    _id: "product-suraksha",
    slug: "project-suraksha",
    title: "Project SURAKSHA",
    tagline:
      "Road safety learned by rehearsing it, not by being warned about it.",
    descriptionInstitutional:
      "An interactive road safety game that teaches traffic rules, safe road behaviour and responsible decision-making through real-life scenarios. Supports the life-skills and civic-responsibility strands of NCF 2023.",
    descriptionParent:
      "Your child practises crossing roads, reading signs and making safe choices as a game, with friends, before they ever have to do it alone.",
    pillars: ["life-skills"],
    ageMin: 7,
    ageMax: 12,
    grades: ["3-5", "6-8"],
    subjects: ["life-skills", "values"],
    skills: ["problem-solving", "communication", "focus"],
    durationMinutes: 30,
    setting: "indoor",
    groupSizeMin: 3,
    groupSizeMax: 6,
    shelf: "teamwork-citizenship",
    learningOutcomes: [
      "Identifies common traffic signs and states what each one requires them to do",
      "Describes a safe sequence for crossing a road, including where to stand and where to look",
      "Explains why a rule exists rather than only stating the rule",
      "Recognises unsafe behaviour in a described scenario and proposes a safer alternative",
    ],
    curriculumMapping: [
      {
        framework: "NCF 2023",
        reference: "Life skills and civic responsibility",
      },
      {
        framework: "NEP 2020",
        reference: "Experiential and competency-based learning",
      },
    ],
    howToPlay: [
      {
        step: "Lay out the board and deal the scenario cards",
        detail:
          "Each card describes a real junction, crossing or footpath situation.",
      },
      {
        step: "Players take turns drawing a scenario",
        detail: "They state aloud what they would do, and why.",
      },
      {
        step: "The group decides together whether the choice was safe",
        detail:
          "Disagreement is the point: the discussion is where the learning happens.",
      },
      {
        step: "Safe choices move a player forward; the group discusses the rest",
      },
    ],
    boxContents: [
      "Game board",
      "48 real-scenario cards",
      "6 player tokens",
      "Traffic sign reference set",
      "Teacher facilitation guide",
    ],
    heroImage: {
      src: "/images/products/project-suraksha.svg",
      alt: "The Project SURAKSHA road safety game board with scenario cards and player tokens laid out",
    },
    relatedSlugs: ["yoga-safari", "naturebola"],
    featured: true,
    order: 1,
  },
  {
    _id: "product-aryabhata",
    slug: "aryabhata",
    title: "Aryabhata",
    tagline: "Fast-paced arithmetic that rewards thinking, not memorising.",
    descriptionInstitutional:
      "A mathematics game that strengthens arithmetic fluency, logical reasoning and problem-solving under mild time pressure. Directly supports FLN numeracy goals for the middle primary years.",
    descriptionParent:
      "A quick, competitive number game that builds your child's confidence with mental maths, the kind of practice that feels like playing rather than like homework.",
    pillars: ["foundational-learning"],
    ageMin: 8,
    ageMax: 12,
    grades: ["3-5", "6-8"],
    subjects: ["maths"],
    skills: ["problem-solving", "focus", "memory"],
    durationMinutes: 20,
    setting: "indoor",
    groupSizeMin: 2,
    groupSizeMax: 6,
    shelf: "math-thinking",
    learningOutcomes: [
      "Performs addition and subtraction within 100 without counting on fingers",
      "Chooses an efficient strategy rather than defaulting to one method",
      "Explains how they reached an answer when asked",
      "Sustains attention through a timed round without losing accuracy",
    ],
    curriculumMapping: [
      { framework: "FLN", reference: "Numeracy: operations and number sense" },
      { framework: "NCF 2023", reference: "Mathematical thinking, Stage 2" },
    ],
    howToPlay: [
      { step: "Shuffle the number cards and deal five to each player" },
      {
        step: "Turn over the target card",
        detail:
          "Players race to reach the target using the cards in their hand.",
      },
      {
        step: "First to call a valid combination explains it",
        detail:
          "An unexplained answer does not score: the reasoning is the skill.",
      },
      { step: "Play continues until a player reaches the agreed score" },
    ],
    boxContents: [
      "120 number cards",
      "30 target cards",
      "Sand timer",
      "Score pad",
      "Teacher guide with difficulty variations",
    ],
    heroImage: {
      src: "/images/products/aryabhata.svg",
      alt: "Aryabhata maths game cards fanned out beside a sand timer and score pad",
    },
    relatedSlugs: ["brainy-bee", "project-suraksha"],
    featured: true,
    order: 2,
  },
  {
    _id: "product-aahar",
    slug: "aahar",
    title: "Aahar",
    tagline: "Building a balanced plate, one card at a time.",
    descriptionInstitutional:
      "A nutrition card game that helps children understand food groups and healthy choices through play. Aligns with Eat Right India and the health and well-being strand of NCF 2023.",
    descriptionParent:
      "A card game about food that gets children thinking about what makes a meal balanced, often the first time they take an interest in what's on their plate.",
    pillars: ["health-nutrition"],
    ageMin: 6,
    ageMax: 11,
    grades: ["1-2", "3-5"],
    subjects: ["health", "science"],
    skills: ["memory", "communication", "focus"],
    durationMinutes: 20,
    setting: "indoor",
    groupSizeMin: 2,
    groupSizeMax: 6,
    shelf: "nutrition-health",
    learningOutcomes: [
      "Sorts common foods into their groups without prompting",
      "Assembles a balanced plate and explains why it is balanced",
      "Names a local, affordable food that meets a given nutritional need",
      "Distinguishes an everyday food from a sometimes food, with a reason",
    ],
    curriculumMapping: [
      {
        framework: "Eat Right India",
        reference: "Food groups and balanced diet",
      },
      { framework: "NCF 2023", reference: "Health and well-being, Stage 1–2" },
    ],
    howToPlay: [
      { step: "Deal seven food cards to each player" },
      {
        step: "Players build a balanced plate",
        detail: "Each plate needs one card from each food group.",
      },
      { step: "Trade cards with the group to complete a plate" },
      {
        step: "First complete plate wins the round and explains it",
        detail: "The explanation is what turns a match into understanding.",
      },
    ],
    boxContents: [
      "90 illustrated food cards",
      "6 plate mats",
      "Food group reference chart",
      "Teacher guide",
    ],
    heroImage: {
      src: "/images/products/aahar.svg",
      alt: "Aahar nutrition cards arranged on a plate mat showing each food group",
    },
    relatedSlugs: ["yoga-safari", "naturebola"],
    featured: true,
    order: 3,
  },
  {
    _id: "product-yoga-safari",
    slug: "yoga-safari",
    title: "Yoga Safari",
    tagline: "Movement, breath and focus, disguised as an animal adventure.",
    descriptionInstitutional:
      "A playful yoga game introducing mindfulness, movement, focus and emotional regulation. Supports the Fit India Movement and the physical education strand of NCF 2023.",
    descriptionParent:
      "Your child moves through animal poses, learns to slow their breathing, and finishes calmer than they started. It works as well before homework as after school.",
    pillars: ["health-nutrition", "life-skills"],
    ageMin: 5,
    ageMax: 11,
    grades: ["pre-primary", "1-2", "3-5"],
    subjects: ["health", "life-skills"],
    skills: ["motor-skills", "focus", "empathy"],
    durationMinutes: 25,
    setting: "either",
    groupSizeMin: 3,
    groupSizeMax: 30,
    shelf: "wellbeing-values",
    learningOutcomes: [
      "Holds a balance pose for a sustained count without external support",
      "Follows a guided breathing pattern and describes how their body feels afterwards",
      "Names an emotion they are feeling and one way to settle it",
      "Leads a short sequence for the rest of the group",
    ],
    curriculumMapping: [
      { framework: "Fit India Movement", reference: "Daily physical activity" },
      { framework: "NCF 2023", reference: "Physical education and well-being" },
    ],
    howToPlay: [
      { step: "Spread the safari trail cards on the floor" },
      {
        step: "Roll and move along the trail",
        detail: "Each square is an animal pose.",
      },
      {
        step: "The whole group holds the pose together for the count on the card",
      },
      {
        step: "Breath cards interrupt the trail",
        detail:
          "Everyone stops and follows the breathing pattern before continuing.",
      },
    ],
    boxContents: [
      "24 animal pose cards",
      "12 breathing cards",
      "Floor trail mat",
      "Foam die",
      "Teacher sequence guide",
    ],
    heroImage: {
      src: "/images/products/yoga-safari.svg",
      alt: "Yoga Safari trail mat with animal pose cards and a foam die",
    },
    relatedSlugs: ["aahar", "project-suraksha"],
    featured: true,
    order: 4,
  },
  {
    _id: "product-brainy-bee",
    slug: "brainy-bee",
    title: "Brainy Bee",
    tagline: "Matching objects to letters, then letters into words.",
    descriptionInstitutional:
      "A word-building game in which children match objects with letters, form words and strengthen early vocabulary. Supports FLN literacy goals for the early primary years.",
    descriptionParent:
      "Your child matches pictures to letters and builds their first words, the step where reading stops being decoding and starts being recognition.",
    pillars: ["foundational-learning"],
    ageMin: 5,
    ageMax: 9,
    grades: ["pre-primary", "1-2", "3-5"],
    subjects: ["language"],
    skills: ["memory", "communication", "creativity"],
    durationMinutes: 25,
    setting: "indoor",
    groupSizeMin: 2,
    groupSizeMax: 6,
    shelf: "math-thinking",
    learningOutcomes: [
      "Matches an initial sound to its letter reliably across unfamiliar words",
      "Builds three- and four-letter words from loose letters",
      "Reads back a word they have built without prompting",
      "Offers a new word beginning with a given sound",
    ],
    curriculumMapping: [
      { framework: "FLN", reference: "Literacy: decoding and vocabulary" },
      { framework: "NCF 2023", reference: "Language and literacy, Stage 1" },
    ],
    howToPlay: [
      { step: "Lay out the object cards face up" },
      {
        step: "Players collect letters to spell what they see",
        detail:
          "Start with initial sounds, then whole words as confidence grows.",
      },
      { step: "Read the completed word aloud to claim the card" },
      { step: "The player with the most cards at the end wins" },
    ],
    boxContents: [
      "60 object cards",
      "120 letter tiles",
      "6 word trays",
      "Teacher guide with three difficulty levels",
    ],
    heroImage: {
      src: "/images/products/brainy-bee.svg",
      alt: "Brainy Bee letter tiles arranged in a word tray beside illustrated object cards",
    },
    relatedSlugs: ["aryabhata", "naturebola"],
    featured: true,
    order: 5,
  },
  {
    _id: "product-naturebola",
    slug: "naturebola",
    title: "Naturebola",
    tagline: "Listen, identify, match: the natural world by ear.",
    descriptionInstitutional:
      "A sound-based game in which children listen to, identify and match nature and animal sounds through group play. Supports environmental awareness under Mission LiFE and the EVS strand of NCF 2023.",
    descriptionParent:
      "Your child listens to birds, weather and animals and learns to tell them apart: a game that makes them notice the world outside the window.",
    pillars: ["climate-education", "foundational-learning"],
    ageMin: 5,
    ageMax: 10,
    grades: ["pre-primary", "1-2", "3-5"],
    subjects: ["evs", "science"],
    skills: ["focus", "memory", "teamwork"],
    durationMinutes: 20,
    setting: "either",
    groupSizeMin: 4,
    groupSizeMax: 30,
    shelf: "nature-discovery",
    learningOutcomes: [
      "Identifies common local birds and animals by their call",
      "Distinguishes a natural sound from a human-made one and explains the difference",
      "Connects a sound to the habitat it belongs to",
      "Listens attentively through a full round without interrupting",
    ],
    curriculumMapping: [
      {
        framework: "Mission LiFE",
        reference: "Environmental awareness and observation",
      },
      { framework: "NCF 2023", reference: "Environmental studies, Stage 1–2" },
    ],
    howToPlay: [
      { step: "Deal the habitat boards to each team" },
      {
        step: "Play a sound from the set",
        detail: "Teams listen without discussing.",
      },
      { step: "Each team places a marker on the creature they think made it" },
      {
        step: "Reveal and discuss",
        detail: "Wrong answers are the most useful part of the round.",
      },
    ],
    boxContents: [
      "Sound set with playback card",
      "6 habitat boards",
      "60 creature tokens",
      "Local species reference booklet",
      "Teacher guide",
    ],
    heroImage: {
      src: "/images/products/naturebola.svg",
      alt: "Naturebola habitat boards with creature tokens and the sound playback card",
    },
    relatedSlugs: ["aahar", "brainy-bee"],
    featured: false,
    order: 6,
  },
];
