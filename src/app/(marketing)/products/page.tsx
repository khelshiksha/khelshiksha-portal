import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { CTABand } from "@/components/blocks/content/cta-band";
import { ProductBrowser } from "@/features/products/components/product-browser";
import { paramsToFilters } from "@/features/products/lib/filters";
import { getPillars, getProducts } from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Learning Kits",
  description:
    "Gamified learning kits across foundational learning, health, climate, future readiness and life skills. Filter by age, subject, skill, duration and group size.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [products, pillars, params] = await Promise.all([
    getProducts(),
    getPillars(),
    searchParams,
  ]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs trail={[{ name: "Learning Kits", path: "/products" }]} />
      </Container>

      <Section className="pt-10 pb-0 sm:pt-12 lg:pt-14">
        <Container>
          <SectionTitle
            level={1}
            eyebrow="Learning kits"
            title="Games built around what children"
            accent="actually keep."
            lede="Every kit states the outcomes a teacher can watch for. Kits are supplied as part of a school programme rather than sold individually — tell us about your school and we'll share options."
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <ProductBrowser
            products={products}
            pillars={pillars}
            initialFilters={paramsToFilters(params)}
          />
        </Container>
      </Section>

      <CTABand
        title="Not sure which kits suit"
        accent="your classroom?"
        lede="Tell us the grades you teach and we'll suggest a starting set."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "Explore the pillars", href: "/approach/pillars" }}
      />
    </>
  );
}
