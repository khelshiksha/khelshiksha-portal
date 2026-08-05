import { DEFAULT_LOCALE, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { gu } from "./dictionaries/gu";

/**
 * Dictionary access. The fallback to English is gone: `gu` is a real
 * dictionary now, and the Dictionary type forces it to stay complete - add a
 * key to en.ts and the build fails until Gujarati has it too (decision D8).
 */
const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  gu,
};

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? en;
}

export type { Dictionary };
export * from "./config";
export * from "./routing";
