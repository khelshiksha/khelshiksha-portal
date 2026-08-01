import { SiteHeader } from "@/components/blocks/navigation/site-header";
import { SiteFooter } from "@/components/blocks/navigation/site-footer";
import { assertLocale } from "@/lib/i18n";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = assertLocale(locale);

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
