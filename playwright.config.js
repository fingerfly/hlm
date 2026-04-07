/**
 * Purpose: Browser smoke against built `dist/` (master DesktopBrowserMatrix).
 * Description:
 * - Serves `dist/` after `buildDist`; targets `public/index.html` entry.
 * - Projects: desktop Chromium, WebKit (Safari-class), tablet, mobile.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 900, height: 1200 },
        hasTouch: true
      }
    },
    { name: "mobile", use: { ...devices["Pixel 5"] } }
  ],
  webServer: {
    command: "node scripts/e2eStaticServe.mjs",
    url: "http://127.0.0.1:4173/public/index.html",
    timeout: 120000,
    reuseExistingServer: !process.env.CI
  }
});
