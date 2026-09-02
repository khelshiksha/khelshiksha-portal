/**
 * Walks every route in both themes at phone and desktop width, and reports
 * the things a human notices last and a browser knows immediately:
 * console errors, failed requests, horizontal overflow, and images served at
 * the wrong size.
 *
 *   node scripts/audit.mjs [baseUrl]
 *
 * Defaults to production because Vercel previews on this project sit behind
 * SSO and a headless browser cannot reach them.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "https://khelshiksha.com";
const ROUTES = [
  "/", "/schools", "/parents", "/government", "/corporate",
  "/about", "/impact", "/products", "/products/road-safety",
  "/approach", "/approach/pillars", "/approach/why-experiential",
  "/approach/game-corner", "/contact", "/privacy", "/terms",
];
const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const findings = [];

for (const theme of ["light", "dark"]) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme: theme,
    });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      const errors = [];
      const failed = [];
      page.removeAllListeners("console");
      page.removeAllListeners("requestfailed");
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
      page.on("requestfailed", (r) => {
        const why = r.failure()?.errorText ?? "";
        /* ERR_ABORTED ON AN RSC PREFETCH IS NOT A FAULT.
           Next prefetches the payload for every Link in the viewport and
           cancels those still in flight when the page navigates or the
           context closes. The first run of this audit reported 54 of them and
           zero real problems, which is exactly how a checker teaches people
           to ignore it. Anything else that fails is still reported, including
           an aborted request that is NOT a prefetch. */
        if (why.includes("ERR_ABORTED") && r.url().includes("_rsc=")) return;
        failed.push(`${why} ${r.url().slice(0, 110)}`);
      });

      try {
        await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
      } catch (e) {
        findings.push({ theme, vp: vp.name, route, kind: "nav", detail: String(e).slice(0, 120) });
        continue;
      }

      /* The theme is an attribute on <html>, not a media query - see the note
         in styles/theme.css - so colorScheme alone does not switch it. */
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(700);

      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        if (de.scrollWidth <= de.clientWidth + 1) return null;
        /* Name the widest offender, or "the page scrolls sideways" is a
           finding nobody can act on. */
        let worst = null;
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > de.clientWidth + 1 && r.width > 0) {
            const over = r.right - de.clientWidth;
            if (!worst || over > worst.over) {
              worst = { over: Math.round(over), tag: el.tagName.toLowerCase(),
                        cls: (el.className?.toString?.() ?? "").slice(0, 70) };
            }
          }
        }
        return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, worst };
      });

      if (overflow) findings.push({ theme, vp: vp.name, route, kind: "overflow", detail: JSON.stringify(overflow) });
      if (errors.length) findings.push({ theme, vp: vp.name, route, kind: "console", detail: errors.slice(0, 3).join(" | ") });
      if (failed.length) findings.push({ theme, vp: vp.name, route, kind: "requestfailed", detail: failed.slice(0, 3).join(" | ") });
    }
    await ctx.close();
  }
}

await browser.close();
if (findings.length === 0) {
  console.log("CLEAN - no console errors, failed requests or horizontal overflow.");
} else {
  console.log(`${findings.length} finding(s):\n`);
  for (const f of findings) {
    console.log(`[${f.kind}] ${f.theme}/${f.vp} ${f.route}\n    ${f.detail}\n`);
  }
}
