import type { Founder } from "@/services/cms/types";

/**
 * The people behind Khel Shiksha.
 *
 * NAMES, ROLES AND ONE LINE EACH, supplied by the company - names and roles
 * on 2026-08-23, the quotes on 2026-09-01.
 *
 * THE QUOTES ARE THEIRS, WORD FOR WORD. They are `quote` rather than `bio`
 * because they are first-person statements, not descriptions of a person, and
 * the card sets the two differently. Nothing here is edited beyond the
 * apostrophe in Milan’s, which is typographic rather than straight so it
 * matches every other apostrophe the site sets. Longer bios are
 * deliberately absent rather than placeheld: a bio is a claim
 * about a real, named person, and writing a plausible-sounding one is the
 * same fabrication the note above `testimonials` in content/impact.ts
 * refuses. A name and a role are facts the company stated; anything else here
 * would be invented.
 *
 * The card renders correctly without either - initials stand in for a
 * portrait, and the paragraph is omitted rather than left empty - so adding
 * them later is a content edit that touches no layout.
 *
 * ---------------------------------------------------------------------------
 * TO ADD A BIO, 2-3 sentences on what they did BEFORE this and what they are
 * responsible for now. Specifics beat adjectives: "taught Grade 4 maths for
 * eleven years" says more than "passionate educator".
 *
 * TO ADD A PHOTOGRAPH:
 *
 *   image: {
 *     src: "/images/founders/<name>.webp",
 *     alt: "",   // who it is, and the setting if it carries meaning
 *   }
 *
 * Photographs go through scripts/build-section-images.mjs like the section
 * figures, so they are served as sized WebP rather than straight from a
 * phone. SQUARE (1:1), not the sections' 4:5 - the card's box assumes it.
 *
 * ---------------------------------------------------------------------------
 * NOT EVERYONE HERE IS A FOUNDER, which is why the section is headed "the
 * people behind" rather than "who started". The type is still called Founder
 * because renaming it would touch the CMS contract for no gain, but the list
 * is the team the company wants named.
 */
export const founders: Founder[] = [
  /* MILAN SARVAIYA IS COMMENTED OUT, NOT DELETED, at the company's request on
     2026-09-03 - to be shown later. Everything he needs is here and correct:
     name, role, quote and portrait. Restoring him is uncommenting this block,
     and nothing else - the photograph is still built and still served at
     public/images/founders/milan-sarvaiya.webp, and its source is still in
     assets/source/founders.

     LEFT IN PLACE RATHER THAN REMOVED because a deleted entry is a research
     job to recover: the quote came from the company by message and the crop
     was tuned by hand. A commented block costs nothing and is a one-line
     restore.

     The grid handles two cards without changes - it is
     sm:grid-cols-2 lg:grid-cols-3, so two sit side by side rather than
     leaving a hole. */
  // {
  //   _id: "founder-milan",
  //   name: "Milan Sarvaiya",
  //   role: "Co-founder",
  //   quote: "We don’t just create games; we create reasons to learn.",
  //   image: {
  //     src: "/images/founders/milan-sarvaiya.webp",
  //     alt: "Headshot of Milan Sarvaiya",
  //   },
  // },
  {
    _id: "founder-kishan",
    name: "Kishan Hasani",
    role: "Co-founder",
    quote:
      "Passionate about turning education into an experience children love.",
    image: {
      src: "/images/founders/kishan-hasani.webp",
      alt: "Headshot of Kishan Hasani",
    },
  },
  {
    _id: "team-ankit",
    name: "Ankit Padshala",
    role: "Marketing Head",
    quote: "Building connections that help great ideas reach further.",
    image: {
      src: "/images/founders/ankit-padshala.webp",
      alt: "Headshot of Ankit Padshala",
    },
  },
];
