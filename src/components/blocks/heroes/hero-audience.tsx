import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionFigure } from "@/components/ui/section-figure";
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
  figure = false,
}: {
  hub: AudienceHub;
  trail: Crumb[];
  /**
   * Show the figure beside the headline.
   *
   * It stays a PROP rather than becoming unconditional because this template
   * is the natural place to decide that a particular audience should not get
   * one - and a prop keeps that a one-line change instead of a refactor.
   *
   * WHAT IT RENDERS DEPENDS ON THE HUB. A hub carrying an `image` gets that
   * photograph, framed; a hub without one keeps the standing mascot it has
   * always had. Both cases live in ui/section-figure.tsx, which explains why
   * a cut-out and a photograph cannot share one layout.
   *
   * Still defaults to false, so any future caller of this template opts in
   * deliberately rather than inheriting a decision made for the hubs.
   */
  figure?: boolean;
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

          {/* WHERE THE FIGURE GOES, AND WHY THE TWO CASES DIFFER.

              A hub with a photograph gets a framed 4:5 panel sitting in the
              row beside the headline. A hub without one keeps the standing
              mascot, whose feet stand on the boundary between this tint band
              and the paper below - the artwork has no contact shadow (the
              alpha beneath the feet is 0), so a cut-out floating in the
              middle of a panel reads as a sticker.

              The negative margin that does that grounding lives in
              ui/section-figure.tsx, on the mascot branch only, and it is not
              a magic number: it cancels this div's pb-8 (lg:pb-12) plus the
              Container's py-8 (lg:py-12), which is exactly the distance from
              here to the section edge. IF EITHER PADDING ON THIS FILE
              CHANGES, that margin changes with it. */}
          {figure ? <SectionFigure image={hub.image} /> : null}
        </div>
      </Container>
    </section>
  );
}
