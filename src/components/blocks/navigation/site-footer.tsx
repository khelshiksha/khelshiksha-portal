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
    <footer className="mt-auto border-t border-rule bg-sunken">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div className="flex flex-col gap-5">
            <Logo showTagline />
            <p className="max-w-[34ch] text-body-sm text-ink-muted">
              {SITE.secondary}. Gamified experiential learning kits and teacher
              training for Vidyalayas across India.
            </p>

            <div className="flex flex-col gap-2 text-body-sm">
              {SITE.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex w-fit items-center gap-2 text-ink-muted transition-colors hover:text-brand-deep"
                >
                  <Phone size={15} aria-hidden="true" />
                  {phone}
                </a>
              ))}
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex w-fit items-center gap-2 text-ink-muted transition-colors hover:text-brand-deep"
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
              <h2 className="text-[0.6875rem] font-bold tracking-[0.14em] text-ink-subtle uppercase">
                {group.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localeHref(locale, link.href)}
                      className="text-body-sm text-ink-muted transition-colors hover:text-brand-deep"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-subtle">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-5">
            {(
              [
                ["Instagram", SITE.social.instagram],
                ["Facebook", SITE.social.facebook],
                ["X", SITE.social.x],
              ] as const
            ).map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.8125rem] font-semibold text-ink-muted transition-colors hover:text-brand-deep"
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
