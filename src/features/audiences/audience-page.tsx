import { notFound } from "next/navigation";
import { HeroAudience } from "@/components/blocks/heroes/hero-audience";
import { ComparisonSplit } from "@/components/blocks/content/comparison-split";
import { TimelineSteps } from "@/components/blocks/content/timeline-steps";
import { AlignmentStrip } from "@/components/blocks/content/alignment-strip";
import { PillarGrid } from "@/components/blocks/content/pillar-grid";
import { FeaturedKits } from "@/components/blocks/product/featured-kits";
import { FaqAccordion } from "@/components/blocks/utility/faq-accordion";
import { InlineEnquiry } from "@/components/blocks/conversion/inline-enquiry";
import { StatBand } from "@/components/blocks/proof/stat-band";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import {
  getAlignments,
  getAudienceHub,
  getFaqs,
  getFeaturedProducts,
  getImpactStats,
  getPillars,
} from "@/services/cms";
import type { AudienceKey } from "@/lib/constants";
import type { LeadType } from "@/features/leads/schema";

/** Each hub drives exactly ONE primary action - see the conversion table in the IA. */
const LEAD_TYPE: Record<AudienceKey, LeadType> = {
  schools: "school-demo",
  teachers: "teacher",
  parents: "parent",
  government: "government",
};

const ENQUIRY_COPY: Record<
  AudienceKey,
  { title: string; accent: string; lede: string; submitLabel: string }
> = {
  schools: {
    title: "Tell us about your school and we'll",
    accent: "take it from there.",
    lede: "Five fields. We'll call you within two working days to arrange a visit.",
    submitLabel: "Book a demo",
  },
  teachers: {
    title: "Questions about running these in",
    accent: "your classroom?",
    lede: "Tell us what you teach and we'll point you at the right kits and guides.",
    submitLabel: "Send question",
  },
  parents: {
    title: "Not sure which kit suits",
    accent: "your child?",
    lede: "Tell us their age and what they enjoy, and we'll suggest two or three.",
    submitLabel: "Ask us",
  },
  government: {
    title: "Let's discuss a programme at",
    accent: "district scale.",
    lede: "Tell us the scope you're considering and we'll prepare a proposal.",
    submitLabel: "Request a proposal",
  },
};

export async function AudiencePage({
  audienceKey,
}: {
  audienceKey: AudienceKey;
}) {
  const hub = await getAudienceHub(audienceKey);
  if (!hub) notFound();

  const [pillars, faqs, featured, alignments, stats] = await Promise.all([
    getPillars(),
    getFaqs(audienceKey),
    getFeaturedProducts(4),
    getAlignments(),
    getImpactStats(),
  ]);

  const copy = ENQUIRY_COPY[audienceKey];
  const isInstitutional =
    audienceKey === "schools" || audienceKey === "government";

  return (
    <>
      {/* EVERY HUB, not just parents.

          It started on parents alone, on the reasoning that a principal or a
          district officer is evaluating a supplier and wants the child-facing
          brand out of the way. Half of that still holds and half of it does
          not. What the mascot must stay away from is the PROOF - the ministry
          and UNICEF marks in the logo rail, the audited numbers in the stat
          band - because a cartoon next to a seal dilutes the seal and next to
          a figure makes it look illustrative. None of that is here. This is
          the top of the page, before any claim has been made, and what it
          says is "this is a company that makes things for children", which is
          true on all four hubs and is the reason any of these readers came.

          The register still differs below the fold and that is handled where
          it belongs: /government keeps its tender language, /schools its NEP
          and NCF framing, and the enquiry forms still scale from three fields
          for a parent to eight for a government proposal.

          If it ever needs pulling back, this is one expression - the prop is
          still per-hub, so `audienceKey !== "government"` is the whole edit. */}
      <HeroAudience
        hub={hub}
        trail={[{ name: hub.eyebrow, path: hub.slug }]}
        mascot
      />

      <ComparisonSplit problem={hub.problem} outcome={hub.outcome} />

      {hub.timeline ? <TimelineSteps steps={hub.timeline} /> : null}

      {hub.included ? (
        <Section labelledBy="included-heading">
          <Container className="flex flex-col gap-12">
            <SectionTitle
              id="included-heading"
              eyebrow="What's included"
              title="Everything that arrives with"
              accent="the programme."
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hub.included.map((item, i) => (
                <Reveal as="li" key={item.title} delay={staggerDelay(i)}>
                  <Card className="flex h-full flex-col gap-2 p-6">
                    <h3 className="text-h3 text-ink font-bold">{item.title}</h3>
                    <p className="text-body-sm text-ink-muted">
                      {item.description}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* NEP/NCF framing belongs to institutional audiences. It never appears
          on the parent hub - that is a UX, accessibility and conversion rule
          all at once. */}
      {isInstitutional ? <AlignmentStrip alignments={alignments} /> : null}

      <PillarGrid
        pillars={pillars}
        lede="Every kit sits under one of five pillars, so a school can see the whole ecosystem rather than a product list."
      />

      <FeaturedKits products={featured} pillars={pillars} />

      {isInstitutional ? (
        <StatBand
          stats={stats}
          title="What we have"
          accent="actually delivered."
        />
      ) : null}

      <FaqAccordion
        items={faqs}
        title={
          audienceKey === "parents"
            ? "What parents usually"
            : "The things people actually"
        }
        accent="ask us first."
      />

      <InlineEnquiry
        type={LEAD_TYPE[audienceKey]}
        sourcePath={hub.slug}
        title={copy.title}
        accent={copy.accent}
        lede={copy.lede}
        submitLabel={copy.submitLabel}
        showSlot={audienceKey === "schools"}
        showOrganisation={audienceKey !== "parents"}
      />
    </>
  );
}
