import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    /* The performance and accessibility budgets are set against a mid-range
       Android on 4G, so the mobile project is not optional. */
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  /* Tests run against the PRODUCTION build. A dev-server audit misses
     minification, real hydration timing, and the actual shipped CSS. */
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    /* Opt the production build into the file-backed lead store so the E2E
       suite can exercise the real success path. Production without this env
       var still refuses to persist rather than dropping enquiries. */
    env: { LEAD_STORE: "file" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
