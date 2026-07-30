import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF6" },
    { media: "(prefers-color-scheme: dark)", color: "#12131A" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies a stored theme preference before first paint.
 *
 * This must run synchronously in <head> — deferring it produces a flash of
 * the wrong theme on every navigation, which is worse than not having a
 * toggle. It only ever sets data-theme when the user has made an explicit
 * choice; otherwise the CSS media query decides.
 */
/**
 * Runs before first paint. Two jobs:
 *  - apply a stored theme preference (deferring this flashes the wrong theme
 *    on every navigation, which is worse than having no toggle);
 *  - set data-js, which gates the scroll-reveal hidden state in CSS. Without
 *    JavaScript the flag is never set and every revealed section renders
 *    visible.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.dataset.js='1';try{var t=localStorage.getItem('ks-theme');if(t==='dark'||t==='light'){d.dataset.theme=t}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const t = getDictionary();

  return (
    <html lang={LOCALE_TAG.en} className={`${fontVariables} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-md)] bg-brand px-5 py-3 font-semibold text-on-brand focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
        >
          {t.nav.skipToContent}
        </a>
        {children}
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
