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
import { FeatureBlock } from "@/components/blocks/content/feature-block";
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
  parents: "parent",
  government: "government",
  corporate: "corporate",
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
  corporate: {
    title: "Let's build something your board can",
    accent: "actually read about.",
    lede: "Tell us the scale you're considering and we'll come back with a programme and a reporting plan.",
    submitLabel: "Partner with us",
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
  /* Parents is the ONLY hub this is false for. NEP/NCF framing and the
     audited stat band belong to a reader evaluating a supplier - a principal,
     a district officer, a CSR lead - and land on a parent as a wall of
     acronyms between them and a game for their eight-year-old. Corporate
     joins the institutional side for the same reason government is on it. */
  const isInstitutional = audienceKey !== "parents";

  return (
    <>
      {/* A FIGURE ON EVERY HUB, but not the same figure.

          It started as the mascot on parents alone, on the reasoning that a
          principal or a district officer is evaluating a supplier and wants
          the child-facing brand out of the way. Half of that still holds.
          What a cartoon must stay away from is the PROOF - the ministry and
          UNICEF marks in the logo rail, the audited numbers in the stat band
          - because a cartoon next to a seal dilutes the seal, and next to a
          figure makes it look illustrative. None of that is here: this is the
          top of the page, before any claim has been made.

          Schools now carries a PHOTOGRAPH instead, which does the same job
          better for that reader - it shows the cart, the shelf of kits, the
          uniforms and the courtyard, none of which the headline says. The
          remaining hubs keep the mascot until their own photography exists;
          the swap is one `image` field in content/audiences.ts, and
          ui/section-figure.tsx explains why the two cases need two layouts.

          The register still differs below the fold, where it belongs:
          /government keeps its tender language, /schools its NEP and NCF
          framing, and the enquiry forms still scale from three fields for a
          parent to eight for a government proposal. */}
      <HeroAudience
        hub={hub}
        trail={[{ name: hub.eyebrow, path: hub.slug }]}
        figure
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

      {/* Between the programme contents and the framework alignment: the
          reader has just seen what arrives, and these say what it does with
          the campus, the staff and the funder's money. Index drives the
          alternating ground - see content/feature-block.tsx. */}
      {hub.features?.map((feature, i) => (
        <FeatureBlock key={feature.eyebrow} feature={feature} index={i} />
      ))}

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
