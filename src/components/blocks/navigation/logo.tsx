import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import wordmark from "../../../../public/brand/logo-wordmark.png";
import fullLogo from "../../../../public/brand/logo.png";

/**
 * The real mark, replacing the typographic stand-in that stood here while we
 * had no artwork.
 *
 * Two crops of one source file. The supplied logo carries "Build · Play ·
 * Learn" beneath the wordmark, which is unreadable at the ~34px the header
 * gives it, so the header uses a wordmark-only crop and the footer - where
 * there is room - uses the full lockup. Splitting the artwork is better than
 * scaling type below its legibility floor and calling it branding.
 *
 * The mark stays #5080c0 in both themes rather than being re-tinted per
 * theme: it is the brand's colour, not a UI token. It clears 3.91:1 on paper
 * and 4.58:1 on the dark ground, and WCAG 1.4.3 exempts logotypes from
 * contrast minimums in any case.
 *
 * Imported as a static asset rather than referenced by string path so Next
 * supplies intrinsic dimensions - the layout box is reserved before the image
 * arrives, which is what keeps CLS at 0.
 */
export function Logo({
  className,
  showTagline = false,
  priority = false,
}: {
  className?: string;
  showTagline?: boolean;
  priority?: boolean;
}) {
  const src = showTagline ? fullLogo : wordmark;

  return (
    <Link
      href="/"
      className={cn("group inline-flex", className)}
      aria-label={`${SITE.name}, home`}
    >
      <Image
        src={src}
        /* The link carries the accessible name; a duplicate alt would make a
           screen reader announce the brand twice. */
        alt=""
        priority={priority}
        className={cn(
          "w-auto transition-opacity group-hover:opacity-85",
          showTagline ? "h-14" : "h-9 sm:h-10",
        )}
        sizes={showTagline ? "168px" : "80px"}
      />
    </Link>
  );
}
