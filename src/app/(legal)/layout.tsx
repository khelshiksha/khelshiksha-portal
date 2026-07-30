import { SiteHeader } from "@/components/blocks/navigation/site-header";
import { SiteFooter } from "@/components/blocks/navigation/site-footer";
import { Container, Section } from "@/components/ui/container";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Section>
          <Container size="narrow">
            {/* `measure` caps line length at 68ch — legal text is the content
                most likely to be read start to finish. */}
            <div className="measure flex flex-col gap-5 [&_h2]:mt-8 [&_h2]:text-h3 [&_li]:text-ink-muted [&_p]:text-ink-muted [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
              {children}
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
