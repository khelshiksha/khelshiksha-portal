import { expect, test } from "@playwright/test";
import { settlePage } from "./support/settle";

/**
 * Regressions for defects observed on real devices.
 *
 * None of these are speculative - each one corresponds to a symptom that was
 * actually reproduced on hardware, and several were invisible in an emulator.
 *
 * THE RULE FOR THIS FILE: assert the OBSERVABLE BEHAVIOUR, never the CSS or
 * markup that currently produces it. Checking for `class="lift-on-hover"`
 * would prove only that a class name is still spelled the same way, and would
 * pass happily while the bug returned by a different route. Measuring
 * geometry, computed style and rendered position is slower to write and is
 * the only version worth having.
 *
 * These live in tests/e2e rather than in the local .audit harness because
 * .audit is gitignored - a regression test nobody else can run is a note to
 * self rather than a guarantee.
 */

test.describe("mobile navigation", () => {
  /* SYMPTOM: the mobile menu offered fewer destinations than the desktop bar.

     The panel listed the audience hubs and the What We Do groups and stopped,
     so /impact - the page carrying the institutional logos, the press
     cuttings and the numbers, i.e. the whole answer to "are these people
     real?" - was reachable on a laptop and nowhere on a phone.

     Compares the two menus against each other instead of against a hard-coded
     list, so a destination added to one and forgotten in the other fails
     here regardless of what it is. */
  test("the mobile menu offers every destination the desktop bar does", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "compares both menus");
    await page.goto("/");
    await settlePage(page);

    /* The desktop bar is `hidden lg:flex` - in the DOM at every width, so it
       can be read from a phone viewport. Panel links are excluded or the
       comparison would be against itself. */
    const desktop = await page.evaluate(() =>
      [...document.querySelectorAll("header nav a[href^='/']")]
        .filter((a) => a.closest("#mobile-nav") === null)
        .map((a) => a.getAttribute("href")!)
        .filter((href) => !href.includes("contact")),
    );
    expect(
      desktop,
      "desktop bar has no /impact link to compare against",
    ).toContain("/impact");

    await page.locator("header details.lg\\:hidden > summary").click();
    await expect(page.locator("#mobile-nav")).toBeVisible();

    const mobile = new Set(
      await page.evaluate(() =>
        [...document.querySelectorAll("#mobile-nav a[href^='/']")].map((a) =>
          a.getAttribute("href")!,
        ),
      ),
    );

    const missing = desktop.filter((href) => !mobile.has(href));
    expect(
      missing,
      `missing from the mobile menu: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  /* SYMPTOM: on iOS the menu button worked at the top of the page and stopped
     responding once scrolled.

     The only thing that changed on scroll was the header gaining a
     backdrop-filter, which iOS Safari has long-standing compositing bugs
     around. Asserts the behaviour at several depths rather than the styling,
     so it holds however the header is painted next. */
  test("the menu opens at every scroll depth", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile header only");
    await page.goto("/");
    await settlePage(page);

    for (const y of [0, 600, 1600, 3000]) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(350);

      const summary = page.locator("header details.lg\\:hidden > summary");
      await expect(summary, `menu button not visible at ${y}px`).toBeVisible();
      await summary.click();
      await expect(
        page.locator("#mobile-nav"),
        `menu did not open at ${y}px`,
      ).toBeVisible();

      /* And it must close again, or the next iteration proves nothing. */
      await summary.click();
      await expect(page.locator("#mobile-nav")).toBeHidden();
    }
  });

  /* With the hero's own buttons removed, the header is the only always-visible
     way to act. It used to be `hidden sm:inline-flex`, which would now leave a
     phone visitor with no call to action outside the hamburger. */
  test("the primary call to action is visible without opening the menu", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "mobile header only");
    await page.goto("/");
    await settlePage(page);
    await expect(
      page.locator("header a[href*='school-demo']").first(),
    ).toBeVisible();
  });
});

test.describe("kit cards", () => {
  /* SYMPTOM: the four featured kit cards were visibly different heights on a
     laptop.

     Two independent causes: the card was not h-full inside its stretched grid
     cell, and a second chip wrapped to a new row on exactly one of the four
     featured kits, pushing everything below it down. Measuring the rendered
     geometry catches both, and catches a third nobody has thought of. */
  test("cards in a row are the same height", async ({ page }) => {
    for (const route of ["/", "/products"]) {
      await page.goto(route);
      await settlePage(page);

      const rows = await page.evaluate(() => {
        const byTop = new Map<number, number[]>();
        /* main only - the header's What We Do menu links to /products/* too,
           and on a phone those are in the DOM at every scroll position. */
        for (const a of document.querySelectorAll(
          "main a[href^='/products/']",
        )) {
          const r = a.getBoundingClientRect();
          if (r.height === 0) continue;
          const top = Math.round(r.top);
          /* Grouped with a 2px tolerance to absorb sub-pixel layout - not
             enough slack to hide a real misalignment. */
          const key =
            [...byTop.keys()].find((k) => Math.abs(k - top) <= 2) ?? top;
          byTop.set(key, [...(byTop.get(key) ?? []), Math.round(r.height)]);
        }
        return [...byTop.values()];
      });

      expect(rows.length, `no kit cards found on ${route}`).toBeGreaterThan(0);
      for (const heights of rows) {
        expect(
          new Set(heights).size,
          `${route}: a row of kit cards has mixed heights, ${heights.join(", ")}`,
        ).toBe(1);
      }
    }
  });

  /* SYMPTOM: tapping a kit card on a phone felt like the page lurching upward
     before it navigated.

     It was: the card was. A touch browser latches :hover on tap, so the card
     ran its 4px lift and its 105% image zoom and only then followed the link.
     Both now sit behind (hover: hover) and (pointer: fine). Playwright's
     mobile project sets hasTouch, so this exercises the real condition rather
     than the presence of a class. */
  test("a card does not lift or zoom on a touch device", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "touch-only behaviour");
    await page.goto("/");
    await settlePage(page);

    const card = page.locator("main a[href^='/products/']").first();
    await card.scrollIntoViewIfNeeded();
    await card.dispatchEvent("pointerover");
    await page.waitForTimeout(400);

    const state = await card.evaluate((el) => ({
      card: getComputedStyle(el).transform,
      media: getComputedStyle(el.querySelector("img")!).transform,
    }));
    expect(state.card, "the card lifted under a touch pointer").toBe("none");
    expect(state.media, "the card image zoomed under a touch pointer").toBe(
      "none",
    );
  });
});

test.describe("hero", () => {
  /* SYMPTOM: the hero looked mis-cropped on a phone.

     The zone caption is the only thing that names the five pillars on a
     phone. Pinned to the bottom edge of the campus it landed below the fold
     on an iPhone 13 - present, and useless. */
  test("the campus caption is above the fold on a phone", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "mobile framing");
    await page.goto("/");
    await settlePage(page);

    const box = await page
      .locator(".kv-pin.is-current")
      .first()
      .boundingBox({ timeout: 10_000 });
    expect(box, "no zone caption is showing").not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(
      page.viewportSize()!.height,
    );
  });

  /* The sky went in, came out because clouds drifted across the hero
     paragraph, and went back in once the campus had a band of its own.
     Nothing in it may overlap the copy again. */
  test("nothing in the sky overlaps the hero copy", async ({ page }) => {
    await page.goto("/");
    await settlePage(page);

    const overlaps = await page.evaluate(() => {
      const copy = [...document.querySelectorAll(".kv-hero h1, .kv-hero p")];
      const sky = [...document.querySelectorAll(".kv-cloud, .kv-flock")];
      const hits: string[] = [];
      for (const s of sky) {
        const a = s.getBoundingClientRect();
        for (const c of copy) {
          const b = c.getBoundingClientRect();
          if (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
          ) {
            hits.push(
              `${s.getAttribute("class")} over "${c.textContent?.slice(0, 30)}"`,
            );
          }
        }
      }
      return hits;
    });
    expect(overlaps, overlaps.join("; ")).toEqual([]);
  });
});

test.describe("outbound links", () => {
  /* The Instagram handle in the footer was a guess and was wrong, and
     Facebook and X were guesses too. These are also emitted as schema.org
     sameAs, where a wrong URL tells a search engine the wrong entity is us.
     This does not check that the accounts exist - it checks that nobody has
     quietly added a placeholder back. */
  test("every social link is one of the confirmed accounts", async ({
    page,
  }) => {
    await page.goto("/");
    await settlePage(page);

    const CONFIRMED = [
      "https://www.instagram.com/khelshikshagames",
      "https://in.linkedin.com/company/khelshiksha",
      "https://www.youtube.com/channel/UCwJYHjd7qiL0_z1VeA5pJew",
    ];

    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll("footer a[href^='http']")].map((a) =>
        a.getAttribute("href")!,
      ),
    );

    expect(hrefs.length).toBeGreaterThan(0);
    const unexpected = hrefs.filter((h) => !CONFIRMED.includes(h));
    expect(
      unexpected,
      `unconfirmed outbound link(s) in the footer: ${unexpected.join(", ")}`,
    ).toEqual([]);
  });
});

test.describe("link previews", () => {
  /* SYMPTOM: sharing the site on WhatsApp produced a text-only card with no
     image.

     og:image pointed at /opengraph-image, which returned a 404 HTML page. The
     proxy rewrites every extension-less path into the [locale] segment, and
     Next serves the Open Graph image from src/app/opengraph-image.tsx, which
     sits outside it - so the card was being rewritten to a route that does
     not exist.

     Nothing on the site itself was broken, which is why it went unnoticed:
     the only symptom lived in someone else's chat app. This fetches the URL
     the crawlers are actually given and checks that an image comes back,
     because a 200 that serves HTML is exactly the failure being guarded
     against. */
  for (const route of ["/", "/products/aryabhata", "/impact"]) {
    test(`the og:image for ${route} is a real image`, async ({
      page,
      request,
    }) => {
      await page.goto(route);

      const url = await page.getAttribute(
        'meta[property="og:image"]',
        "content",
      );
      expect(url, `${route} declares no og:image`).toBeTruthy();
      expect(
        url,
        "og:image must be absolute - crawlers do not resolve relative URLs",
      ).toMatch(/^https?:\/\//);

      const res = await request.get(url!);
      expect(
        res.status(),
        `og:image for ${route} returned ${res.status()}`,
      ).toBe(200);

      const type = res.headers()["content-type"] ?? "";
      expect(
        type,
        `og:image for ${route} served "${type}", not an image`,
      ).toMatch(/^image\//);

      /* WhatsApp skips thumbnails much above this, so a card that technically
         resolves can still render as text. */
      const bytes = (await res.body()).length;
      expect(bytes, "og:image is empty").toBeGreaterThan(1000);
      expect(
        bytes,
        `og:image is ${Math.round(bytes / 1024)}KB; WhatsApp drops large images`,
      ).toBeLessThan(300_000);
    });
  }
});

test.describe("the mascot", () => {
  /* NOT A REGRESSION - a tripwire, written the day the mascot landed.

     The mascot is the first raster on the site large enough to matter and the
     first placed for decoration rather than for information, which puts it in
     front of the two failure modes that are invisible in dev on a laptop:

       1. A wrong `sizes` makes a phone fetch a 792px master for a 96px slot.
          Nothing looks wrong. The page is just quietly heavier, and only on
          the devices least able to afford it.

       2. Someone adds `priority` to "make it appear faster". That injects a
          <link rel="preload" as="image"> which competes with the stylesheet
          and the preloaded sans font for the first round trips - the two
          resources the home page's TEXT LCP actually depends on. Decoration
          preloaded ahead of the thing being measured.

     Both assertions read what the browser actually did, per the rule at the
     top of this file: the resolved request width, and the real <head>. */
  const PLACEMENTS = [
    { route: "/not-a-real-page", name: "404" },
    { route: "/parents", name: "parents hub" },
  ];

  for (const { route, name } of PLACEMENTS) {
    test(`the ${name} mascot is not served oversized`, async ({
      page,
    }, info) => {
      await page.goto(route);
      await settlePage(page);

      const img = page.locator('img[src*="mascot"]').first();

      /* Both placements are desktop-only by design, so on mobile the correct
         result is that there is no mascot at all - which is itself worth
         asserting, since a stray one would be pure weight on the device that
         can least afford it. */
      if (info.project.name === "mobile") {
        await expect(img).toHaveCount(0);
        return;
      }

      await expect(img).toBeVisible();

      const src = (await img.getAttribute("src")) ?? "";
      const requested = Number(new URL(src, page.url()).searchParams.get("w"));
      expect(
        requested,
        `${src} carries no width - is it going through next/image?`,
      ).toBeGreaterThan(0);

      const box = await img.boundingBox();
      const rendered = box?.width ?? 0;
      expect(rendered).toBeGreaterThan(0);

      /* The next bucket above 2x is the honest ceiling: Next picks from a
         fixed ladder, so a 256px slot at DPR 2 legitimately resolves to 640.
         Anything past 2.7x means the `sizes` hint is wrong, not that the
         ladder is coarse. */
      expect(
        requested,
        `requested ${requested}px for a ${Math.round(rendered)}px slot - check the sizes hint in ui/mascot.tsx`,
      ).toBeLessThanOrEqual(rendered * 2.7);
    });

    test(`the ${name} mascot is never preloaded`, async ({ page }) => {
      await page.goto(route);

      const preloaded = await page
        .locator('head link[rel="preload"][as="image"]')
        .evaluateAll((links) =>
          links.map((l) => l.getAttribute("href") ?? "").join(" "),
        );

      expect(
        preloaded,
        "the mascot is preloaded - that is `priority`, and it competes with the font the text LCP needs",
      ).not.toContain("mascot");
    });
  }
});
