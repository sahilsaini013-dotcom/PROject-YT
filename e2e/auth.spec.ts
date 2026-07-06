import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `trainer.${runId}@e2e.local`;
const clientEmail = `client.${runId}@e2e.local`;

test.describe.serial("auth + invite flow", () => {
  test("trainer signs up, invites; client accepts, onboards, lands on Today", async ({
    browser,
  }) => {
    const trainerContext = await browser.newContext();
    const trainerPage = await trainerContext.newPage();

    // Trainer signup
    await trainerPage.goto("/auth/sign-up");
    await trainerPage.getByLabel("Full name").fill("Casey Coach");
    await trainerPage.getByLabel("Email").fill(trainerEmail);
    await trainerPage.getByLabel("Password").fill("training-hub-e2e");
    await trainerPage.getByRole("button", { name: "Start coaching" }).click();
    await expect(trainerPage).toHaveURL(/\/coach/);
    await expect(
      trainerPage.getByRole("heading", { name: "Roster" }),
    ).toBeVisible();

    // Invite a client
    await trainerPage
      .getByLabel("Invite a client by email")
      .fill(clientEmail);
    await trainerPage.getByRole("button", { name: "Send invite" }).click();
    const inviteLink = await trainerPage
      .getByTestId("invite-link")
      .textContent();
    expect(inviteLink).toContain("/auth/invite/");

    // Client accepts in a separate browser context
    const clientContext = await browser.newContext();
    const clientPage = await clientContext.newPage();
    await clientPage.goto(inviteLink!);
    await expect(
      clientPage.getByRole("heading", { name: /Casey Coach invited you/ }),
    ).toBeVisible();
    await clientPage.getByLabel("Full name").fill("Riley Client");
    await clientPage.getByLabel("Choose a password").fill("training-hub-e2e");
    await clientPage.getByRole("button", { name: "Join Training Hub" }).click();

    // Onboarding
    await expect(clientPage).toHaveURL(/\/app\/onboarding/);
    await clientPage
      .getByLabel(/main goal/i)
      .fill("Get strong for climbing season");
    await clientPage.getByLabel("Height (cm)").fill("178");
    await clientPage.getByLabel("Weight (kg)").fill("74");
    await clientPage.getByRole("button", { name: "Start training" }).click();

    // Lands on Today
    await expect(clientPage).toHaveURL(/\/app$/);
    await expect(
      clientPage.getByRole("heading", { name: /Hey Riley/ }),
    ).toBeVisible();

    // Trainer sees the client active on the roster
    await trainerPage.reload();
    await expect(trainerPage.getByText("Riley Client")).toBeVisible();
    await expect(trainerPage.getByText("active")).toBeVisible();

    // Role routing: the client cannot open the coach dashboard
    await clientPage.goto("/coach");
    await expect(clientPage).toHaveURL(/\/app$/);

    // And the trainer cannot open the client app
    await trainerPage.goto("/app");
    await expect(trainerPage).toHaveURL(/\/coach/);

    await trainerContext.close();
    await clientContext.close();
  });

  test("anonymous users are sent to sign-in", async ({ page }) => {
    await page.goto("/coach");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await page.goto("/app");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("signing out returns to sign-in without crashing", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(trainerEmail);
    await page.getByLabel("Password").fill("training-hub-e2e");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/coach/);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/auth\/sign-in/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("magic-link callback with a bad code lands on sign-in", async ({
    page,
  }) => {
    // The callback route must consume the code param, not 404 or hang.
    await page.goto("/auth/callback?code=invalid-code");
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test("expired invite tokens are rejected", async ({ browser }) => {
    const trainerContext = await browser.newContext();
    const trainerPage = await trainerContext.newPage();

    // Sign in as the existing trainer and create a second invite
    await trainerPage.goto("/auth/sign-in");
    await trainerPage.getByLabel("Email").fill(trainerEmail);
    await trainerPage.getByLabel("Password").fill("training-hub-e2e");
    await trainerPage.getByRole("button", { name: "Sign in" }).click();
    await expect(trainerPage).toHaveURL(/\/coach/);

    await trainerPage
      .getByLabel("Invite a client by email")
      .fill(`expired.${runId}@e2e.local`);
    await trainerPage.getByRole("button", { name: "Send invite" }).click();
    const inviteLink = await trainerPage
      .getByTestId("invite-link")
      .textContent();
    const token = inviteLink!.split("/auth/invite/")[1];

    // Force-expire it at the database level
    execSync(
      `psql "${DB_URL}" -c "update public.invitations set expires_at = now() - interval '1 day' where token = '${token}'"`,
    );

    const visitorContext = await browser.newContext();
    const visitorPage = await visitorContext.newPage();
    await visitorPage.goto(inviteLink!);
    await expect(
      visitorPage.getByRole("heading", { name: /expired/i }),
    ).toBeVisible();

    await trainerContext.close();
    await visitorContext.close();
  });
});
