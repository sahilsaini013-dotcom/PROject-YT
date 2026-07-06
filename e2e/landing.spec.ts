import { test, expect } from "@playwright/test";

test.describe("landing page", () => {
  test("serves the brand landing", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Training Hub/);
    await expect(
      page.getByRole("heading", { name: /coach smarter/i }),
    ).toBeVisible();
    // Primary CTA is the volt brand moment
    await expect(
      page.getByRole("link", { name: "Start coaching" }),
    ).toBeVisible();
    // Hero animation asset actually resolves
    const res = await page.request.get("/brand/animations/hero-loop.svg");
    expect(res.ok()).toBeTruthy();
  });

  test("PWA manifest is served and installable-shaped", async ({ page }) => {
    const res = await page.request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
    const manifest = await res.json();
    expect(manifest.name).toBe("Training Hub");
    expect(manifest.display).toBe("standalone");
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    for (const icon of manifest.icons) {
      const iconRes = await page.request.get(icon.src);
      expect(iconRes.ok()).toBeTruthy();
    }
  });

  test("coach and app shells respond", async ({ page }) => {
    await page.goto("/coach");
    await expect(page.getByRole("heading", { name: /coach/i })).toBeVisible();
    await page.goto("/app");
    await expect(page.getByRole("heading", { name: /today/i })).toBeVisible();
  });
});
