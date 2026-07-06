import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Make the app's local Supabase env available to the test runner process
// (webServer inherits it via Next, but specs that call the REST API directly
// read it from process.env).
const envPath = "apps/web/.env.local";
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const PORT = Number(process.env.PORT ?? 3000);

// The cloud sandbox preinstalls a pinned Chromium at this path; use it when
// present. Everywhere else (CI, dev machines) Playwright's own browsers apply.
const sandboxChromium = "/opt/pw-browsers/chromium";
const chromiumPath =
  !process.env.CI && existsSync(sandboxChromium) ? sandboxChromium : undefined;

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
