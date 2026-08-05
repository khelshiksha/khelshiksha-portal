import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { settlePage } from "./support/settle";

/**
 * WCAG 2.1 AA sweep across every route type.
 *
 * Automated testing catches roughly 30% of real WCAG issues, so this is the
 * floor, not the ceiling - the manual passes in
 * docs/architecture/13-accessibility-checklist.md still have to happen. But
 * zero automated violations is a hard gate, because unlike Lighthouse
 * Performance it is deterministic: there is no reason to score less.
 */
const ROUTES = [
  { path: "/", name: "home" },
  { path: "/schools", name: "audience hub" },
  { path: "/parents", name: "audience hub (parent voice)" },
  { path: "/products", name: "products index (filter UI)" },
  { path: "/products/aryabhata", name: "product detail" },
  { path: "/approach", name: "approach" },
  { path: "/approach/pillars/climate-education", name: "pillar" },
  { path: "/impact", name: "impact" },
  { path: "/contact", name: "contact (form)" },
  { path: "/privacy", name: "legal" },
  { path: "/not-a-real-page", name: "404" },
];

for (const route of ROUTES) {
  test(`${route.name} (${route.path}) has no WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await settlePage(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    /* Print the actual offending markup - a bare count is useless when a
       test fails weeks from now. */
    if (results.violations.length > 0) {
      console.error(
        `\n${route.path}:\n` +
          results.violations
            .map(
              (v) =>
                `  [${v.impact}] ${v.id}: ${v.help}\n` +
                v.nodes.map((n) => `      ${n.html}`).join("\n"),
            )
            .join("\n"),
      );
    }

    expect(results.violations).toEqual([]);
  });
}

test("dark theme has no contrast violations", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
  });
  await settlePage(page);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2aa", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("mega-menu is accessible when open", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop-only component");

  await page.goto("/");
  await settlePage(page);
  await page.getByRole("button", { name: /what we do/i }).click();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("mobile nav sheet is accessible when open", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "mobile-only component");

  await page.goto("/");
  await settlePage(page);
  /* The hamburger is a <summary> inside <details> so it works without JS. */
  await page.locator("summary").first().click();
  await expect(
    page.locator("#mobile-nav").getByRole("link", { name: "For Schools" }),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
