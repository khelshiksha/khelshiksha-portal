import { describe, expect, it } from "vitest";
import {
  countActive,
  EMPTY_FILTERS,
  matchesFilters,
  paramsToFilters,
  filtersToParams,
} from "@/features/products/lib/filters";
import { products } from "@/content/products";
import type { Product } from "@/services/cms/types";

const byId = (slug: string): Product => {
  const found = products.find((p) => p.slug === slug);
  if (!found) throw new Error(`fixture missing: ${slug}`);
  return found;
};

const aryabhata = byId("aryabhata"); // ages 8–12, maths, indoor, 20min, 2–6
const yogaSafari = byId("yoga-safari"); // ages 5–11, either, 25min, 3–30

describe("matchesFilters", () => {
  it("matches everything when no filters are active", () => {
    for (const product of products) {
      expect(matchesFilters(product, EMPTY_FILTERS)).toBe(true);
    }
  });

  it("matches an age band by OVERLAP, not containment", () => {
    // Aryabhata is 8–12; the "9–11" band sits inside that range.
    expect(matchesFilters(aryabhata, { ...EMPTY_FILTERS, age: ["9-11"] })).toBe(
      true,
    );
    // ...and the "6–8" band overlaps only at its top edge.
    expect(matchesFilters(aryabhata, { ...EMPTY_FILTERS, age: ["6-8"] })).toBe(
      true,
    );
    // 3–5 does not overlap 8–12 at all.
    expect(matchesFilters(aryabhata, { ...EMPTY_FILTERS, age: ["3-5"] })).toBe(
      false,
    );
  });

  it("treats an 'either' kit as satisfying both indoor and outdoor", () => {
    expect(yogaSafari.setting).toBe("either");
    expect(
      matchesFilters(yogaSafari, { ...EMPTY_FILTERS, setting: ["indoor"] }),
    ).toBe(true);
    expect(
      matchesFilters(yogaSafari, { ...EMPTY_FILTERS, setting: ["outdoor"] }),
    ).toBe(true);
  });

  it("ORs within a facet", () => {
    expect(
      matchesFilters(aryabhata, {
        ...EMPTY_FILTERS,
        subjects: ["maths", "science"],
      }),
    ).toBe(true);
  });

  it("ANDs across facets", () => {
    // Correct subject, impossible age → excluded.
    expect(
      matchesFilters(aryabhata, {
        ...EMPTY_FILTERS,
        subjects: ["maths"],
        age: ["3-5"],
      }),
    ).toBe(false);
  });

  it("matches a duration band containing the kit's duration", () => {
    expect(aryabhata.durationMinutes).toBe(20);
    expect(
      matchesFilters(aryabhata, { ...EMPTY_FILTERS, duration: ["15-30"] }),
    ).toBe(true);
    expect(
      matchesFilters(aryabhata, { ...EMPTY_FILTERS, duration: ["45-plus"] }),
    ).toBe(false);
  });

  it("matches group size by overlap", () => {
    // Aryabhata plays 2–6, so it suits a pair and a small group, not a class.
    expect(
      matchesFilters(aryabhata, { ...EMPTY_FILTERS, groupSize: ["pair"] }),
    ).toBe(true);
    expect(
      matchesFilters(aryabhata, { ...EMPTY_FILTERS, groupSize: ["class"] }),
    ).toBe(false);
  });
});

describe("countActive", () => {
  it("is zero for empty filters", () => {
    expect(countActive(EMPTY_FILTERS)).toBe(0);
  });

  it("sums selections across facets", () => {
    expect(
      countActive({
        ...EMPTY_FILTERS,
        age: ["6-8", "9-11"],
        setting: ["indoor"],
      }),
    ).toBe(3);
  });
});

describe("URL round-trip", () => {
  it("survives filters → params → filters unchanged", () => {
    const filters = {
      ...EMPTY_FILTERS,
      age: ["6-8"],
      subjects: ["maths" as const],
      setting: ["indoor" as const],
    };
    expect(paramsToFilters(filtersToParams(filters))).toEqual(filters);
  });

  it("ignores unknown or empty params rather than throwing", () => {
    expect(paramsToFilters(new URLSearchParams("age=&nonsense=1"))).toEqual(
      EMPTY_FILTERS,
    );
  });
});

describe("no budget facet exists", () => {
  it("decision D7 makes products a portfolio — there is no budget filter", () => {
    expect(Object.keys(EMPTY_FILTERS)).not.toContain("budget");
  });
});
