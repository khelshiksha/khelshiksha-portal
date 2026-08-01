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

/**
 * Locales that actually have content and are routable today.
 *
 * Gujarati is NOT in this list yet, and that is the point of the list.
 * Everything else is ready: the routes, the middleware, the /gu URL shape,
 * the switcher, hreflang, and a complete Gujarati UI dictionary. What is
 * missing is the 288 strings of body copy in src/content.
 *
 * Shipping /gu with Gujarati navigation wrapped around English paragraphs
 * would look broken to precisely the reader it exists for — a Gujarati-
 * speaking principal — and would do more damage to credibility than having no
 * Gujarati at all. So the machinery ships dark and this array is the switch.
 *
 * BEFORE ADDING "gu" HERE, two things must be done, in this order:
 *
 *  1. Translate the 288 prose strings in src/content, and give the CMS
 *     boundary (services/cms) a locale argument so pages read the right set.
 *
 *  2. Pass a locale into the four SERVER components that still call
 *     getDictionary() with no argument, which means they silently render
 *     English whatever the URL says:
 *
 *       app/[locale]/(marketing)/products/[slug]/page.tsx
 *       components/blocks/navigation/breadcrumbs.tsx
 *       components/blocks/heroes/hero-home.tsx
 *       components/blocks/product/featured-kits.tsx
 *
 *     Client components no longer have this problem — they read the locale
 *     from LocaleProvider via useDictionary(). Server components cannot,
 *     because React context does not cross the server boundary, so the
 *     locale has to be handed down as a prop from the page.
 *
 * This list is here rather than in a ticket because the failure mode is
 * silent: the page would render, in the wrong language, and look fine to
 * anyone who does not read Gujarati.
 */
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

/**
 * Narrow a route segment to a Locale, or fail loudly.
 *
 * Next generates route props with `params: { locale: string }` — it cannot
 * know the segment is one of two values — so every layout and page that wants
 * a typed Locale has to narrow here. Throwing rather than defaulting to
 * English is deliberate: a route reached with an unknown locale is a routing
 * bug, and silently serving English would hide it behind a page that looks
 * fine. The [locale] layout calls notFound() before this can ever throw in
 * production.
 */
export function assertLocale(value: string): Locale {
  if (!isLocale(value)) throw new Error(`Unknown locale segment: ${value}`);
  return value;
}
