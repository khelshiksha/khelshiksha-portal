import Link from "next/link";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The logo sets "Khel" over "Shiksha", per the brochure. Rendered as type
 * rather than an image so it stays crisp, themes correctly, and costs nothing.
 * The registered mark is decorative and hidden from assistive tech — a screen
 * reader announcing "registered trademark" mid-name is noise.
 */
export function Logo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label={`${SITE.name} — home`}
    >
      <span className="flex items-baseline gap-1">
        <span className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-brand">
          Khel
        </span>
        <span className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-ink">
          Shiksha
        </span>
        <span aria-hidden="true" className="text-[0.6rem] text-ink-subtle">
          ®
        </span>
      </span>
      {showTagline ? (
        <span className="mt-1.5 text-[0.625rem] font-semibold tracking-[0.18em] text-ink-subtle uppercase">
          {SITE.tagline}
        </span>
      ) : null}
    </Link>
  );
}
