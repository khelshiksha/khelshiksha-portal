import type { Founder } from "@/services/cms/types";

/**
 * The people behind Khel Shiksha.
 *
 * NAMES AND ROLES ONLY, supplied by the company on 2026-08-23. Bios and
 * photographs are deliberately absent rather than placeheld: a bio is a claim
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
  {
    _id: "founder-milan",
    name: "Milan Sarvaiya",
    role: "Co-founder",
    image: {
      src: "/images/founders/milan-sarvaiya.webp",
      /* A PORTRAIT'S ALT NAMES THE PERSON, and then stops. The card prints
         the name and the role in text directly beneath, so describing the
         shirt or the smile would only add noise for a screen reader that has
         already been told who this is. "Headshot of" earns its place because
         it says what KIND of image this is, which the text does not. */
      alt: "Headshot of Milan Sarvaiya",
    },
  },
  {
    _id: "founder-kishan",
    name: "Kishan Hasani",
    role: "Co-founder",
    image: {
      src: "/images/founders/kishan-hasani.webp",
      alt: "Headshot of Kishan Hasani",
    },
  },
  {
    _id: "team-ankit",
    name: "Ankit Padshala",
    role: "Marketing Head",
    image: {
      src: "/images/founders/ankit-padshala.webp",
      alt: "Headshot of Ankit Padshala",
    },
  },
];
