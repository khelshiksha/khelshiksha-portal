import type { Page } from "@playwright/test";

/**
 * Bring the page to its settled visual state before auditing it.
 *
 * Scroll-revealed sections start at `opacity: 0` and transition in. If axe
 * samples while a transition is running it reads a BLENDED colour — e.g.
 * brand blue at 30% over cream — and reports a contrast failure that no user
 * ever sees. Those are harness artefacts, not defects, and treating them as
 * real would mean "fixing" colours that are already correct.
 *
 * So: scroll the whole page to trigger every IntersectionObserver, wait for
 * every reveal to be marked shown, let the transitions finish, then return to
 * the top.
 */
export async function settlePage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  /* Every reveal has been observed and marked. */
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll(".reveal")].every((el) =>
          el.classList.contains("is-shown"),
        ),
      undefined,
      { timeout: 5_000 },
    )
    .catch(() => {
      /* A page with no reveals resolves immediately; a genuinely stuck one
         falls through to the settle wait below and will fail loudly in the
         audit rather than hanging the suite. */
    });

  /* Reveal transitions are 400ms plus up to 240ms of stagger. */
  await page.waitForTimeout(750);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}
