import { cn } from "@/lib/utils";

type ContainerSize = "default" | "narrow" | "wide" | "bleed";

const SIZE: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-[1280px]",
  wide: "max-w-[1440px]",
  bleed: "max-w-none",
};

/**
 * The single owner of max-width and page gutters. If a section sets its own
 * horizontal padding, that is a bug - it will drift out of alignment with
 * every other section the first time the gutter changes.
 */
export function Container({
  size = "default",
  className,
  children,
  as: Tag = "div",
}: {
  size?: ContainerSize;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
        SIZE[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

const PANEL_TONE = {
  /* Fixed across themes on purpose - see the contrast-band note in theme.css.
     These two carry verified ratios (paper on dark 16.69:1, white on brand
     6.91:1); letting them invert in dark mode is what dropped the Game Corner
     accent to 1.41:1 the last time. */
  dark: "bg-band-dark text-on-band-dark",
  brand: "on-brand bg-band-brand text-on-band-brand",
  /* Themed. Reads as a raised card on paper, a lifted surface in dark. */
  surface: "border border-rule bg-surface text-ink",
} as const;

/**
 * A section rendered as a rounded panel inset from the page gutters, rather
 * than a full-bleed colour band running edge to edge.
 *
 * The bands used to bleed. Inset panels group a section's content into an
 * object with a visible boundary, which makes a long page read as a stack of
 * discrete things instead of alternating stripes of colour - and it lets the
 * page background stay continuous behind them.
 *
 * The radius is --radius-2xl (40px) and does not scale down on mobile: a
 * large radius on a narrow viewport is the whole character of the treatment,
 * and shrinking it would leave a box with slightly soft corners.
 */
export function Panel({
  tone = "surface",
  className,
  innerClassName,
  children,
  id,
  labelledBy,
  as: Tag = "section",
}: {
  tone?: keyof typeof PANEL_TONE;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  id?: string;
  labelledBy?: string;
  as?: "section" | "div";
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-6 sm:py-8", className)}
    >
      <Container>
        <div
          className={cn(
            "rounded-[var(--radius-2xl)] px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20",
            PANEL_TONE[tone],
            innerClassName,
          )}
        >
          {children}
        </div>
      </Container>
    </Tag>
  );
}

/**
 * Vertical section rhythm. Generous by default - whitespace is the primary
 * layout tool, and crowding is the fastest way to look like a template.
 */
export function Section({
  className,
  children,
  id,
  tint,
  as: Tag = "section",
  labelledBy,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tint?: string;
  as?: "section" | "div";
  labelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-16 sm:py-24 lg:py-32", tint, className)}
    >
      {children}
    </Tag>
  );
}
