import { SiteHeader } from "@/components/blocks/navigation/site-header";
import { SiteFooter } from "@/components/blocks/navigation/site-footer";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { Container, Section } from "@/components/ui/container";

export default async function LegalLayout({
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
        <Section>
          <Container size="narrow">
            {/* `measure` caps line length at 68ch - legal text is the content
                most likely to be read start to finish. */}
            <div className="measure [&_h2]:text-h3 [&_li]:text-ink-muted [&_p]:text-ink-muted flex flex-col gap-5 [&_h2]:mt-8 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
              {children}
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter locale={active} />
    </>
  );
}
