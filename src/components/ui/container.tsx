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
 * horizontal padding, that is a bug — it will drift out of alignment with
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

/**
 * Vertical section rhythm. Generous by default — whitespace is the primary
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
