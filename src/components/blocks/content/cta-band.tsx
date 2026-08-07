import { Panel } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
import { cn } from "@/lib/utils";

/**
 * The closing band. Every page ends in one - no dead ends, per the IA rules.
 * Rendered as an inset rounded panel; the `on-brand` class that scopes the
 * focus-ring override travels with the `brand` tone in Panel, so the ring
 * still survives against the coloured ground.
 *
 * The ground is DEEP EVERGREEN, not the brand blue - see --band-brand in
 * theme.css for why, and re-check every ratio below if it changes again.
 */
export function CTABand({
  title,
  accent,
  lede,
  primary,
  secondary,
  mascot = false,
}: {
  title: string;
  accent?: string;
  lede?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /**
   * OPT-IN, AND IT HAS TO BE. This component closes NINE pages, including
   * /impact - where the mascot would sit a screen below the audited numbers -
   * and /government, where the reader is a District Education Officer
   * evaluating a tender. A default of `true` would put a cartoon on all of
   * them at once, which is the difference between a mascot and wallpaper.
   *
   * Only the home page passes it. The whole argument is in (marketing)/page.
   */
  mascot?: boolean;
}) {
  return (
    <Panel
      tone="brand"
      innerClassName={cn(
        "flex flex-col items-center gap-7 text-center",
        /* Positioning context for the figure, and the clip that grounds it -
           the artwork has no contact shadow, so it has to stand ON something.
           Here that is the panel's own bottom edge, and the 2xl radius takes
           the corner off the feet, which reads as depth rather than as a
           sticker laid on top. */
        mascot && "relative overflow-hidden lg:pr-64 xl:pr-72",
      )}
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
               45% it was 2.98:1 on the old blue and 2.67:1 before that - under
               the floor in both. 60% white on the evergreen is 4.08:1. */
            className="border-on-band-brand/60 text-on-band-brand hover:bg-on-band-brand/10 border bg-transparent"
          >
            {secondary.label}
          </ButtonLink>
        ) : null}
      </div>

      {/* Desktop only, and out of the flow on purpose: the centred headline,
          lede and buttons are the composition, and they keep their exact
          geometry whether or not the figure is there. The lg:pr-64 above is
          what stops the two ever meeting - without it the second button would
          run under the shoes at around 1100px.

          Sits at the RIGHT edge because the eye leaves a centred block to the
          right, so the figure is the last thing seen on the last section of
          the page rather than something to read past on the way in. */}
      {mascot ? (
        <Mascot
          crop="standing"
          size="lg"
          className="absolute right-4 bottom-0 hidden lg:block xl:right-10"
        />
      ) : null}
    </Panel>
  );
}
