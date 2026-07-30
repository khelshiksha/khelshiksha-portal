import { DEFAULT_LOCALE, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";

/**
 * Dictionary access. Every locale maps here; `gu` intentionally falls back to
 * `en` until Gujarati copy exists, so adding it later is a one-line change in
 * this map rather than a hunt through components (decision D8).
 */
const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  gu: en,
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? en;
}

export type { Dictionary };
export * from "./config";
