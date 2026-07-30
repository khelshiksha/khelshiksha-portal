/**
 * i18n scaffolding — decision D8.
 *
 * Gujarati is in scope but not launched. The structure exists from the first
 * commit because the expensive part of adding a locale later is not the
 * routing, it is hunting down hardcoded strings in 60 components.
 *
 * RULE: no user-facing string is hardcoded in a component. Everything comes
 * from the dictionary. That is what makes `gu` a data-entry task rather than
 * a rewrite.
 */

export const LOCALES = ["en", "gu"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locales that actually have content and are routable today. */
export const ACTIVE_LOCALES: readonly Locale[] = ["en"];

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  gu: "ગુજરાતી",
};

/** BCP 47 tags for the `lang` attribute and hreflang pairs. */
export const LOCALE_TAG: Record<Locale, string> = {
  en: "en-IN",
  gu: "gu-IN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
