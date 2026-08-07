import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
import {
  Breadcrumbs,
  type Crumb,
} from "@/components/blocks/navigation/breadcrumbs";
import { PILLAR_TINT_CLASS } from "@/lib/constants";
import type { AudienceHub } from "@/services/cms/types";

/** The shared template for all four audience hubs. Only content and CTA change. */
export function HeroAudience({
  hub,
  trail,
  mascot = false,
}: {
  hub: AudienceHub;
  trail: Crumb[];
  /**
   * All four hubs pass this. It stays a PROP rather than becoming
   * unconditional because this template is the natural place to decide that a
   * particular audience should not get it - /government is the likeliest
   * candidate, since its reader is a District Education Officer evaluating a
   * tender - and a prop keeps that a one-line change instead of a refactor.
   * The reasoning for turning it on everywhere is in
   * features/audiences/audience-page.tsx.
   *
   * Still defaults to false, so any future caller of this template opts in
   * deliberately rather than inheriting a decision made for the hubs.
   */
  mascot?: boolean;
}) {
  return (
    <section className={PILLAR_TINT_CLASS[hub.tint]}>
      <Container className="flex flex-col gap-8 py-8 lg:py-12">
        <Breadcrumbs trail={trail} />

        <div className="flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-12">
          <div className="flex flex-col gap-6">
            <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
              {hub.eyebrow}
            </p>

            <h1 className="text-display-2 text-ink max-w-[18ch]">
              {hub.title}
              {hub.titleAccent ? (
                <>
                  {" "}
                  <em className="accent-phrase">{hub.titleAccent}</em>
                </>
              ) : null}
            </h1>

            <p className="measure text-body-lg text-ink-muted">{hub.lede}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={hub.primaryCta.href} size="lg">
                {hub.primaryCta.label}
              </ButtonLink>
              {hub.secondaryCta ? (
                <ButtonLink
                  href={hub.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                >
                  {hub.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>

          {/* Feet on the bottom edge of the tint band, where it meets the paper
              of the next section. The artwork has no contact shadow - the alpha
              beneath the feet is 0 - so a figure floating in the middle of a
              panel reads as a sticker. Standing it on the one horizontal line
              the layout already has is the grounding.

              -mb-20/-mb-24 is not a magic number: it cancels this div's pb-8
              (lg:pb-12) plus the Container's py-8 (lg:py-12), which is exactly
              the distance from here to the section edge. If either of those
              paddings changes, this changes with it. */}
          {mascot ? (
            <Mascot
              crop="standing"
              size="sm"
              sizeLg="lg"
              /* self-end puts it at the right on a phone, where the column is
                 stacked, and does nothing at lg where the row already handles
                 alignment.

                 The negative margin is the distance from here to the section
                 edge, and it differs by breakpoint because both paddings do:
                 pb-8 + Container py-8 is 64px on a phone, pb-12 + py-12 is
                 96px from lg. Get it wrong and the figure floats above the
                 boundary or hangs into the next section. */
              className="-mb-16 shrink-0 self-end lg:-mb-24"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
