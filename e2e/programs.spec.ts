import { test, expect, type Page } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `prog.trainer.${runId}@e2e.local`;
const clientEmail = `prog.client.${runId}@e2e.local`;
const otherTrainerEmail = `prog.other.${runId}@e2e.local`;
const PW = "training-hub-e2e";

async function signUpTrainer(page: Page, email: string, name: string) {
  await page.goto("/auth/sign-up");
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PW);
  await page.getByRole("button", { name: "Start coaching" }).click();
  await expect(page).toHaveURL(/\/coach/);
}

let programId = "";

test.describe.serial("program builder + assignment", () => {
  test("trainer builds a 2-week program and assigns it to a client", async ({
    browser,
  }) => {
    const tctx = await browser.newContext();
    const tp = await tctx.newPage();
    await signUpTrainer(tp, trainerEmail, "Program Coach");

    // Invite + activate a client
    await tp.getByLabel("Invite a client by email").fill(clientEmail);
    await tp.getByRole("button", { name: "Send invite" }).click();
    const inviteLink = await tp.getByTestId("invite-link").textContent();

    const cctx = await browser.newContext();
    const cp = await cctx.newPage();
    await cp.goto(inviteLink!);
    await cp.getByLabel("Full name").fill("Program Client");
    await cp.getByLabel("Choose a password").fill(PW);
    await cp.getByRole("button", { name: "Join Training Hub" }).click();
    await expect(cp).toHaveURL(/\/app\/onboarding/);
    await cp.getByLabel(/main goal/i).fill("Get strong");
    await cp.getByRole("button", { name: "Start training" }).click();
    await expect(cp).toHaveURL(/\/app$/);

    // Build a program
    await tp.goto("/coach/programs");
    await tp.getByPlaceholder("e.g. 12-Week Strength Base").fill("E2E Strength");
    await tp.getByRole("button", { name: "Create" }).click();
    await expect(tp).toHaveURL(/\/coach\/programs\/[0-9a-f-]+/);
    programId = tp.url().split("/coach/programs/")[1];

    // Add an exercise to week 1 / day 1
    await tp.getByRole("button", { name: "+ Exercise" }).first().click();
    await tp.getByLabel("Search exercises").last().fill("Back Squat");
    await tp.getByRole("button", { name: /Back Squat/ }).click();
    await expect(tp.getByText("Back Squat")).toBeVisible();

    // Add a second week
    await tp.getByRole("button", { name: "+ Add week" }).click();
    await expect(tp.getByRole("heading", { name: "Week 2" })).toBeVisible();

    // Assign to the client, starting today
    await tp.getByRole("button", { name: "Assign", exact: true }).click();
    const today = new Date().toISOString().slice(0, 10);
    await tp.locator("#start_date").fill(today);
    await tp.getByRole("button", { name: "Confirm assignment" }).click();
    await expect(tp.getByText(/workouts scheduled/)).toBeVisible();

    // Verify a session actually landed in the DB for the client
    const count = execSync(
      `psql "${DB_URL}" -tAc "select count(*) from public.workout_sessions ws join auth.users u on u.id = ws.client_id where u.email = '${clientEmail}'"`,
    )
      .toString()
      .trim();
    expect(Number(count)).toBeGreaterThan(0);

    // Negative RLS through the real app: a second, unlinked trainer opening
    // the program URL must not see it (RLS filters the row → notFound()).
    // The authoritative DB-level assertion lives in supabase/tests/rls_test.sql.
    const octx = await browser.newContext();
    const op = await octx.newPage();
    await signUpTrainer(op, otherTrainerEmail, "Nosy Coach");
    await op.goto(`/coach/programs/${programId}`);
    await expect(op.getByText("E2E Strength")).toHaveCount(0);

    await tctx.close();
    await cctx.close();
    await octx.close();
  });
});
