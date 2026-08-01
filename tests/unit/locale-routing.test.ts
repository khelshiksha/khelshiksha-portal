import { describe, expect, it } from "vitest";
import { localeHref, localeUrl, stripLocale } from "@/lib/i18n/routing";

/**
 * The URL contract for locales.
 *
 * These are unit tests rather than a browser check because the language
 * switcher shipped with a real bug the first time: on English pages the
 * middleware rewrites /schools to /en/schools, usePathname reports the
 * REWRITTEN path, and a stripLocale that only handled non-default prefixes
 * left it alone — so the switcher built "/gu/en/schools". Every case below
 * that mentions "/en/" exists because of that bug.
 */
describe("localeHref", () => {
  it("leaves the default locale unprefixed", () => {
    expect(localeHref("en", "/schools")).toBe("/schools");
    expect(localeHref("en", "/")).toBe("/");
  });

  it("prefixes a non-default locale", () => {
    expect(localeHref("gu", "/schools")).toBe("/gu/schools");
    expect(localeHref("gu", "/approach/pillars/life-skills")).toBe(
      "/gu/approach/pillars/life-skills",
    );
  });

  it("maps the root to a bare prefix, not a trailing slash", () => {
    expect(localeHref("gu", "/")).toBe("/gu");
  });

  it("preserves query strings", () => {
    expect(localeHref("gu", "/contact?type=school-demo")).toBe(
      "/gu/contact?type=school-demo",
    );
  });

  it("never touches links that are not ours", () => {
    for (const href of [
      "https://example.com/x",
      "mailto:admin@khelshiksha.com",
      "tel:+919779873333",
      "#main",
    ]) {
      expect(localeHref("gu", href)).toBe(href);
    }
  });
});

describe("stripLocale", () => {
  it("removes a non-default prefix", () => {
    expect(stripLocale("/gu/schools")).toBe("/schools");
    expect(stripLocale("/gu")).toBe("/");
  });

  /* The regression. */
  it("removes the DEFAULT locale prefix too, as middleware rewrites produce it", () => {
    expect(stripLocale("/en/schools")).toBe("/schools");
    expect(stripLocale("/en")).toBe("/");
  });

  it("leaves an unprefixed path alone", () => {
    expect(stripLocale("/schools")).toBe("/schools");
    expect(stripLocale("/")).toBe("/");
  });

  it("does not mistake a path that merely starts with the letters", () => {
    expect(stripLocale("/english-resources")).toBe("/english-resources");
    expect(stripLocale("/guidance")).toBe("/guidance");
  });
});

describe("round trip", () => {
  it("switching language twice returns the original URL", () => {
    for (const path of ["/", "/schools", "/approach/pillars/life-skills"]) {
      const toGu = localeHref("gu", stripLocale(path));
      const backToEn = localeHref("en", stripLocale(toGu));
      expect(backToEn).toBe(path);
    }
  });
});

describe("localeUrl", () => {
  it("builds absolute URLs for canonicals and hreflang", () => {
    expect(localeUrl("https://khelshiksha.com", "en", "/schools")).toBe(
      "https://khelshiksha.com/schools",
    );
    expect(localeUrl("https://khelshiksha.com", "gu", "/schools")).toBe(
      "https://khelshiksha.com/gu/schools",
    );
  });
});
