import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Self-hosted via next/font — zero third-party requests, and an auto-generated
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
 * Display accent ONLY — the italic phrase inside a heading
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

export const fontVariables = `${jakarta.variable} ${fraunces.variable}`;
