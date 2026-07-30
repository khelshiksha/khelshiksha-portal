import { DEFAULT_LOCALE, type Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";

/**
 * Dictionary access. Synchronous while `en` is the only active locale; when
 * `gu` lands this becomes a dynamic import keyed on locale and the call sites
 * (which already go through `getDictionary`) do not change.
 */
export function getDictionary(_locale: Locale = DEFAULT_LOCALE): Dictionary {
  return en;
}

export type { Dictionary };
export * from "./config";
