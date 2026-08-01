import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { ACTIVE_LOCALES, LOCALE_TAG, isLocale } from "@/lib/i18n/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.secondary}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Gamified experiential learning kits, teacher training and classroom ecosystems for schools across India. Aligned to NEP 2020 and NCF 2023.",
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image", site: "@khelshiksha" },
};

/**
 * A single light theme-color, not a prefers-color-scheme pair: light is the
 * default for every visitor now, so keying the browser chrome to the OS would
 * paint a dark address bar above a light page. The toggle rewrites this tag
 * when someone opts into dark.
 */
export const viewport: Viewport = {
  themeColor: "#FDFBF6",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Three jobs:
 *  - set data-js, which gates the scroll-reveal hidden state in CSS. Without
 *    JavaScript the flag is never set and every revealed section renders
 *    visible;
 *  - restore a stored theme choice (deferring this flashes the wrong theme on
 *    every navigation, which is worse than having no toggle);
 *  - repaint the theme-color meta so the browser chrome matches. The tag ships
 *    light because light is the default, so only a stored dark choice needs
 *    to touch it.
 *
 * It reads localStorage and nothing else — the OS preference is deliberately
 * ignored, matching theme.css. Wrapped in try/catch because localStorage
 * throws outright in some private-browsing modes, and a theme preference is
 * not worth breaking the page over.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.js='1';try{var t=localStorage.getItem('ks-theme');if(t==='dark'||t==='light'){d.dataset.theme=t;if(t==='dark'){var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content','#12131A')}}}}catch(e){}})()`;

/**
 * Both locales are generated at build time, so a Gujarati page is as static
 * and as fast as an English one. Nothing here reads headers() or cookies() —
 * doing so to detect the language would make every page dynamic and give up
 * the static generation that holds LCP under a second on 4G.
 */
export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  /* The segment is user-controllable, so /xx/schools would otherwise render
     the English page under a bogus lang attribute. */
  if (!isLocale(locale) || !ACTIVE_LOCALES.includes(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <html lang={LOCALE_TAG[locale]} className={`${fontVariables} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="bg-paper text-ink flex min-h-full flex-col antialiased">
        <a
          href="#main"
          className="bg-brand text-on-brand sr-only rounded-[var(--radius-md)] px-5 py-3 font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
        >
          {t.nav.skipToContent}
        </a>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
