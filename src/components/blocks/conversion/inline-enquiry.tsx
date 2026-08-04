import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { EnquiryForm } from "@/features/leads/components/enquiry-form";
import { SITE } from "@/lib/constants";
import type { LeadType } from "@/features/leads/schema";

/**
 * The form lives ON the page, not behind a modal or a link to /contact.
 *
 * A principal who has just read the rollout timeline should never have to
 * navigate to convert — that navigation is worth several points of conversion
 * on its own.
 */
export function InlineEnquiry({
  type,
  sourcePath,
  productId,
  eyebrow = "Get in touch",
  title = "Tell us about your school and we'll",
  accent = "take it from there.",
  lede,
  showSlot = false,
  showOrganisation = true,
  submitLabel,
}: {
  type: LeadType;
  sourcePath: string;
  productId?: string;
  eyebrow?: string;
  title?: string;
  accent?: string;
  lede?: string;
  showSlot?: boolean;
  showOrganisation?: boolean;
  submitLabel?: string;
}) {
  return (
    <Section tint="bg-surface" id="enquire" labelledBy="enquiry-heading">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <SectionTitle
            id="enquiry-heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
            lede={lede}
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
          sourcePath={sourcePath}
          productId={productId}
          showSlot={showSlot}
          showOrganisation={showOrganisation}
          submitLabel={submitLabel}
        />
      </Container>
    </Section>
  );
}
