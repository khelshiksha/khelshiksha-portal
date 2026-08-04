import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
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
}: {
  hub: AudienceHub;
  trail: Crumb[];
}) {
  return (
    <section className={PILLAR_TINT_CLASS[hub.tint]}>
      <Container className="flex flex-col gap-8 py-8 lg:py-12">
        <Breadcrumbs trail={trail} />

        <div className="flex flex-col gap-6 pb-8 lg:pb-12">
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
      </Container>
    </section>
  );
}
