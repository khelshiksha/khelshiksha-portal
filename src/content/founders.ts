import type { Founder } from "@/services/cms/types";

/**
 * The people who started Khel Shiksha.
 *
 * ---------------------------------------------------------------------------
 * THIS ARRAY IS EMPTY AND THAT IS NOT AN OVERSIGHT.
 *
 * A founder entry is a record about a real, named, identifiable person: their
 * name, their role in a real company, and a claim about what they did. Filling
 * this with invented people, or with a plausible-sounding biography attached
 * to a real name, would be fabrication - and unlike a placeholder in a layout,
 * it is fabrication that the rendered page presents as fact to a principal
 * deciding whether to trust the organisation.
 *
 * The same rule already governs `testimonials` in content/impact.ts and every
 * figure in `impactStats`. It is the reason the numbers on this site can be
 * checked.
 *
 * SO THE SECTION RENDERS NOTHING UNTIL THIS IS FILLED. features/about/founders
 * returns null on an empty array, exactly as PressRail and the testimonial
 * section do, and the About page is complete without it - vision, mission and
 * the audited stat band all stand on their own.
 *
 * ---------------------------------------------------------------------------
 * TO FILL IT, one entry per founder:
 *
 *   {
 *     _id: "founder-1",
 *     name: "",           // as they would write it themselves
 *     role: "",           // "Founder", "Co-founder & Director", etc.
 *     bio: "",            // 2-3 sentences. What they did BEFORE this, and
 *                         // what they are responsible for now. Specifics beat
 *                         // adjectives: "taught Grade 4 maths for eleven
 *                         // years" says more than "passionate educator".
 *     image: {            // optional - the card lays out without one
 *       src: "/images/founders/<name>.webp",
 *       alt: "",          // what a reader who cannot see it needs: who, and
 *                         // the setting if it carries meaning
 *     },
 *   }
 *
 * Photographs go through scripts/build-section-images.mjs like the section
 * figures, so they are served as sized WebP rather than straight from a phone.
 * Square (1:1) rather than the sections' 4:5 - the aspect box in the component
 * assumes it.
 */
export const founders: Founder[] = [];
