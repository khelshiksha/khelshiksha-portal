/**
 * Screenshot a live page at a given viewport, so a visual change can be
 * CHECKED rather than described.
 *
 *   node scripts/shoot.mjs <url> <out.png> [width] [height]
 *
 * Points at a public URL by design. Vercel PREVIEW deployments on this
 * project sit behind deployment protection and 302 to SSO, so they cannot be
 * shot this way - khelshiksha.com can. A local dev server is the other
 * option when it will start, which on this machine it frequently will not.
 */
import { chromium } from "playwright";

const [url, out, w = "390", h = "1400", theme] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/shoot.mjs <url> <out.png> [w] [h] [light|dark]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
/* The theme is an attribute on <html>, not a media query - see the note in
   styles/theme.css - so a colorScheme emulation alone would not switch it. */
if (theme) {
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await page.waitForTimeout(300);
}
/* The reveal animations are scroll-triggered; without this the shot catches
   cards at opacity 0 and looks like a broken page rather than a styled one. */
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("wrote", out);
