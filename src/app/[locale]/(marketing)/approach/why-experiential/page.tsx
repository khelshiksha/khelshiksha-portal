import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { BenefitList } from "@/components/blocks/content/benefit-list";
import { CTABand } from "@/components/blocks/content/cta-band";
import { getBenefits } from "@/services/cms";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Why Experiential Learning?",
  description:
    "Shifting from rote memorization to learning by doing: five things that change in a classroom when a child handles an idea instead of only hearing it.",
  path: "/approach/why-experiential",
});

export default async function WhyExperientialPage() {
  const benefits = await getBenefits();

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { name: "Learning Through Play", path: "/approach" },
            { name: "Why Experiential?", path: "/approach/why-experiential" },
          ]}
        />
      </Container>

      <Section className="pt-10 pb-0 sm:pt-12">
        <Container>
          <SectionTitle
            level={1}
            eyebrow="Why experiential?"
            title="Shifting from rote memorization to"
            accent="Learning by Doing."
            lede="A child who has built a balanced plate remembers what one is. That is the whole argument, and everything below is what follows from it."
          />
        </Container>
      </Section>

      <BenefitList benefits={benefits} />

      <CTABand
        title="See what this looks like in"
        accent="a real classroom."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "Browse the kits", href: "/products" }}
      />
    </>
  );
}
