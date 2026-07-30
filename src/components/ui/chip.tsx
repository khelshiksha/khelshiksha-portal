import { cn } from "@/lib/utils";
import { PILLAR_ACCENT_CLASS, type PillarTint } from "@/lib/constants";

type ChipVariant = "meta" | "pillar" | "solid";

/**
 * Small label. Pillar chips carry a text label as well as a tint, because
 * colour is never the only signal — a11y checklist §1.
 */
export function Chip({
  children,
  variant = "meta",
  tint,
  className,
}: {
  children: React.ReactNode;
  variant?: ChipVariant;
  tint?: PillarTint;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "text-[0.75rem] leading-tight font-semibold",
        variant === "meta" && "bg-sunken text-ink-muted",
        variant === "solid" && "bg-brand text-on-brand",
        variant === "pillar" &&
          cn(
            "bg-surface ring-1 ring-current/25",
            tint ? PILLAR_ACCENT_CLASS[tint] : "text-brand",
          ),
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A key/value spec pair, used in the product spec table. */
export function SpecItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.6875rem] font-bold tracking-[0.08em] text-ink-subtle uppercase">
        {label}
      </dt>
      <dd className="text-[0.9375rem] font-semibold text-ink">{value}</dd>
    </div>
  );
}
