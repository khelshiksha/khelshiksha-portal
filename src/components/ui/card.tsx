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
        "group block transition-[transform,box-shadow] duration-200",
        "ease-[var(--ease-out-quint)] hover:-translate-y-1",
        "hover:shadow-[var(--shadow-lg)]",
        tint && `${PILLAR_TINT_CLASS[tint]} border-transparent`,
        className,
      )}
    >
      {children}
    </Link>
  );
}
