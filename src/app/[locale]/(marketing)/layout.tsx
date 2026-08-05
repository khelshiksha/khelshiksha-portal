import { SiteHeader } from "@/components/blocks/navigation/site-header";
import { SiteFooter } from "@/components/blocks/navigation/site-footer";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  /* Fall back rather than throw. This layout re-runs while Next renders a
     not-found boundary, and at that point the locale segment is not
     populated - an assertLocale() here threw, the throw escaped, and Next
     replaced the whole page with its raw error document. That is what made
     /products/<unknown-kit> render 35KB of nothing with no lang attribute.
     Genuinely invalid locales are already rejected by the [locale] layout
     above, which calls notFound(). */
  const active = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={active} />
    </>
  );
}
