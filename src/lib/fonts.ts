import { Baloo_2, Fraunces, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Self-hosted via next/font - zero third-party requests, and an auto-generated
 * size-adjusted fallback so the swap costs ~0 CLS.
 * Spec: docs/architecture/03-design-system.md#typography
 */

/** Body + UI. Friendly geometric sans, generous x-height, strong at 16px on Android. */
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Display accent ONLY - the italic phrase inside a heading
 * ("Learning by Doing."). Italic is the only style we load; roman weights are
 * never requested because they are never used.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["italic"],
  weight: ["400"],
});

/**
 * THE BRAND VOICE, AND IT IS FOR ONE HEADLINE.
 *
 * The logo is custom lettering, not type - the `i` of Shiksha is a die and
 * the `A` is an open book, and no typeface has those. So this does not
 * "match" the mark and is not trying to: it is the nearest thing in the same
 * family of feeling, rounded and bouncy with heavy stroke contrast, so the
 * home page's first line sounds like the logo above it.
 *
 * WHY ONLY THE HOME H1. A display face costs legibility fastest at small
 * sizes and in long strings, and this site's headings run to two clauses on
 * a hub page and sit above audited numbers on /impact and /government. A
 * principal or a district officer reading those is evaluating a supplier,
 * and a bouncy face over every heading reads as a toy catalogue. One
 * headline, at display size, is where the voice pays for itself.
 *
 * SCRIPT COVERAGE IS NOT A PROBLEM TODAY, and it is worth being precise
 * about why. The home headline, its sub-headline and the rotating words are
 * hardcoded English in hero-home.tsx - they are not read from a dictionary,
 * so /gu renders the same Latin string /en does and Baloo covers it.
 *
 * It becomes a problem the moment that copy IS translated, because Baloo 2's
 * Latin faces carry no Gujarati glyphs and the headline would fall back to
 * Jakarta mid-line. Baloo Bhai 2 is the sibling that covers Gujarati, which
 * is the reason to pick this family over Fredoka or Quicksand now rather
 * than discovering the gap later. See the note in globals.css.
 *
 * 700 only. The headline is the single place this is used, and shipping
 * weights nothing renders is how a font budget quietly doubles.
 */
export const baloo = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-baloo",
  weight: ["700"],
});

export const fontVariables = `${jakarta.variable} ${fraunces.variable} ${baloo.variable}`;
