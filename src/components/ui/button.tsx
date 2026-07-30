import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "link" | "on-brand";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-deep shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-surface text-ink border border-rule-strong hover:border-ink hover:bg-sunken",
  ghost: "text-ink hover:bg-sunken",
  link: "text-brand-deep underline underline-offset-4 decoration-1 hover:decoration-2 px-0",
  /* For use inside the blue CTA band, where a blue button would vanish. */
  "on-brand": "bg-on-brand text-brand hover:bg-accent hover:text-on-accent",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] " +
  "font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-150 " +
  "ease-[var(--ease-out-quint)] hover:scale-[1.02] active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-45 " +
  /* 44px minimum touch target even at size sm — a11y checklist §2 */
  "min-h-11";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof CommonProps>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"a">, keyof CommonProps | "href">;

/**
 * A link that looks like a button. Kept separate from `Button` on purpose:
 * a navigation is an `<a>` and an action is a `<button>`, and collapsing the
 * two into one polymorphic component is how sites end up with `<div onClick>`.
 */
export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
