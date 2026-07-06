import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);

// The cloud sandbox preinstalls a pinned Chromium; use it instead of
// downloading a Playwright-matched build. CI installs its own via
// `playwright install`, so no override is needed there.
const chromiumPath = process.env.CI ? undefined : "/opt/pw-browsers/chromium";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { executablePath: chromiumPath },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        launchOptions: { executablePath: chromiumPath },
      },
      testMatch: /.*\.mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: process.env.CI
      ? "npm run start --workspace apps/web"
      : "npm run dev --workspace apps/web",
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
