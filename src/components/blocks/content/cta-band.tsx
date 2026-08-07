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
           sticker laid on top.

           THE HEIGHT IS THE CONSTRAINT, and getting it wrong is visible from
           across the room: the first version used the `lg` mascot, which is
           528px tall, in a band whose content makes it about 315px. The same
           overflow-hidden that crops the feet neatly then cropped the head
           off at the neck.

           So the figure is sized to the band rather than the band to the
           figure. `md` is 160x330. min-h-[22rem] is 352px, which clears 330
           with 22px to spare, and justify-center puts the copy in the middle
           of that slightly taller box instead of leaving dead space beneath
           it. The band grows by about 35px; the alternative was growing it by
           215px to fit a full-height figure, which would have made the
           closing band the tallest thing on the page.

           THE RIGHT PADDING IS THE COLLISION MARGIN. At 1024px the Container
           is px-12, so the panel is 928 wide; px-16 plus pr-48 leaves the
           centred copy ending at x=736, and the 160-wide figure at right-4
           starts at x=752 - a 16px gap. At 1280 it is 928 against 952, so 24.

           Every number here depends on Container's gutters, the panel's own
           padding, and the size map in ui/mascot.tsx. Change any of them and
           redo the sum rather than nudging until it looks right. */
        mascot &&
          "relative overflow-hidden lg:min-h-[22rem] lg:justify-center lg:pr-48 xl:pr-56",
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

      {/* From lg this is out of the flow, so the centred headline, lede and
          buttons keep their exact geometry whether or not the figure is
          there, and lg:pr-48 above is what stops the two ever meeting.

          It sits at the RIGHT at every width, because the eye leaves a
          centred block to the right - so the figure is the last thing seen on
          the last section of the page rather than something to read past on
          the way in. */}
      {mascot ? (
        <Mascot
          crop="standing"
          /* md (160x330) from lg, not lg (256x528). See the height note above
             - the big one does not fit this band and gets its head clipped. */
          size="sm"
          sizeLg="md"
          /* IN THE FLOW ON A PHONE, absolute from lg, and the switch is the
             point. Absolute positioning is right on a wide band, where there
             is empty space to the side of centred copy and nothing to push
             around. On a phone the copy is full width and the buttons are
             too, so an absolutely positioned figure would sit on top of them.
             In the flow it simply follows the buttons, right-aligned.

             -mb-14/-mb-16 is the panel's own py at each breakpoint, so the
             feet land on its bottom edge and overflow-hidden takes the corner
             off. lg:mb-0 is not decoration: a negative margin on a
             bottom-0 absolute element would push it that far past the edge. */
          className="-mb-14 self-end sm:-mb-16 lg:absolute lg:right-4 lg:bottom-0 lg:mb-0 xl:right-10"
        />
      ) : null}
    </Panel>
  );
}
