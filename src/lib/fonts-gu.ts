import { Baloo_Bhai_2 } from "next/font/google";

/**
 * Gujarati face - reserved per decision D8.
 *
 * DELIBERATELY NOT IMPORTED ANYWHERE YET. next/font downloads and emits CSS for
 * every declared instance in a module that reaches the bundle, so keeping this
 * in its own file means the `gu` face costs nothing until `/gu` routes exist.
 *
 * When Gujarati content lands: import this in the `[locale]` layout and apply
 * `balooGujarati.variable` only when `locale === "gu"`.
 *
 * Chosen because its rounded terminals sit tonally with Plus Jakarta Sans -
 * a Noto fallback would read as a different brand mid-sentence.
 */
export const balooGujarati = Baloo_Bhai_2({
  subsets: ["gujarati", "latin"],
  display: "swap",
  variable: "--font-gujarati",
  weight: ["400", "500", "600", "700"],
});
