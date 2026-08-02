import Link from "next/link";
import { cn } from "@/lib/utils";
import { PILLAR_TINT_CLASS, type PillarTint } from "@/lib/constants";

const BASE =
  "rounded-[var(--radius-lg)] border border-rule bg-surface " +
  "shadow-[var(--shadow-sm)]";

export function Card({
  tint,
  className,
  children,
  as: Tag = "div",
}: {
  tint?: PillarTint;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        BASE,
        tint && `${PILLAR_TINT_CLASS[tint]} border-transparent`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A card that is entirely a link.
 *
 * The whole card is the anchor rather than a "Read more" link inside it —
 * one tap target, one accessible name, and no nested interactive elements to
 * confuse a screen reader. Hover lift is on `transform` only, so it can never
 * cause layout shift.
 *
 * The lift is `.lift-on-hover`, NOT Tailwind's `hover:-translate-y-1`. See
 * globals.css: `hover:` compiles to a bare :hover, which a touch browser
 * latches on tap — so on a phone every card visibly rose before navigating.
 */
export function LinkCard({
  href,
  tint,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  tint?: PillarTint;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        BASE,
        "group lift-on-hover block transition-[transform,box-shadow] duration-200",
        "ease-[var(--ease-out-quint)]",
        tint && `${PILLAR_TINT_CLASS[tint]} border-transparent`,
        className,
      )}
    >
      {children}
    </Link>
  );
}
