"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "./logo";
import { audienceNav, whatWeDoMenu } from "@/lib/navigation";
import { getDictionary } from "@/lib/i18n";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = getDictionary();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /* Read in a rAF rather than synchronously in the effect body: a direct
       setState here would cascade an extra render on every mount. */
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Any navigation closes both menus — otherwise the panel survives the route
     change and hangs over the new page.
     Adjusted during render rather than in an effect: this is React's
     documented pattern for resetting state when a prop changes, and it avoids
     the extra render pass an effect would cost on every navigation. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setMobileOpen(false);
  }

  /* Escape closes and returns focus to the trigger, per the ARIA disclosure
     pattern. Without the focus return, a keyboard user is dumped at the top
     of the document. */
  useEffect(() => {
    if (!menuOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, mobileOpen]);

  /* Click outside closes the mega-menu. */
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-200",
        scrolled
          ? "bg-[var(--glass)] shadow-[var(--shadow-sm)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-paper",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6 py-3">
        {/* In the header on every route and above the fold, so it is fetched
            with the document rather than discovered after hydration. */}
        <Logo priority />

        <nav
          aria-label={t.nav.primary}
          className="hidden items-center gap-1 lg:flex"
        >
          {audienceNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative rounded-[var(--radius-sm)] px-3 py-2 text-[0.9375rem] font-semibold transition-colors",
                "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left",
                "after:bg-accent after:scale-x-0 after:transition-transform after:duration-200",
                "hover:after:scale-x-100",
                isActive(link.href)
                  ? "text-brand-deep after:scale-x-100"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="what-we-do-menu"
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2",
              "text-[0.9375rem] font-semibold transition-colors",
              menuOpen ? "text-brand-deep" : "text-ink-muted hover:text-ink",
            )}
          >
            {t.nav.whatWeDo}
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={cn(
                "transition-transform duration-200",
                menuOpen && "rotate-180",
              )}
            />
          </button>

          <Link
            href={ROUTES.impact}
            aria-current={isActive(ROUTES.impact) ? "page" : undefined}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-2 text-[0.9375rem] font-semibold transition-colors",
              isActive(ROUTES.impact)
                ? "text-brand-deep"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {t.nav.impact}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <ButtonLink
            href="/contact?type=school-demo"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t.cta.bookDemo}
          </ButtonLink>
          {/* A <details> rather than a button + React state.
              With JavaScript disabled an onClick handler does nothing, which
              left mobile visitors — the majority of our teacher and parent
              traffic — unable to navigate from the header at all. <details>
              opens natively with no JS, and brings correct keyboard and
              screen-reader semantics with it. */}
          <details
            open={mobileOpen}
            onToggle={(e) => setMobileOpen(e.currentTarget.open)}
            className="lg:hidden"
          >
            <summary
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="text-ink inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-[var(--radius-md)] [&::-webkit-details-marker]:hidden"
            >
              {mobileOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </summary>
            <MobileNav onNavigate={() => setMobileOpen(false)} />
          </details>
        </div>
      </Container>

      {/* Mega-menu — opens on click, never on hover alone. */}
      {menuOpen ? (
        <div
          ref={menuRef}
          id="what-we-do-menu"
          className="border-rule bg-surface absolute inset-x-0 top-full hidden border-y shadow-[var(--shadow-lg)] lg:block"
        >
          <Container className="grid grid-cols-3 gap-10 py-10">
            {whatWeDoMenu.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <p className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
                  {group.heading}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:bg-sunken block rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors"
                      >
                        <span className="text-ink block text-[0.9375rem] font-semibold">
                          {link.label}
                        </span>
                        {link.description ? (
                          <span className="text-ink-muted block text-[0.8125rem]">
                            {link.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Container>
        </div>
      ) : null}
    </header>
  );
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const t = getDictionary();

  return (
    <div
      id="mobile-nav"
      className="border-rule bg-paper fixed inset-x-0 top-18 bottom-0 z-50 overflow-y-auto border-t lg:hidden"
    >
      <Container className="flex flex-col gap-8 py-8">
        <nav aria-label={t.nav.mobileMenu} className="flex flex-col gap-1">
          {audienceNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="text-h3 text-ink hover:bg-sunken rounded-[var(--radius-md)] px-3 py-3 font-bold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {whatWeDoMenu.map((group) => (
          <div key={group.heading} className="flex flex-col gap-2">
            <p className="text-ink-subtle px-3 text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
              {group.heading}
            </p>
            <ul className="flex flex-col">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-ink-muted hover:bg-sunken hover:text-ink block rounded-[var(--radius-sm)] px-3 py-2.5 text-[0.9375rem] font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* CTA pinned at the end of the sheet, always thumb-reachable. */}
        <div className="border-rule flex items-center gap-3 border-t pt-6">
          <ButtonLink
            href="/contact?type=school-demo"
            size="lg"
            className="flex-1"
          >
            {t.cta.bookDemo}
          </ButtonLink>
          <ThemeToggle />
        </div>
      </Container>
    </div>
  );
}
