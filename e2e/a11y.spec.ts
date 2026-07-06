import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const runId = Date.now();
const trainerEmail = `a11y.trainer.${runId}@e2e.local`;
const clientEmail = `a11y.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

// Serious/critical axe violations are what tank a Lighthouse a11y score;
// asserting none keeps /coach and /app well above the 90 bar.
async function assertNoSeriousViolations(page: Page, context: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  const summary = serious
    .map((v) => `${v.id} (${v.nodes.length})`)
    .join(", ");
  expect(serious, `${context}: ${summary}`).toEqual([]);
}

test.describe.serial("accessibility", () => {
  test("public pages have no serious a11y violations", async ({ page }) => {
    await page.goto("/");
    await assertNoSeriousViolations(page, "landing");
    await page.goto("/auth/sign-in");
    await assertNoSeriousViolations(page, "sign-in");
    await page.goto("/auth/sign-up");
    await assertNoSeriousViolations(page, "sign-up");
  });

  test("coach and app pages have no serious a11y violations", async ({
    browser,
  }) => {
    test.setTimeout(90_000);
    // Trainer → /coach
    const tctx = await browser.newContext();
    const tp = await tctx.newPage();
    await tp.goto("/auth/sign-up");
    await tp.getByLabel("Full name").fill("A11y Coach");
    await tp.getByLabel("Email").fill(trainerEmail);
    await tp.getByLabel("Password").fill(PW);
    await tp.getByRole("button", { name: "Start coaching" }).click();
    await expect(tp).toHaveURL(/\/coach/);
    await assertNoSeriousViolations(tp, "/coach roster");
    await tp.goto("/coach/programs");
    await assertNoSeriousViolations(tp, "/coach/programs");
    await tp.goto("/coach/exercises");
    await assertNoSeriousViolations(tp, "/coach/exercises");

    // Invite a client so we can audit the client app authenticated
    await tp.goto("/coach");
    await tp.getByLabel("Invite a client by email").fill(clientEmail);
    await tp.getByRole("button", { name: "Send invite" }).click();
    const inviteLink = await tp.getByTestId("invite-link").textContent();

    const cctx = await browser.newContext();
    const cp = await cctx.newPage();
    await cp.goto(inviteLink!);
    await cp.getByLabel("Full name").fill("A11y Client");
    await cp.getByLabel("Choose a password").fill(PW);
    await cp.getByRole("button", { name: "Join Training Hub" }).click();
    await expect(cp).toHaveURL(/\/app\/onboarding/);
    await assertNoSeriousViolations(cp, "/app/onboarding");
    await cp.getByLabel(/main goal/i).fill("Get strong");
    await cp.getByRole("button", { name: "Start training" }).click();
    await expect(cp).toHaveURL(/\/app$/);
    await assertNoSeriousViolations(cp, "/app today");
    await cp.goto("/app/check-in");
    await assertNoSeriousViolations(cp, "/app/check-in");
    await cp.goto("/app/nutrition");
    await assertNoSeriousViolations(cp, "/app/nutrition");

    await tctx.close();
    await cctx.close();
  });
});
