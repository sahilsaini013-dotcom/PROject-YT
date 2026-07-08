import { test, expect, type Browser, type Page } from "@playwright/test";
import { execSync } from "node:child_process";

const DB_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const runId = Date.now();
const trainerEmail = `nut.trainer.${runId}@e2e.local`;
const clientEmail = `nut.client.${runId}@e2e.local`;
const PW = "training-hub-e2e";

// 1x1 transparent PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

async function setup(browser: Browser): Promise<{ client: Page; clientId: string }> {
  const tctx = await browser.newContext();
  const tp = await tctx.newPage();
  await tp.goto("/auth/sign-up");
  await tp.getByLabel("Full name").fill("Nut Coach");
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
  await cp.getByLabel("Full name").fill("Nut Client");
  await cp.getByLabel("Choose a password").fill(PW);
  await cp.getByRole("button", { name: "Join Training Hub" }).click();
  await expect(cp).toHaveURL(/\/app\/onboarding/);
  await cp.getByLabel(/main goal/i).fill("Body recomp");
  await cp.getByRole("button", { name: "Start training" }).click();
  await expect(cp).toHaveURL(/\/app$/);

  const clientId = execSync(
    `psql "${DB_URL}" -tAc "select id from auth.users where email = '${clientEmail}'"`,
  )
    .toString()
    .trim();

  // Trainer sets nutrition targets
  await tp.goto(`/coach/clients/${clientId}/nutrition/targets`);
  await tp.getByLabel("Calories (kcal)").fill("2400");
  await tp.getByLabel("Protein (g)").fill("180");
  await tp.getByLabel("Water (ml)").fill("3000");
  await tp.getByRole("button", { name: "Save targets" }).click();
  await expect(tp.getByText("Targets saved.")).toBeVisible();

  await tctx.close();
  return { client: cp, clientId };
}

test("client checks in, logs a meal with photo, tracks water vs target", async ({
  browser,
}) => {
  const { client: cp, clientId } = await setup(browser);

  // Daily check-in
  await cp.goto("/app/check-in");
  for (const label of ["Sleep quality", "Soreness", "Energy", "Mood", "Motivation"]) {
    await cp.getByRole("group", { name: label }).getByText("4").click();
  }
  await cp.getByRole("button", { name: /Submit check-in/ }).click();
  await expect(cp.getByText("Checked in — thanks!")).toBeVisible();

  // One check-in per day enforced at the DB level
  const checkins = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.check_ins where client_id = '${clientId}'"`,
  )
    .toString()
    .trim();
  expect(Number(checkins)).toBe(1);

  // Nutrition: targets visible, log a meal with a photo
  await cp.goto("/app/nutrition");
  await expect(cp.getByText("2400 kcal")).toBeVisible();

  await cp.getByRole("button", { name: "Log a meal" }).click();
  await cp.getByLabel("What did you eat?").fill("Chicken and rice");
  await cp.getByLabel("Calories (optional)").fill("600");
  await cp.getByLabel("Protein g (optional)").fill("50");
  await cp.getByLabel("Photo (optional)").setInputFiles({
    name: "meal.png",
    mimeType: "image/png",
    buffer: PNG,
  });
  await cp.getByRole("button", { name: "Save meal" }).click();
  await expect(cp.getByText("Chicken and rice")).toBeVisible();

  // Meal + private photo landed
  const meals = execSync(
    `psql "${DB_URL}" -tAc "select count(*) from public.meal_photos mp join public.meal_logs ml on ml.id = mp.meal_log_id where ml.client_id = '${clientId}'"`,
  )
    .toString()
    .trim();
  expect(Number(meals)).toBe(1);

  // The bucket is private — no public access to the object path
  const path = execSync(
    `psql "${DB_URL}" -tAc "select storage_path from public.meal_photos mp join public.meal_logs ml on ml.id = mp.meal_log_id where ml.client_id = '${clientId}' limit 1"`,
  )
    .toString()
    .trim();
  const restUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
  const publicRes = await cp.request.get(
    `${restUrl}/storage/v1/object/public/meal-photos/${path}`,
  );
  expect(publicRes.status()).toBeGreaterThanOrEqual(400);

  // Water tracking against the 3 L target (stored as ml, shown in liters)
  await cp.getByRole("button", { name: "+0.25 L" }).click();
  await expect(cp.getByText(/0\.25 L \/ 3 L/)).toBeVisible();

  // The upsert is async; poll until it lands.
  await expect
    .poll(
      () =>
        Number(
          execSync(
            `psql "${DB_URL}" -tAc "select coalesce((select total_ml from public.water_logs where client_id = '${clientId}'), 0)"`,
          )
            .toString()
            .trim(),
        ),
      { timeout: 10000 },
    )
    .toBe(250);
});
