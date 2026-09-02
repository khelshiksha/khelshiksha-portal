import type { HeroProduct } from "@/services/cms/types";

/**
 * The kits that rotate through the home hero.
 *
 * ---------------------------------------------------------------------------
 * THESE ARE NOT content/products.ts, AND THE DIFFERENCE IS DELIBERATE.
 *
 * That file is the CATALOGUE: six kits, each with a page, a slug, curriculum
 * mappings, learning outcomes and a box-contents list. This is a SHOWCASE:
 * eleven activity kits with a photograph and a sentence, whose whole job is
 * to be seen in the hero. None of them has a page yet.
 *
 * Keeping them apart is what stops the hero from being a maintenance problem.
 * A kit can appear here the day its photograph exists, without inventing a
 * slug, a grade band and eight learning outcomes to satisfy the Product type.
 * When these do get pages, the entries move across and this file shrinks to a
 * list of slugs - which is a content edit, not a refactor.
 *
 * ---------------------------------------------------------------------------
 * THE COPY IS THE COMPANY'S, TRIMMED. Their descriptions were written for a
 * product sheet and run to two sentences; the stage sets one line under a
 * photograph, at a size a visitor reads in the two seconds before it changes.
 * Nothing here adds a claim - "feed the hungry shape monsters", "before the
 * water bucket fills", "collect hearts on their heart meter" are all theirs.
 * Spelling follows the site's British house style (colour), as everywhere
 * else.
 *
 * ORDER IS NOT THE ORDER THEY WERE SUPPLIED IN. It alternates board games,
 * card activities and manipulatives so that consecutive beats look different
 * from each other - two alphabet trays back to back read as one product
 * failing to change.
 */
export const heroProducts: HeroProduct[] = [
  {
    _id: "hp-speed-cups",
    name: "Speed Cups",
    blurb: "Race to stack the coloured cups in the order shown on the card.",
    image: {
      src: "/images/hero-products/speed-cups.webp",
      alt: "Nine coloured stacking cups in a row beside a buzzer and a fan of pattern cards",
    },
  },
  {
    _id: "hp-abc-english",
    name: "ABC Explorer",
    blurb:
      "A four-in-one English alphabet activity for early letters and sounds.",
    image: {
      src: "/images/hero-products/abc-explorer-english.webp",
      alt: "Chunky letter tiles A, D, G and M paired with illustrated boards for alligator, duck, grapes and mountain",
    },
  },
  {
    _id: "hp-color-carnival",
    name: "Colour Carnival",
    blurb:
      "A Holi-themed board game: colour your friend before the water bucket fills.",
    image: {
      src: "/images/hero-products/color-carnival.webp",
      alt: "A board game with a winding track of coloured dots, an empty-to-full water meter along the top, and stacks of colour discs",
    },
  },
  {
    _id: "hp-know-your-shapes",
    name: "Know Your Shapes",
    blurb: "Feed the hungry shape monsters objects that match their shape.",
    image: {
      src: "/images/hero-products/know-your-shapes.webp",
      alt: "Four smiling shape monsters - square, triangle, circle and rectangle - with open mouths, beside tiles showing everyday objects",
    },
  },
  {
    _id: "hp-flashlight-magic",
    name: "Flashlight Magic",
    blurb: "Peek and speak: a torch-lit activity that builds new vocabulary.",
    image: {
      src: "/images/hero-products/flashlight-magic.webp",
      alt: "A peek-and-speak board showing a city street scene, with a sliding card revealing vehicles and a labelled key beside it",
    },
  },
  {
    _id: "hp-hungry-bunny",
    name: "Hungry Bunny",
    blurb:
      "Feed the rabbits the right number of carrots. First to the biggest carrot wins.",
    image: {
      src: "/images/hero-products/hungry-bunny.webp",
      alt: "Two rabbit pieces, carrot boards and a one-or-two-player number spinner",
    },
  },
  {
    _id: "hp-string-in-sequence",
    name: "String in Sequence",
    blurb: "Follow the pattern cards and lace the strings in the right order.",
    image: {
      src: "/images/hero-products/string-in-sequence.webp",
      alt: "Lacing boards with coloured strings and buttons, beside pattern cards showing fishing, buttoning and kittens",
    },
  },
  {
    _id: "hp-wheel-of-emotions",
    name: "Wheel of Emotions",
    blurb: "Recognise and name what you are feeling, then say why.",
    image: {
      src: "/images/hero-products/wheel-of-emotions.webp",
      alt: "A wheel of six faces labelled happy, sad, surprised, scared and angry, beside a smaller Answer Why wheel",
    },
  },
  {
    _id: "hp-animal-match-up",
    name: "Animal Match Up",
    blurb: "Identify the animal, then find its home and what it eats.",
    image: {
      src: "/images/hero-products/animal-match-up.webp",
      alt: "A dog flashcard paired with cards for its food and its kennel",
    },
  },
  {
    _id: "hp-sweet-secrets",
    name: "Sweet Secrets",
    blurb: "Match the hidden messages to collect hearts on your heart meter.",
    image: {
      src: "/images/hero-products/sweet-secrets.webp",
      alt: "Two heart meters and message spinners reading Play Time, Love You, Dream Big and Shine On, with sealed envelopes",
    },
  },
  {
    _id: "hp-abc-gujarati",
    name: "ABC Explorer",
    blurb:
      "A four-in-one Gujarati alphabet activity for early letters and sounds.",
    image: {
      src: "/images/hero-products/abc-explorer-gujarati.webp",
      alt: "Chunky Gujarati letter tiles paired with illustrated boards for કમળ, ગધેડો, ઘર and ચકલી",
    },
  },
];
