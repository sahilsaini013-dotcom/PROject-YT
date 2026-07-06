import { test, expect, type Page, type Browser } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `wo.trainer.${runId}@e2e.local`;
const clientEmail = `wo.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

async function buildAndAssign(browser: Browser): Promise<Page> {
  const tctx = await browser.newContext();
  const tp = await tctx.newPage();
  await tp.goto("/auth/sign-up");
  await tp.getByLabel("Full name").fill("WO Coach");
  await tp.getByLabel("Email").fill(trainerEmail);
  await tp.getByLabel("Password").fill(PW);
  await tp.getByRole("button", { name: "Start coaching" }).click();
  await expect(tp).toHaveURL(/\/coach/);

  await tp.getByLabel("Invite a client by email").fill(clientEmail);
  await tp.getByRole("button", { name: "Send invite" }).click();
  const inviteLink = await tp.getByTestId("invite-link").textContent();

  const cctx = await browser.newContext();
  const cp = await cctx.newPage();
  await cp.goto(inviteLink!);
  await cp.getByLabel("Full name").fill("WO Client");
  await cp.getByLabel("Choose a password").fill(PW);
  await cp.getByRole("button", { name: "Join Training Hub" }).click();
  await expect(cp).toHaveURL(/\/app\/onboarding/);
  await cp.getByLabel(/main goal/i).fill("Get strong");
  await cp.getByRole("button", { name: "Start training" }).click();
  await expect(cp).toHaveURL(/\/app$/);

  // Build a 1-day program with one exercise, assign starting today
  await tp.goto("/coach/programs");
  await tp.getByPlaceholder("e.g. 12-Week Strength Base").fill("WO Program");
  await tp.getByRole("button", { name: "Create" }).click();
  await expect(tp).toHaveURL(/\/coach\/programs\/[0-9a-f-]+/);
  await tp.getByRole("button", { name: "+ Exercise" }).first().click();
  await tp.getByLabel("Search exercises").last().fill("Back Squat");
  await tp.getByRole("button", { name: /Back Squat/ }).click();
  await expect(tp.getByText("Back Squat")).toBeVisible();

  await tp.getByRole("button", { name: "Assign", exact: true }).click();
  const today = new Date().toISOString().slice(0, 10);
  await tp.locator("#start_date").fill(today);
  await tp.getByRole("button", { name: "Confirm assignment" }).click();
  await expect(tp.getByText(/workouts scheduled/)).toBeVisible();

  await tctx.close();
  return cp;
}

test("client completes an assigned workout, logs sets, gets a PR", async ({
  browser,
}) => {
  const cp = await buildAndAssign(browser);

  // Today shows the assigned workout
  await cp.goto("/app");
  await expect(cp.getByText("Today's workout")).toBeVisible();
  await cp.getByRole("link", { name: /Start workout/ }).click();
  await expect(cp).toHaveURL(/\/app\/workout\//);

  await cp
    .getByLabel("Substitution note for Back Squat")
    .fill("Knee felt tight; used stance adjustment");

  // Log 3 sets of the squat
  const weights = ["100", "100", "100"];
  const reps = ["5", "5", "5"];
  for (let i = 0; i < 3; i++) {
    await cp.getByLabel(`Set ${i + 1} weight`).fill(weights[i]);
    await cp.getByLabel(`Set ${i + 1} reps`).fill(reps[i]);
    await cp.getByLabel(`Set ${i + 1} weight`).blur();
  }

  await cp.getByRole("button", { name: "Complete workout" }).click();

  // Lands on the session summary with celebration + PRs (first-ever lift is a PR)
  await expect(cp).toHaveURL(/\/summary$/);
  await expect(cp.getByRole("heading", { name: /done/ })).toBeVisible();
  await expect(
    cp.getByRole("heading", { name: "Personal records" }),
  ).toBeVisible();

  // Data actually landed in set_logs and personal_records
  const logged = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.set_logs sl join public.workout_sessions ws on ws.id = sl.session_id join auth.users u on u.id = ws.client_id where u.email = '${clientEmail}'"`,
  )
    .toString()
    .trim();
  expect(Number(logged)).toBe(3);

  const noted = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.set_logs sl join public.workout_sessions ws on ws.id = sl.session_id join auth.users u on u.id = ws.client_id where u.email = '${clientEmail}' and sl.pain_note = 'Knee felt tight; used stance adjustment'"`,
  )
    .toString()
    .trim();
  expect(Number(noted)).toBe(3);

  const prCount = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.personal_records pr join auth.users u on u.id = pr.client_id where u.email = '${clientEmail}'"`,
  )
    .toString()
    .trim();
  expect(Number(prCount)).toBeGreaterThan(0);

  // Back to Today — the session is no longer due
  await cp.getByRole("link", { name: "Back to Today" }).click();
  await expect(cp).toHaveURL(/\/app$/);
  await expect(cp.getByText("Nothing due today")).toBeVisible();
});
