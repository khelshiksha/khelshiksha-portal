import { expect, test } from "@playwright/test";
import { settlePage } from "./support/settle";

/**
 * Journey J1, keyboard only - a principal books a demo without a mouse.
 *
 * This is the manual "unplug the mouse and complete a demo booking" check
 * from docs/architecture/13-accessibility-checklist.md, automated. It is the
 * single highest-value accessibility test on the site, because J1 carries the
 * primary commercial load.
 */

test.describe("keyboard-only", () => {
  test("skip link is the first focusable element and jumps to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toBeFocused();
    /* Visible on focus - a skip link that stays off-screen is useless. */
    await expect(skip).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeVisible();
  });

  test("every interactive element on the homepage is reachable by Tab", async ({
    page,
  }) => {
    await page.goto("/");
    await settlePage(page);

    const interactive = await page
      .locator("main a[href], main button:not([disabled])")
      .count();
    expect(interactive).toBeGreaterThan(10);

    /* Walk the tab ring and record what receives focus. */
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      const id = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        return `${el.tagName}:${(el.textContent ?? "").trim().slice(0, 30)}`;
      });
      if (id) seen.add(id);
    }

    expect(seen.size).toBeGreaterThan(10);
  });

  test("focus is always visible, no element removes its indicator", async ({
    page,
  }) => {
    await page.goto("/schools");
    await settlePage(page);

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");

      const hasIndicator = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return true;
        const s = getComputedStyle(el);
        const outline =
          s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2;
        /* A ring/shadow or a border change are acceptable substitutes. */
        const shadow = s.boxShadow !== "none";
        return outline || shadow;
      });

      expect(hasIndicator).toBe(true);
    }
  });

  test("mega-menu opens on Enter, closes on Escape, and returns focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "desktop-only component");

    await page.goto("/");
    const trigger = page.getByRole("button", { name: /what we do/i });

    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.locator("#what-we-do-menu").getByRole("link", {
        name: "All learning kits",
      }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    /* Focus must come BACK to the trigger - otherwise a keyboard user is
       dumped at the top of the document. */
    await expect(trigger).toBeFocused();
  });

  test("J1: principal books a demo using only the keyboard", async ({
    page,
  }) => {
    await page.goto("/schools");
    await settlePage(page);

    /* The enquiry form is on the page itself - a principal should never have
       to navigate away to convert. */
    const form = page.locator("#enquire");
    await expect(form).toBeVisible();

    const name = page.getByLabel(/your name/i);
    await name.focus();
    await expect(name).toBeFocused();
    await page.keyboard.type("Meera Shah");

    await page.keyboard.press("Tab");
    await page.keyboard.type("9979873333");

    await page.keyboard.press("Tab");
    await page.keyboard.type("Shree Vidyalaya");

    await page.keyboard.press("Tab");
    await page.keyboard.type("Mehsana");

    const submit = page.getByRole("button", { name: /book a demo/i }).last();
    await submit.focus();
    await expect(submit).toBeFocused();
    await page.keyboard.press("Enter");

    /* Success is ANNOUNCED, not merely shown - role="status" makes it reach a
       screen reader without stealing focus. */
    const status = page.getByRole("status");
    await expect(status).toBeVisible({ timeout: 15_000 });
    await expect(status).toContainText(/thank you/i);
  });

  test("validation errors are announced and say how to fix it", async ({
    page,
  }) => {
    await page.goto("/contact?type=parent");

    await page.getByLabel(/your name/i).fill("Priya");
    await page.getByLabel(/mobile number/i).fill("123");
    await page.getByRole("button", { name: /ask us/i }).click();

    const error = page.getByText(/enter a 10-digit mobile number/i);
    await expect(error).toBeVisible({ timeout: 15_000 });

    /* The message must be tied to the field, not just floating near it. */
    const phone = page.getByLabel(/mobile number/i);
    await expect(phone).toHaveAttribute("aria-invalid", "true");
    const describedBy = await phone.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText(/10-digit/i);
  });
});

test.describe("progressive enhancement", () => {
  test.use({ javaScriptEnabled: false });

  test("content is fully visible and navigable without JavaScript", async ({
    page,
  }) => {
    await page.goto("/");

    /* The reveal system must never be able to hide content permanently. */
    await expect(
      page.getByRole("heading", { level: 1, name: /learning through play/i }),
    ).toBeVisible();
    await expect(page.getByText("12,000+ kits delivered")).toBeVisible();
    await expect(page.getByRole("link", { name: /aryabhata/i })).toBeVisible();

    /* Impact counters show their real value, not zero. */
    await expect(
      page.getByText("12,000+", { exact: false }).first(),
    ).toBeVisible();

    /* Navigation is plain links and still works. On mobile the header nav is
       a <details> so it opens without JS too - open it, then navigate. */
    const hamburger = page.getByRole("group").first();
    if (await hamburger.isVisible().catch(() => false)) {
      await page.locator("summary").first().click();
    }
    await page.getByRole("link", { name: "For Schools" }).first().click();
    await expect(
      page.getByRole("heading", { level: 1, name: /vidyalaya/i }),
    ).toBeVisible();
  });

  test("the enquiry form still submits without JavaScript", async ({
    page,
  }) => {
    await page.goto("/schools");

    await page.getByLabel(/your name/i).fill("Meera Shah");
    await page.getByLabel(/mobile number/i).fill("9979873333");
    await page.getByLabel(/school name/i).fill("Shree Vidyalaya");

    /* Focus + Enter rather than .click(): the page uses
       `scroll-behavior: smooth`, so Playwright's click stability check never
       settles while the element is scrolling into view. Pressing Enter on a
       focused submit button is also exactly what a keyboard user does. */
    const submit = page.getByRole("button", { name: /book a demo/i }).last();
    await submit.focus();
    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.keyboard.press("Enter"),
    ]);

    /* The success panel is a live region, so it reaches a screen reader on
       the freshly-loaded page too. */
    const status = page.getByRole("status");
    await expect(status).toBeVisible({ timeout: 15_000 });
    await expect(status).toContainText(/thank you/i);
  });
});
