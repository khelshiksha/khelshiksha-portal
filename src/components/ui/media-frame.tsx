import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/services/cms/types";

type Ratio = "square" | "4/3" | "3/2" | "16/9" | "portrait";

const RATIO: Record<Ratio, string> = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  portrait: "aspect-[3/4]",
};

type Radius = "md" | "lg" | "xl" | "2xl";

/* Static map - Tailwind extracts class names at build time, so an
   interpolated `rounded-[var(--radius-${radius})]` would silently produce
   no CSS at all. */
const RADIUS: Record<Radius, string> = {
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  "2xl": "rounded-[var(--radius-2xl)]",
};

/**
 * Every image on the site goes through this component. It owns the radius,
 * object-fit, and - critically - the `sizes` attribute.
 *
 * A wrong `sizes` is the most common cause of a phone downloading a 2000px
 * image for a 375px slot. It is invisible in dev on a fast connection and
 * silently doubles mobile page weight, so it is required here rather than
 * optional.
 */
export function MediaFrame({
  image,
  ratio = "4/3",
  sizes,
  priority = false,
  zoomOnHover = false,
  radius = "lg",
  className,
}: {
  image: ImageRef;
  ratio?: Ratio;
  /** Required. e.g. "(min-width: 1024px) 33vw, 100vw" */
  sizes: string;
  /** Set on exactly one image per page - the LCP candidate. */
  priority?: boolean;
  zoomOnHover?: boolean;
  radius?: Radius;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-sunken relative overflow-hidden",
        RADIUS[radius],
        RATIO[ratio],
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.decorative ? "" : image.alt}
        aria-hidden={image.decorative || undefined}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover",
          /* .zoom-on-hover, not group-hover:scale-105 - the Tailwind variant
             is a bare :hover and a touch browser latches it on tap. See
             globals.css. */
          zoomOnHover &&
            "zoom-on-hover transition-transform duration-[400ms] ease-[var(--ease-out-quint)]",
        )}
      />
    </div>
  );
}
