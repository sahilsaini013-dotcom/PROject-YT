import { test, expect, type Browser } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const MAILPIT = "http://127.0.0.1:54324";

const runId = Date.now();
const trainerEmail = `notif.trainer.${runId}@e2e.local`;
const clientEmail = `notif.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

async function mailpitCount(toQuery: string): Promise<number> {
  try {
    const res = execSync(
      `curl -s "${MAILPIT}/api/v1/search?query=${encodeURIComponent(toQuery)}"`,
    ).toString();
    return JSON.parse(res).messages_count ?? 0;
  } catch {
    return 0;
  }
}

test("notifications fire in-app and by email for invite, assignment, and message", async ({
  browser,
}) => {
  test.setTimeout(120_000);
  const tctx = await browser.newContext();
  const tp = await tctx.newPage();
  await tp.goto("/auth/sign-up");
  await tp.getByLabel("Full name").fill("Notify Coach");
  await tp.getByLabel("Email").fill(trainerEmail);
  await tp.getByLabel("Password").fill(PW);
  await tp.getByRole("button", { name: "Start coaching" }).click();
  await expect(tp).toHaveURL(/\/coach/);

  // Invite → email to the invitee
  await tp.getByLabel("Invite a client by email").fill(clientEmail);
  await tp.getByRole("button", { name: "Send invite" }).click();
  const inviteLink = await tp.getByTestId("invite-link").textContent();
  await expect
    .poll(() => mailpitCount(clientEmail), { timeout: 10000 })
    .toBeGreaterThan(0);

  // Client accepts + onboards
  const cctx = await browser.newContext();
  const cp = await cctx.newPage();
  await cp.goto(inviteLink!);
  await cp.getByLabel("Full name").fill("Notify Client");
  await cp.getByLabel("Choose a password").fill(PW);
  await cp.getByRole("button", { name: "Join Training Hub" }).click();
  await cp.getByLabel(/main goal/i).fill("Get strong");
  await cp.getByRole("button", { name: "Start training" }).click();
  await expect(cp).toHaveURL(/\/app$/);

  const clientId = execSync(
    `psql "${DB_URL}" -tAc "select id from auth.users where email = '${clientEmail}'"`,
  )
    .toString()
    .trim();

  // Assign a program → in-app notification + email to client
  await tp.goto("/coach/programs");
  await tp.getByPlaceholder("e.g. 12-Week Strength Base").fill("Notify Program");
  await tp.getByRole("button", { name: "Create" }).click();
  await tp.getByRole("button", { name: "+ Exercise" }).first().click();
  await tp.getByLabel("Search exercises").last().fill("Back Squat");
  await tp.getByRole("button", { name: /Back Squat/ }).click();
  await tp.getByRole("button", { name: "Assign", exact: true }).click();
  await tp.locator("#start_date").fill(new Date().toISOString().slice(0, 10));
  await tp.getByRole("button", { name: "Confirm assignment" }).click();
  await expect(tp.getByText(/workouts scheduled/)).toBeVisible();

  await expect
    .poll(
      () =>
        Number(
          execSync(
            `psql "${DB_URL}" -tAc "select count(*) from public.notifications where user_id = '${clientId}' and kind = 'workout_assigned'"`,
          )
            .toString()
            .trim(),
        ),
      { timeout: 10000 },
    )
    .toBeGreaterThan(0);

  // Client sees the in-app notification and its unread badge
  await cp.goto("/app/notifications");
  await expect(cp.getByText("New program assigned")).toBeVisible();

  // Message → in-app notification (trigger) + email
  await tp.goto(`/coach/messages/${clientId}`);
  await tp.getByLabel("Message").fill("Welcome aboard!");
  await tp.getByRole("button", { name: "Send" }).click();

  await expect
    .poll(
      () =>
        Number(
          execSync(
            `psql "${DB_URL}" -tAc "select count(*) from public.notifications where user_id = '${clientId}' and kind = 'message_received'"`,
          )
            .toString()
            .trim(),
        ),
      { timeout: 10000 },
    )
    .toBeGreaterThan(0);

  // Emails for assignment + message reached the client's inbox
  await expect
    .poll(() => mailpitCount(clientEmail), { timeout: 10000 })
    .toBeGreaterThanOrEqual(3);

  await tctx.close();
  await cctx.close();
});
