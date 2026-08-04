import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { footerGroups } from "@/lib/navigation";
import { getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/constants";

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const t = getDictionary(locale);

  return (
    <footer className="border-rule bg-sunken mt-auto border-t">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div className="flex flex-col gap-5">
            <Logo showTagline />
            <p className="text-body-sm text-ink-muted max-w-[34ch]">
              {SITE.secondary}. Gamified experiential learning kits and teacher
              training for Vidyalayas across India.
            </p>

            <div className="text-body-sm flex flex-col gap-2">
              {SITE.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-ink-muted hover:text-brand-deep inline-flex w-fit items-center gap-2 transition-colors"
                >
                  <Phone size={15} aria-hidden="true" />
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${SITE.email}`}
                className="text-ink-muted hover:text-brand-deep inline-flex w-fit items-center gap-2 transition-colors"
              >
                <Mail size={15} aria-hidden="true" />
                {SITE.email}
              </a>
            </div>
          </div>

          {footerGroups(t).map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="flex flex-col gap-3"
            >
              <h2 className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
                {group.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localeHref(locale, link.href)}
                      className="text-body-sm text-ink-muted hover:text-brand-deep transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-rule mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-subtle text-[0.8125rem]">
            © {year} {SITE.name}. All rights reserved.
          </p>
          {/* Three real accounts, not five plausible ones. Facebook and X were
              placeholder URLs nobody had opened; see the note in constants.ts
              for why a guessed social link is worse than a missing one. */}
          <ul className="flex flex-wrap items-center gap-5">
            {(
              [
                ["Instagram", SITE.social.instagram],
                ["LinkedIn", SITE.social.linkedin],
                ["YouTube", SITE.social.youtube],
              ] as const
            ).map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted hover:text-brand-deep text-[0.8125rem] font-semibold transition-colors"
                >
                  {label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
