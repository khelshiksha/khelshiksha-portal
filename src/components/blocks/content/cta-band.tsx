import { Panel } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * The closing band. Every page ends in one — no dead ends, per the IA rules.
 * Rendered as an inset rounded panel; the `on-brand` class that scopes the
 * focus-ring override travels with the `brand` tone in Panel, so the ring
 * still survives against the coloured ground.
 *
 * The ground is DEEP EVERGREEN, not the brand blue — see --band-brand in
 * theme.css for why, and re-check every ratio below if it changes again.
 */
export function CTABand({
  title,
  accent,
  lede,
  primary,
  secondary,
}: {
  title: string;
  accent?: string;
  lede?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Panel
      tone="brand"
      innerClassName="flex flex-col items-center gap-7 text-center"
    >
      <h2 className="text-h1 text-on-band-brand max-w-[20ch]">
        {title}
        {accent ? (
          <>
            {" "}
            <em className="accent-phrase text-accent">{accent}</em>
          </>
        ) : null}
      </h2>

      {lede ? (
        <p className="measure text-body-lg text-on-band-brand/85">{lede}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink
          href={primary.href}
          size="lg"
          className="bg-on-band-brand text-band-brand hover:bg-accent hover:text-on-accent"
        >
          {primary.label}
        </ButtonLink>
        {secondary ? (
          <ButtonLink
            href={secondary.href}
            size="lg"
            /* /60, not /45. The border is the only thing that says this is a
               control, so WCAG 1.4.11 wants it at 3:1 against the ground. At
               45% it was 2.98:1 on the old blue and 2.67:1 before that — under
               the floor in both. 60% white on the evergreen is 4.08:1. */
            className="border-on-band-brand/60 text-on-band-brand hover:bg-on-band-brand/10 border bg-transparent"
          >
            {secondary.label}
          </ButtonLink>
        ) : null}
      </div>
    </Panel>
  );
}
