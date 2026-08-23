import Image from "next/image";
import { Mascot } from "@/components/ui/mascot";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/services/cms/types";

/**
 * The figure that sits beside an audience hub's headline.
 *
 * WHY THIS EXISTS RATHER THAN A SECOND <Mascot> CALL. The four hubs used to
 * share one figure - the standing mascot - and hero-audience.tsx grounded it
 * by cancelling the section's own padding with a negative bottom margin, so
 * the feet stood on the boundary between the tint band and the paper below.
 * That treatment is correct for a cut-out and wrong for everything else.
 *
 * A photograph is a rectangle carrying its own background. It cannot stand on
 * an edge, because it has no silhouette to stand on; hung off the section
 * boundary it reads as a picture sliding out of the page. So the two cases
 * need two layouts, not one layout with a swapped `src`, and the branch lives
 * here rather than at each of the four call sites.
 *
 * THE FALLBACK IS THE POINT. Only Schools has its photograph so far. Rather
 * than leave three heroes bare or block the whole change on artwork that does
 * not exist yet, a hub with no `image` keeps the mascot it already had, with
 * the grounding treatment it was designed for. Supplying the remaining images
 * is then one line per hub in content/audiences.ts and nothing else.
 *
 * ---------------------------------------------------------------------------
 * THE ASPECT BOX IS FIXED AT 4:5, and scripts/build-section-images.mjs
 * asserts every source matches it. Portrait, because this figure shares a row
 * with a headline column at lg and a landscape frame in that slot either
 * shrinks to a stamp or pushes the headline into a column too narrow to set.
 *
 * `object-cover` inside the box means a source at a slightly different ratio
 * would crop rather than letterbox - silently, and usually through somebody's
 * face. That is what the assertion in the build script prevents, and why the
 * ratio is stated in both places with a comment pointing at the other.
 */

/* TYPED AS ImageRef, the CMS contract, rather than a local shape - the same
   choice ui/media-frame.tsx makes, and for the same reason: these images move
   into Sanity with the rest of the hub content and a parallel local type would
   have to be reconciled on the way.

   `alt` IS REQUIRED ON THAT TYPE, and here it must also be non-empty. The
   mascot branch below is decorative - it sits beside copy that already says
   what it says, and renders alt="" aria-hidden. A photograph is not: it
   carries the setting, the age group and the product, none of which appear in
   the headline, and alt text is the only way a screen reader gets any of it.

   The string is English only for now, which is a known gap on /gu - see the
   note on `alt` in ui/mascot.tsx. It localises when these reach the CMS. */

export function SectionFigure({
  image,
  className,
}: {
  image?: ImageRef;
  className?: string;
}) {
  if (!image) {
    return (
      <Mascot
        crop="standing"
        size="sm"
        sizeLg="lg"
        /* Unchanged from the treatment this replaced, negative margins and
           all. -mb-16/-mb-24 cancels the hero's pb-8 (lg:pb-12) plus the
           Container's py-8 (lg:py-12), which is exactly the distance to the
           section edge the feet stand on. If either padding changes, this
           changes with it. */
        className={cn("-mb-16 shrink-0 self-end lg:-mb-24", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        /* w-full below lg so the photograph is a full-width band on a phone
           rather than a floating thumbnail; a fixed width from lg, where it
           shares a row with the headline column.

           The width is 20rem/24rem rather than the mascot's 7rem/16rem
           because a photograph needs to resolve faces and a shelf of boxes,
           and at mascot width it is a postage stamp. */
        "relative w-full shrink-0 overflow-hidden rounded-[var(--radius-lg)]",
        "aspect-[4/5] shadow-[var(--shadow-md)]",
        "lg:w-80 xl:w-96",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        /* Matches the widths above: full viewport below lg, then the fixed
           column. Without this next/image assumes 100vw at every breakpoint
           and fetches a desktop-sized file for a 320px slot. */
        sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, 100vw"
        className="object-cover"
      />
    </div>
  );
}
