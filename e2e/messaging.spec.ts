import { test, expect, type Browser, type Page } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `msg.trainer.${runId}@e2e.local`;
const clientEmail = `msg.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

async function setup(browser: Browser) {
  const tctx = await browser.newContext();
  const tp = await tctx.newPage();
  await tp.goto("/auth/sign-up");
  await tp.getByLabel("Full name").fill("Review Coach");
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
  await cp.getByLabel("Full name").fill("Review Client");
  await cp.getByLabel("Choose a password").fill(PW);
  await cp.getByRole("button", { name: "Join Training Hub" }).click();
  await expect(cp).toHaveURL(/\/app\/onboarding/);
  await cp.getByLabel(/main goal/i).fill("Get strong");
  await cp.getByRole("button", { name: "Start training" }).click();
  await expect(cp).toHaveURL(/\/app$/);

  const clientId = execSync(
    `psql "${DB_URL}" -tAc "select id from auth.users where email = '${clientEmail}'"`,
  )
    .toString()
    .trim();

  // Build + assign a program, client completes it (gives the trainer data)
  await tp.goto("/coach/programs");
  await tp.getByPlaceholder("e.g. 12-Week Strength Base").fill("Review Program");
  await tp.getByRole("button", { name: "Create" }).click();
  await expect(tp).toHaveURL(/\/coach\/programs\/[0-9a-f-]+/);
  await tp.getByRole("button", { name: "+ Exercise" }).first().click();
  await tp.getByLabel("Search exercises").last().fill("Back Squat");
  await tp.getByRole("button", { name: /Back Squat/ }).click();
  await tp.getByRole("button", { name: "Assign", exact: true }).click();
  await tp.locator("#start_date").fill(new Date().toISOString().slice(0, 10));
  await tp.getByRole("button", { name: "Confirm assignment" }).click();
  await expect(tp.getByText(/workouts scheduled/)).toBeVisible();

  await cp.goto("/app");
  await cp.getByRole("link", { name: /Start workout/ }).click();
  await cp.getByLabel("Set 1 weight").fill("120");
  await cp.getByLabel("Set 1 reps").fill("5");
  await cp.getByLabel("Set 1 weight").blur();
  await cp.getByRole("button", { name: "Complete workout" }).click();
  await expect(cp).toHaveURL(/\/summary$/);

  return { tp, cp, tctx, cctx, clientId };
}

test("trainer reviews real client data and exchanges live messages", async ({
  browser,
}) => {
  test.setTimeout(120_000); // heavy: full setup + review + realtime handshake
  const { tp, cp, tctx, cctx, clientId } = await setup(browser);

  // --- Trainer review: real logged data + adherence ---
  await tp.goto(`/coach/clients/${clientId}`);
  await expect(tp.getByText("Adherence")).toBeVisible();
  await expect(tp.getByText("100%")).toBeVisible(); // 1/1 completed

  await tp.getByRole("link", { name: "Workouts" }).click();
  await expect(tp.getByText("Back Squat")).toBeVisible();
  await expect(tp.getByText("120 kg × 5")).toBeVisible();

  // --- Realtime messaging between two live contexts ---
  await tp.goto(`/coach/messages/${clientId}`);
  await cp.goto("/app/messages");
  await expect(tp.getByLabel("Message")).toBeVisible();
  await expect(cp.getByLabel("Message")).toBeVisible();
  await tp.waitForTimeout(500);

  await tp.getByLabel("Message").fill("Great first session!");
  await tp.getByRole("button", { name: "Send" }).click();
  // Client sees it live (no reload)
  await expect(cp.getByText("Great first session!")).toBeVisible({
    timeout: 10000,
  });

  await cp.getByLabel("Message").fill("Thanks coach, felt strong");
  await cp.getByRole("button", { name: "Send" }).click();
  await expect(tp.getByText("Thanks coach, felt strong")).toBeVisible({
    timeout: 10000,
  });

  // Messages persisted
  const count = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.messages m join public.message_threads t on t.id = m.thread_id where t.client_id = '${clientId}'"`,
  )
    .toString()
    .trim();
  expect(Number(count)).toBe(2);

  await tctx.close();
  await cctx.close();
});
