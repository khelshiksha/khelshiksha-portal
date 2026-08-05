"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./index";
import { localeHref } from "./routing";

/**
 * The active locale, for CLIENT components only.
 *
 * Server components take `locale` as a prop, because React context does not
 * cross the server boundary and there is no server-side context in the App
 * Router. Client components cannot be handed a prop from a Server Component
 * they are nested three levels below, so they read it here instead.
 *
 * Set once in the root layout from the URL segment. It is never inferred from
 * a cookie or from Accept-Language - see the note in middleware.ts.
 */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** The dictionary for the active locale. */
export function useDictionary(): Dictionary {
  return getDictionary(useContext(LocaleContext));
}

/** Locale-correct href, for links built inside client components. */
export function useLocaleHref(): (href: string) => string {
  const locale = useContext(LocaleContext);
  return (href: string) => localeHref(locale, href);
}
