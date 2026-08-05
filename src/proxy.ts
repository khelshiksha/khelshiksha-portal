import { NextResponse, type NextRequest } from "next/server";
import { ACTIVE_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

/**
 * Maps clean URLs onto the [locale] route segment.
 *
 * Named proxy.ts, not middleware.ts: Next 16.2 deprecated the middleware file
 * convention and warns about it on every dev boot. Same behaviour, same
 * matcher, only the file name and the exported function name change.
 *
 * Every page lives under app/[locale], so the router needs a locale in the
 * path. But English must stay unprefixed (see the note in lib/i18n/routing),
 * which leaves three cases:
 *
 *   /gu/schools  → pass through, the segment is already there
 *   /en/schools  → REDIRECT to /schools, permanently
 *   /schools     → rewrite to /en/schools, invisibly
 *
 * The redirect matters. Without it the same English page would answer on two
 * addresses, and Google would have to guess which is canonical, the classic
 * way a site quietly competes with itself in search results.
 *
 * Deliberately NOT doing locale negotiation from Accept-Language. Guessing a
 * visitor's language from their browser and redirecting them is a well-known
 * way to strand someone on a page they cannot read with no obvious way back,
 * and it makes every URL return different content to different people, which
 * breaks caching and confuses crawlers. The language switcher is explicit and
 * the choice is in the URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const prefixed = ACTIVE_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (prefixed !== undefined && prefixed !== DEFAULT_LOCALE) {
    return NextResponse.next();
  }

  if (prefixed === DEFAULT_LOCALE) {
    const stripped = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /* Everything except Next internals, the API, and anything with a file
     extension. Rewriting a request for an image or a font would break it. */
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
