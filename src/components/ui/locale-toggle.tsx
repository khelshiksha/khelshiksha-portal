"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACTIVE_LOCALES, LOCALE_LABEL, LOCALE_TAG } from "@/lib/i18n/config";
import { localeHref, stripLocale } from "@/lib/i18n/routing";
import { useDictionary, useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/**
 * Language switcher.
 *
 * A LINK, not a button. Switching language changes which URL you are on, so
 * it has to behave like navigation: openable in a new tab, visible in the
 * status bar on hover, followable by a crawler, and working with JavaScript
 * off. A button calling router.push would look identical and do none of that.
 *
 * It stays on the SAME PAGE. Someone reading about the Game Corner in English
 * who switches to Gujarati wants the Game Corner in Gujarati, not the home
 * page - being dumped back to the top is the single most common way a
 * language switcher wastes the visitor's time.
 *
 * The label is always written in the language being offered - "ગુજરાતીમાં જુઓ"
 * while you are reading English - because someone who cannot read the current
 * language still has to find the way out.
 *
 * `hreflang` on the link tells crawlers what is on the other end, and `lang`
 * makes a screen reader pronounce the Gujarati label with Gujarati phonemes
 * instead of spelling it out as mangled English.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useDictionary();
  const pathname = usePathname();

  /* Nothing to switch to while only one locale is live. Rendering a control
     that navigates to the page you are already on is worse than rendering
     nothing - it looks like a broken button. */
  const other = ACTIVE_LOCALES.find((l) => l !== locale);
  if (other === undefined) return null;

  /* Whatever prefix the pathname arrives with comes off before the other
     locale's goes on - see the note on stripLocale. */
  const bare = stripLocale(pathname);

  return (
    <Link
      href={localeHref(other, bare)}
      hrefLang={LOCALE_TAG[other]}
      lang={LOCALE_TAG[other]}
      aria-label={`${t.locale.label}: ${LOCALE_LABEL[other]}`}
      className={cn(
        "text-ink-muted hover:text-ink hover:border-rule-strong border-rule rounded-[var(--radius-md)] border px-3 py-2 text-sm font-semibold transition-colors",
        className,
      )}
    >
      {LOCALE_LABEL[other]}
    </Link>
  );
}
