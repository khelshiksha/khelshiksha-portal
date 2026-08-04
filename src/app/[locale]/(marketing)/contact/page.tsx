import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { EnquiryForm } from "@/features/leads/components/enquiry-form";
import { isLeadType, type LeadType } from "@/features/leads/schema";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Talk to the Khel Shiksha team about bringing experiential learning kits and teacher training to your school, district or home.",
  path: "/contact",
});

const COPY: Record<
  LeadType,
  {
    eyebrow: string;
    title: string;
    accent: string;
    lede: string;
    submit: string;
  }
> = {
  "school-demo": {
    eyebrow: "Book a demo",
    title: "See the kits in",
    accent: "your classroom.",
    lede: "Five fields. We'll call you within two working days to arrange a visit.",
    submit: "Book a demo",
  },
  "school-enquiry": {
    eyebrow: "For schools",
    title: "Tell us about",
    accent: "your school.",
    lede: "We'll come back with options that fit your grades and timetable.",
    submit: "Send enquiry",
  },
  teacher: {
    eyebrow: "For teachers",
    title: "Questions about",
    accent: "your classroom?",
    lede: "Tell us what you teach and we'll point you at the right kits and guides.",
    submit: "Send question",
  },
  parent: {
    eyebrow: "For parents",
    title: "Which kit suits",
    accent: "your child?",
    lede: "Tell us their age and what they enjoy, and we'll suggest two or three.",
    submit: "Ask us",
  },
  government: {
    eyebrow: "Government & NGOs",
    title: "A programme at",
    accent: "district scale.",
    lede: "Tell us the scope you're considering and we'll prepare a proposal.",
    submit: "Request a proposal",
  },
  ngo: {
    eyebrow: "Partnerships",
    title: "Let's work",
    accent: "together.",
    lede: "Tell us about your programme and the schools you work with.",
    submit: "Start a conversation",
  },
  "product-enquiry": {
    eyebrow: "Enquire",
    title: "Interested in a",
    accent: "particular kit?",
    lede: "Tell us which one and we'll share what a full set looks like for your school.",
    submit: "Send enquiry",
  },
  general: {
    eyebrow: "Get in touch",
    title: "We'd like to hear",
    accent: "from you.",
    lede: "Tell us a little about what you need and the right person will come back to you.",
    submit: "Send message",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.type) ? params.type[0] : params.type;
  const type: LeadType = isLeadType(raw) ? raw : "general";
  const copy = COPY[type];

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <SectionTitle
              level={1}
              eyebrow={copy.eyebrow}
              title={copy.title}
              accent={copy.accent}
              lede={copy.lede}
            />
            <div className="text-body-sm flex flex-col gap-1">
              <p className="text-ink font-bold">Or reach us directly</p>
              {SITE.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-ink-muted hover:text-brand-deep w-fit transition-colors"
                >
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${SITE.email}`}
                className="text-ink-muted hover:text-brand-deep w-fit transition-colors"
              >
                {SITE.email}
              </a>
            </div>
          </div>

          <EnquiryForm
            type={type}
            sourcePath="/contact"
            showSlot={type === "school-demo"}
            showOrganisation={type !== "parent"}
            submitLabel={copy.submit}
          />
        </Container>
      </Section>
    </>
  );
}
