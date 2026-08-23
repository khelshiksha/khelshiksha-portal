import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { HubFeature } from "@/services/cms/types";

/**
 * A claim, a paragraph supporting it, and three to five specifics.
 *
 * ONE COMPONENT FOR FOUR SECTIONS - "Transform Your Campus" and "Teacher
 * Capacity Building" on Schools, "Why Partner With Us" on Corporate, "Proven
 * Impact & Credibility" and its own capacity block on Government. They are
 * the same shape and were always going to be; four bespoke sections would
 * have drifted apart within a term. The reasoning is on HubFeature in
 * services/cms/types.ts.
 *
 * ALTERNATING GROUND, and it is not decoration. An audience hub can now carry
 * two of these back to back, and two identical bands in a row read as one
 * long section with a heading stranded in the middle of it. `index` is the
 * position within the hub's `features` array, so odd blocks sit on the
 * surface tint and the boundary between them is visible.
 *
 * THE HEADING ID IS DERIVED FROM THE EYEBROW, not from the index. `Section`
 * needs a `labelledBy` for its landmark to be announced with a name, and an
 * index-based id would renumber every anchor the moment a block is inserted
 * above it. The eyebrow is stable and unique within a hub.
 */
export function FeatureBlock({
  feature,
  index = 0,
}: {
  feature: HubFeature;
  index?: number;
}) {
  const id = `feature-${feature.eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  return (
    <Section
      tint={index % 2 === 1 ? "bg-surface" : undefined}
      labelledBy={id}
    >
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Pinned while the list scrolls past it, the same treatment
            content/benefit-list.tsx uses. Pure CSS `position: sticky` - no
            scroll library, nothing to load. `self-start` is what makes it
            stick rather than stretch to the grid row. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle
            id={id}
            eyebrow={feature.eyebrow}
            title={feature.title}
            accent={feature.titleAccent}
            lede={feature.body}
          />
        </div>

        {/* A <ul>, because these are an unordered set of specifics. The
            numbered <ol> in benefit-list.tsx is the other case: those five
            are an enumerated set from the brochure, where the numbers encode
            something true. Here they do not, so there are none. */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {feature.points.map((point, i) => (
            <Reveal as="li" key={point.title} delay={staggerDelay(i)}>
              <Card className="flex h-full flex-col gap-2 p-6">
                <h3 className="text-h3 text-ink font-bold">{point.title}</h3>
                <p className="text-body-sm text-ink-muted">
                  {point.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
