import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

/**
 * URL shape for locales.
 *
 * English stays UNPREFIXED - /schools, not /en/schools - and Gujarati is
 * prefixed: /gu/schools. Two reasons, and the second is the one that matters
 * commercially:
 *
 *  - every English URL already shared, printed on a brochure, or indexed by
 *    Google keeps working. Moving the default language behind a prefix would
 *    invalidate all of them for no gain.
 *  - each language gets its own real URL, so a Gujarati page can be shared,
 *    bookmarked and indexed as Gujarati. A cookie- or header-driven switch
 *    would serve two languages from one address, which Google treats as one
 *    page and a visitor cannot link to.
 *
 * Everything that builds a link goes through here. `middleware.ts` is the
 * other half: it maps the unprefixed English URLs onto the [locale] segment
 * and redirects /en/* back to the canonical unprefixed form, so there is
 * exactly one address per page per language.
 */

/** Prefix a route with the locale. The default locale is never prefixed. */
export function localeHref(locale: Locale, href: string): string {
  if (locale === DEFAULT_LOCALE) return href;
  /* External links, anchors, mailto: and tel: are not ours to prefix. */
  if (!href.startsWith("/")) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/**
 * Strip a locale prefix, giving the route as ROUTES declares it.
 *
 * Strips ANY active locale, including the default one, and deliberately does
 * not take the current locale as a hint. On English pages the middleware
 * rewrites /schools to /en/schools, and `usePathname` reports the rewritten
 * path - so a version of this that only stripped non-default prefixes left
 * "/en/schools" untouched and the language switcher built "/gu/en/schools".
 * What the caller has is a pathname of unknown shape; the honest thing is to
 * handle every shape it can arrive in.
 */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    const prefix = `/${locale}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

/** Absolute URL for a route in a locale - canonicals, hreflang, sitemap. */
export function localeUrl(base: string, locale: Locale, href: string): string {
  return new URL(localeHref(locale, href), base).toString();
}
