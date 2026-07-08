import { test, expect, type Page, type Browser } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `st.trainer.${runId}@e2e.local`;
const clientEmail = `st.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

// Create a client through the invite flow, onboarding in imperial units, and
// return their page. No program is assigned — this client trains solo.
async function inviteImperialClient(browser: Browser): Promise<Page> {
  const tctx = await browser.newContext();
  const tp = await tctx.newPage();
  await tp.goto("/auth/sign-up");
  await tp.getByLabel("Full name").fill("ST Coach");
  await tp.getByLabel("Email").fill(trainerEmail);
  await tp.getByLabel("Password").fill(PW);
  await tp.getByRole("button", { name: "Start coaching" }).click();
  await expect(tp).toHaveURL(/\/coach/);

  await tp.getByLabel("Invite a client by email").fill(clientEmail);
  await tp.getByRole("button", { name: "Send invite" }).click();
  const inviteLink = await tp.getByTestId("invite-link").textContent();
  await tctx.close();

  const cctx = await browser.newContext();
  const cp = await cctx.newPage();
  await cp.goto(inviteLink!);
  await cp.getByLabel("Full name").fill("ST Client");
  await cp.getByLabel("Choose a password").fill(PW);
  await cp.getByRole("button", { name: "Join Training Hub" }).click();
  await expect(cp).toHaveURL(/\/app\/onboarding/);

  // Units toggle sits at the top; switch to imperial and enter ft/in + lb.
  await cp.getByRole("button", { name: "Imperial (lb, ft/in)" }).click();
  await cp.getByLabel(/main goal/i).fill("Train on my own");
  await cp.getByLabel("Height (ft)").fill("5");
  await cp.getByLabel("Height (in)").fill("10");
  await cp.getByLabel("Weight (lb)").fill("180");
  await cp.getByRole("button", { name: "Start training" }).click();
  await expect(cp).toHaveURL(/\/app$/);

  return cp;
}

test("client self-trains: imperial onboarding, quick start, routine, PR", async ({
  browser,
}) => {
  const cp = await inviteImperialClient(browser);

  // Imperial height was stored as metric (5'10" ≈ 177-178 cm).
  const heightCm = execSync(
    `psql "${DB_URL}" -tAc "select round(cp.height_cm) from public.client_profiles cp join auth.users u on u.id = cp.id where u.email = '${clientEmail}'"`,
  )
    .toString()
    .trim();
  expect(Number(heightCm)).toBeGreaterThanOrEqual(176);
  expect(Number(heightCm)).toBeLessThanOrEqual(179);

  // Quick start a solo workout from the Train tab.
  await cp.goto("/app/train");
  await cp.getByRole("button", { name: "Start a workout" }).click();
  await expect(cp).toHaveURL(/\/app\/workout\//);

  // Add an exercise on the fly and log a set — weights are entered in lb.
  await cp.getByRole("button", { name: "+ Add exercise" }).click();
  await cp.getByLabel("Search exercises").fill("Back Squat");
  await cp.getByRole("button", { name: /Back Squat/ }).click();
  await expect(cp.getByText("Weight (lb)")).toBeVisible();

  await cp.getByLabel("Set 1 weight").fill("135");
  await cp.getByLabel("Set 1 reps").fill("5");
  await cp.getByLabel("Set 1 reps").blur();

  await cp.getByRole("button", { name: "Complete workout" }).click();
  await expect(cp).toHaveURL(/\/summary$/);
  await expect(cp.getByRole("heading", { name: /done/ })).toBeVisible();

  // The solo session has no assignment, and the set landed (stored in kg).
  const solo = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.workout_sessions ws join auth.users u on u.id = ws.client_id where u.email = '${clientEmail}' and ws.assignment_id is null and ws.status = 'completed'"`,
  )
    .toString()
    .trim();
  expect(Number(solo)).toBe(1);

  const kg = execSync(
    `psql "${DB_URL}" -tAc "select round(sl.weight_kg) from public.set_logs sl join public.workout_sessions ws on ws.id = sl.session_id join auth.users u on u.id = ws.client_id where u.email = '${clientEmail}' and sl.program_day_exercise_id is null limit 1"`,
  )
    .toString()
    .trim();
  // 135 lb ≈ 61 kg
  expect(Number(kg)).toBeGreaterThanOrEqual(60);
  expect(Number(kg)).toBeLessThanOrEqual(62);

  // Save a reusable routine and start it — the player preloads its exercise.
  await cp.goto("/app/train");
  await cp.getByLabel("Routine name").fill("Push Day");
  await cp.getByRole("button", { name: "Create" }).click();
  await expect(cp).toHaveURL(/\/app\/train\/routines\//);

  await cp.getByRole("button", { name: "+ Add exercise" }).click();
  await cp.getByLabel("Search exercises").fill("Bench Press");
  await cp.getByRole("button", { name: /Bench Press/ }).first().click();
  await expect(cp.getByText(/Bench Press/)).toBeVisible();

  await cp.getByRole("button", { name: /Start this routine/ }).click();
  await expect(cp).toHaveURL(/\/app\/workout\//);
  await expect(cp.getByRole("heading", { name: "Push Day" })).toBeVisible();
  await expect(cp.getByRole("heading", { name: /Bench Press/ })).toBeVisible();
});
