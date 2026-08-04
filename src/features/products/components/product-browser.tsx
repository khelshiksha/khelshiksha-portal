"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/blocks/product/product-card";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/locale-context";
import {
  AGE_BANDS,
  DURATION_BANDS,
  GROUP_SIZES,
  SETTINGS,
  SETTING_LABEL,
  SKILLS,
  SKILL_LABEL,
  SUBJECTS,
  SUBJECT_LABEL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  countActive,
  EMPTY_FILTERS,
  filtersToParams,
  matchesFilters,
  type ProductFilters,
} from "../lib/filters";
import type { Pillar, Product } from "@/services/cms/types";

/**
 * The whole catalogue is ~10 kits, so it ships to the client once and filters
 * in the browser — no round trip per filter change. Above roughly 60 items
 * this would flip to a server-filtered strategy.
 */
export function ProductBrowser({
  products,
  pillars,
  initialFilters,
}: {
  products: Product[];
  pillars: Pillar[];
  initialFilters: ProductFilters;
}) {
  const t = useDictionary();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(
    () => products.filter((p) => matchesFilters(p, filters)),
    [products, filters],
  );

  const active = countActive(filters);

  /**
   * Mirror the filter state into the address bar.
   *
   * The page already reads these params on the server, so deep links worked
   * inbound — but nothing ever wrote them, which made a filtered view
   * impossible to share or bookmark. filtersToParams() existed and was unit
   * tested; it was simply never called from the app.
   *
   * replaceState rather than pushState: with seven facets, pushing an entry
   * per toggle buries "the page I came from" under a dozen history steps, and
   * Back stops meaning what people expect it to mean. The URL stays accurate
   * and shareable; Back still leaves the page.
   *
   * Native history rather than router.replace() because the filtering is
   * entirely client-side over a catalogue already in memory — a router call
   * would fetch an RSC payload to render a list we can already render.
   */
  const applyFilters = (next: ProductFilters) => {
    setFilters(next);

    const params = filtersToParams(next);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  };

  const toggle = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K][number],
  ) => {
    const list = filters[key] as string[];
    const nextList = list.includes(value as string)
      ? list.filter((v) => v !== value)
      : [...list, value as string];
    applyFilters({ ...filters, [key]: nextList } as ProductFilters);
  };

  const groups = [
    {
      key: "age" as const,
      label: t.filters.age,
      options: AGE_BANDS.map((b) => ({ value: b.key, label: b.label })),
    },
    {
      key: "subjects" as const,
      label: t.filters.subject,
      options: SUBJECTS.map((s) => ({ value: s, label: SUBJECT_LABEL[s] })),
    },
    {
      key: "skills" as const,
      label: t.filters.skill,
      options: SKILLS.map((s) => ({ value: s, label: SKILL_LABEL[s] })),
    },
    {
      key: "pillars" as const,
      label: t.filters.pillar,
      options: pillars.map((p) => ({ value: p.key, label: p.title })),
    },
    {
      key: "duration" as const,
      label: t.filters.duration,
      options: DURATION_BANDS.map((b) => ({ value: b.key, label: b.label })),
    },
    {
      key: "setting" as const,
      label: t.filters.setting,
      options: SETTINGS.map((s) => ({ value: s, label: SETTING_LABEL[s] })),
    },
    {
      key: "groupSize" as const,
      label: t.filters.groupSize,
      options: GROUP_SIZES.map((b) => ({ value: b.key, label: b.label })),
    },
  ];

  const filterPanel = (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <fieldset key={group.key} className="flex flex-col gap-3 border-0 p-0">
          <legend className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.1em] uppercase">
            {group.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = (filters[group.key] as string[]).includes(
                option.value,
              );
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    toggle(
                      group.key,
                      option.value as ProductFilters[typeof group.key][number],
                    )
                  }
                  className={cn(
                    "min-h-11 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                    /* Selected state changes BORDER as well as fill, so it
                       survives greyscale and High Contrast Mode. */
                    selected
                      ? "border-brand-deep bg-brand text-on-brand border-2"
                      : "border-rule bg-surface text-ink-muted hover:border-rule-strong hover:text-ink border-2",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-28 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-ink text-[0.9375rem] font-bold">
              {t.filters.heading}
            </h2>
            {active > 0 ? (
              <button
                type="button"
                onClick={() => applyFilters(EMPTY_FILTERS)}
                className="text-brand-deep text-[0.8125rem] font-semibold underline underline-offset-2"
              >
                {t.filters.clearAll}
              </button>
            ) : null}
          </div>
          {filterPanel}
        </div>
      </aside>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          {/* Result count is announced, so a screen-reader user knows the
              grid changed under them. */}
          <p
            aria-live="polite"
            className="text-body-sm text-ink-muted font-semibold"
          >
            {t.filters.resultCount(results.length)}
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setSheetOpen(true)}
            aria-expanded={sheetOpen}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            {t.filters.heading}
            {active > 0 ? ` (${active})` : ""}
          </Button>
        </div>

        {results.length === 0 ? (
          <div className="border-rule bg-sunken rounded-[var(--radius-xl)] border p-10 text-center">
            <h3 className="text-h3 text-ink font-bold">
              {t.filters.emptyTitle}
            </h3>
            <p className="text-body text-ink-muted mx-auto mt-2 max-w-[42ch]">
              {t.filters.emptyBody}
            </p>
            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => applyFilters(EMPTY_FILTERS)}
            >
              {t.filters.clearAll}
            </Button>
            {/* Never a bare zero — always show a route forward. */}
            <ul className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              {products.slice(0, 3).map((product) => (
                <li key={product._id} className="h-full">
                  <ProductCard
                    product={product}
                    pillars={pillars}
                    sizes="(min-width: 640px) 30vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <li
                key={product._id}
                /* A CSS fade rather than a FLIP layout animation. Framer
                   Motion cost ~50KB gzipped for card reshuffling across a
                   catalogue of six kits — not a trade worth making. Revisit
                   if the catalogue grows enough that reshuffling becomes
                   disorienting. */
                className="h-full motion-safe:animate-[fade-in_240ms_var(--ease-out-quint)]"
              >
                <ProductCard
                  product={product}
                  pillars={pillars}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {sheetOpen ? (
        <div className="bg-paper fixed inset-0 z-50 flex flex-col lg:hidden">
          <div className="border-rule flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-h3 text-ink font-bold">{t.filters.heading}</h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label={t.nav.closeMenu}
              className="text-ink inline-flex size-11 items-center justify-center rounded-[var(--radius-md)]"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
          <div className="border-rule flex gap-3 border-t px-5 py-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => applyFilters(EMPTY_FILTERS)}
            >
              {t.filters.clearAll}
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              {t.filters.apply}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
