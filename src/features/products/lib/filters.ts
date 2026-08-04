import {
  AGE_BANDS,
  DURATION_BANDS,
  GROUP_SIZES,
  type PillarKey,
  type Setting,
  type Skill,
  type Subject,
} from "@/lib/constants";
import type { Product } from "@/services/cms/types";

/**
 * Eight facets, not nine. `budget` is deliberately absent — decision D7 makes
 * products a portfolio with no public pricing, so a budget filter would be
 * filtering on data that does not exist.
 */
export interface ProductFilters {
  age: string[];
  subjects: Subject[];
  skills: Skill[];
  pillars: PillarKey[];
  duration: string[];
  setting: Setting[];
  groupSize: string[];
}

export const EMPTY_FILTERS: ProductFilters = {
  age: [],
  subjects: [],
  skills: [],
  pillars: [],
  duration: [],
  setting: [],
  groupSize: [],
};

export const FILTER_KEYS = Object.keys(
  EMPTY_FILTERS,
) as (keyof ProductFilters)[];

/** Pure predicate — no React, no URL, trivially testable. */
export function matchesFilters(
  product: Product,
  filters: ProductFilters,
): boolean {
  if (filters.age.length > 0) {
    const hit = filters.age.some((key) => {
      const band = AGE_BANDS.find((b) => b.key === key);
      if (!band) return false;
      /* Overlap, not containment: a 6–11 kit should surface under "9–11". */
      return product.ageMin <= band.max && product.ageMax >= band.min;
    });
    if (!hit) return false;
  }

  if (
    filters.subjects.length > 0 &&
    !filters.subjects.some((s) => product.subjects.includes(s))
  ) {
    return false;
  }

  if (
    filters.skills.length > 0 &&
    !filters.skills.some((s) => product.skills.includes(s))
  ) {
    return false;
  }

  if (
    filters.pillars.length > 0 &&
    !filters.pillars.some((p) => product.pillars.includes(p))
  ) {
    return false;
  }

  if (filters.duration.length > 0) {
    const hit = filters.duration.some((key) => {
      const band = DURATION_BANDS.find((b) => b.key === key);
      if (!band) return false;
      const min = "min" in band ? band.min : 0;
      const max = "max" in band ? band.max : Number.POSITIVE_INFINITY;
      return product.durationMinutes >= min && product.durationMinutes <= max;
    });
    if (!hit) return false;
  }

  if (filters.setting.length > 0) {
    /* An "either" kit satisfies both indoor and outdoor filters. */
    const hit = filters.setting.some(
      (s) => product.setting === s || product.setting === "either",
    );
    if (!hit) return false;
  }

  if (filters.groupSize.length > 0) {
    const hit = filters.groupSize.some((key) => {
      const band = GROUP_SIZES.find((b) => b.key === key);
      if (!band) return false;
      return (
        product.groupSizeMin <= band.max && product.groupSizeMax >= band.min
      );
    });
    if (!hit) return false;
  }

  return true;
}

export function countActive(filters: ProductFilters): number {
  return FILTER_KEYS.reduce((sum, key) => sum + filters[key].length, 0);
}

/** Filters ⇄ URL. Shareable, back-button-safe, server-renderable. */
export function filtersToParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const values = filters[key];
    if (values.length > 0) params.set(key, values.join(","));
  }
  return params;
}

export function paramsToFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): ProductFilters {
  const read = (key: string): string[] => {
    const raw =
      params instanceof URLSearchParams ? params.get(key) : params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value ? value.split(",").filter(Boolean) : [];
  };

  return {
    age: read("age"),
    subjects: read("subjects") as Subject[],
    skills: read("skills") as Skill[],
    pillars: read("pillars") as PillarKey[],
    duration: read("duration"),
    setting: read("setting") as Setting[],
    groupSize: read("groupSize"),
  };
}
