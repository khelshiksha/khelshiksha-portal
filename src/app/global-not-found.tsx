import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_TAG } from "@/lib/i18n/config";
import "./globals.css";

/**
 * The 404 for URLs that match no route at all.
 *
 * Needed because every page now lives under app/[locale], which leaves no
 * root layout above it. For a path that matches nothing, Next has no layout
 * to render and falls back to a bare built-in document — and that document
 * has no lang attribute, which axe flags as a serious failure on every 404.
 * That is a regression the [locale] restructure introduced and this file is
 * the fix; app/[locale]/not-found.tsx still handles the in-app case, where a
 * locale IS known.
 *
 * So this component owns the whole document: html, head and body. It is
 * deliberately plain — no header, no footer, no world. A 404 should load
 * instantly and offer one obvious way back, and pulling the navigation in
 * would mean pulling client JavaScript into a page whose entire job is to
 * apologise and get out of the way.
 *
 * The language is the default locale. There is no locale in the URL to read
 * — that is what makes this the GLOBAL not-found — so claiming anything else
 * in the lang attribute would be a lie to a screen reader.
 */
export const metadata: Metadata = {
  title: `Page not found | ${SITE.name}`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  const t = getDictionary(DEFAULT_LOCALE);

  return (
    <html lang={LOCALE_TAG[DEFAULT_LOCALE]} className={`${fontVariables} h-full`}>
      <body className="bg-paper text-ink flex min-h-full flex-col antialiased">
        <main
          id="main"
          className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center"
        >
          <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
            404
          </p>
          <h1 className="text-display-2 text-ink max-w-[20ch]">
            We can&rsquo;t find that page.
          </h1>
          <p className="measure text-body-lg text-ink-muted">
            The link may be out of date, or the address may have a typo in it.
          </p>
          <a
            href="/"
            className="bg-brand text-on-brand rounded-[var(--radius-md)] px-7 py-3.5 text-base font-semibold"
          >
            {t.nav.home}
          </a>
        </main>
      </body>
    </html>
  );
}
