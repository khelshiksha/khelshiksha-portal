"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import { Logo } from "./logo";
import { audienceNav, whatWeDoMenu } from "@/lib/navigation";
import { useDictionary, useLocaleHref } from "@/lib/i18n/locale-context";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useDictionary();
  const href = useLocaleHref();
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

  /* Any navigation closes both menus - otherwise the panel survives the route
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
          ? /* Opaque on phones, frosted only from lg up.
               The blur used to apply at every width, and it was the ONLY
               thing that changed when the page scrolled - which matches the
               reported bug exactly: the menu opened at the top of the page
               and stopped opening once scrolled. iOS Safari has long-standing
               compositing bugs where a backdrop-filter layer swallows touches
               aimed at its own descendants, and the menu button is a
               descendant of this header.
               --glass is 0.92 alpha, so an opaque background is visually
               near-identical, and dropping a full-width blur is a real
               rendering saving on a mid-range phone. */
            "bg-paper shadow-[var(--shadow-sm)] lg:bg-[var(--glass)] lg:backdrop-blur-xl lg:backdrop-saturate-150"
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
          {audienceNav(t).map((link) => (
            <Link
              key={link.href}
              href={href(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                /* whitespace-nowrap is load bearing. Without it a flex item
                   that does not fit wraps its own text instead of staying on
                   one line, and because they all shrink together ONE long
                   label puts EVERY item onto two lines - "For Parents"
                   included. Keeping the labels short is the real fix (see
                   nav.forSchools in i18n/dictionaries/en.ts); this makes the
                   failure honest if one ever grows again, because the bar
                   will visibly crowd rather than quietly double in height. */
                "relative rounded-[var(--radius-sm)] px-3 py-2 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
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

          {/* ABOUT US SITS HERE, WHERE IMPACT USED TO.

              The two swapped rather than one being added, because the bar
              has no spare slot - see the width budget on nav.forSchools in
              i18n/dictionaries/en.ts. Impact keeps its place in the What We
              Do menu under Company, one click away.

              The swap is also the right way round on merit: "who are these
              people" is asked before "what have they delivered", and About
              Us is the section the company brief leads with. */}
          <Link
            href={href(ROUTES.about)}
            aria-current={isActive(ROUTES.about) ? "page" : undefined}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-2 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors",
              isActive(ROUTES.about)
                ? "text-brand-deep"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {t.nav.about}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          {/* Visible at EVERY width now, phones included.
              It used to be `hidden sm:inline-flex`, which was survivable only
              while the hero carried its own pair of buttons. With those gone,
              hiding this one would have left a phone visitor - most of the
              traffic - with no way to act that was not behind the hamburger.
              A primary action must never require a menu.
              Compact label below sm so the header still fits at 320px: the
              full "Book a Demo" plus the logo and the menu button overflows a
              narrow phone, and a wrapped header is worse than a short word. */}
          <ButtonLink href={href("/contact?type=school-demo")} size="sm">
            <span className="sm:hidden">{t.cta.demo}</span>
            <span className="hidden sm:inline">{t.cta.bookDemo}</span>
          </ButtonLink>
          {/* A <details> rather than a button + React state.
              With JavaScript disabled an onClick handler does nothing, which
              left mobile visitors - the majority of our teacher and parent
              traffic - unable to navigate from the header at all. <details>
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

      {/* Mega-menu - opens on click, never on hover alone. */}
      {menuOpen ? (
        <div
          ref={menuRef}
          id="what-we-do-menu"
          className="border-rule bg-surface absolute inset-x-0 top-full hidden border-y shadow-[var(--shadow-lg)] lg:block"
        >
          {/* Four columns since Company joined The Approach, Five Pillars and
              Learning Kits. Fixed rather than auto-fit: these are a known,
              small set, and a column count that changes with content makes
              the menu's width jump between pages. */}
          <Container className="grid grid-cols-4 gap-10 py-10">
            {whatWeDoMenu(t).map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <p className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
                  {group.heading}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={href(link.href)}
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
  const t = useDictionary();
  const href = useLocaleHref();

  return (
    <div
      id="mobile-nav"
      /* z-40, below the header's z-50. Both used to be z-50, and the panel
         comes later in the DOM, so it painted OVER the header - meaning any
         mispositioning (iOS resizes the viewport as its toolbars collapse)
         would put a full-screen opaque panel on top of the button that closes
         it. The header must always win. */
      className="border-rule bg-paper fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto border-t lg:hidden"
    >
      <Container className="flex flex-col gap-8 py-8">
        {/* THE TWO MENUS MUST OFFER THE SAME THINGS.
            The desktop bar is audiences + What We Do + About Us; this panel
            was audiences + What We Do and nothing else, so Impact - the page
            that holds the logos, the newspaper coverage and the numbers,
            i.e. the answer to "are these people real?" - was reachable on a
            laptop and not on a phone. Two navigations claiming to be the same
            navigation is the kind of gap nobody notices until a principal
            cannot find the proof.

            BOTH are appended here, not just the one the bar shows. A phone
            panel has vertical room the bar does not, so there is no reason to
            inherit the bar's budget - Impact stays reachable in one tap
            rather than being demoted into the menu below it. */}
        <nav aria-label={t.nav.mobileMenu} className="flex flex-col gap-1">
          {[
            ...audienceNav(t),
            { href: ROUTES.about, label: t.nav.about },
            { href: ROUTES.impact, label: t.nav.impact },
          ].map((link) => (
            <Link
              key={link.href}
              href={href(link.href)}
              onClick={onNavigate}
              className="text-h3 text-ink hover:bg-sunken rounded-[var(--radius-md)] px-3 py-3 font-bold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {whatWeDoMenu(t).map((group) => (
          <div key={group.heading} className="flex flex-col gap-2">
            <p className="text-ink-subtle px-3 text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
              {group.heading}
            </p>
            <ul className="flex flex-col">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={href(link.href)}
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
            href={href("/contact?type=school-demo")}
            size="lg"
            className="flex-1"
          >
            {t.cta.bookDemo}
          </ButtonLink>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </Container>
    </div>
  );
}
