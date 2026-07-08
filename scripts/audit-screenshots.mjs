// Drives a full coaching loop and screenshots every key screen at the target
// viewports for the multi-agent UI audit. Run against a dev server with a
// fresh DB. Usage: node scripts/audit-screenshots.mjs <outDir>
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = "http://127.0.0.1:3000";
const EXE = "/opt/pw-browsers/chromium";
const run = Date.now();
const trainer = `demo.coach.${run}@e2e.local`;
const client = `demo.client.${run}@e2e.local`;
const PW = "training-hub-demo1";
mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const DESKTOP_NARROW = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };
const MOBILE_NARROW = { width: 360, height: 780 };
const MOBILE_WIDE = { width: 430, height: 932 };

const browser = await chromium.launch({
  executablePath: existsSync(EXE) ? EXE : undefined,
});
const manifest = [];

async function shot(page, name) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  manifest.push(name);
  console.log("shot", name);
}

// --- Trainer ---
const tctx = await browser.newContext({ viewport: DESKTOP });
const tp = await tctx.newPage();
await tp.goto(`${BASE}/`);
await shot(tp, "01-landing");
await tp.goto(`${BASE}/auth/sign-up`);
await shot(tp, "02-signup");
await tp.getByLabel("Full name").fill("Jordan Vale");
await tp.getByLabel("Email").fill(trainer);
await tp.getByLabel("Password").fill(PW);
await tp.getByRole("button", { name: "Start coaching" }).click();
await tp.waitForURL(/coach/);
await shot(tp, "03-coach-roster-empty");

await tp.getByLabel("Invite a client by email").fill(client);
await tp.getByRole("button", { name: "Send invite" }).click();
const inviteLink = await tp.getByTestId("invite-link").textContent();
await shot(tp, "04-coach-roster-invited");

// --- Client accepts + full loop ---
const cctx = await browser.newContext({ viewport: MOBILE });
const cp = await cctx.newPage();
await cp.goto(inviteLink);
await shot(cp, "20-invite-accept");
await cp.getByLabel("Full name").fill("Alex Rivera");
await cp.getByLabel("Choose a password").fill(PW);
await cp.getByRole("button", { name: "Join Training Hub" }).click();
await cp.waitForURL(/onboarding/);
await shot(cp, "21-onboarding");
await cp.getByLabel(/main goal/i).fill("Build strength and stay consistent");
await cp.getByLabel("Height (cm)").fill("180");
await cp.getByLabel("Weight (kg)").fill("82");
await cp.getByRole("button", { name: "Start training" }).click();
await cp.waitForURL(/\/app$/);
await shot(cp, "22-app-today-empty");

await tp.goto(`${BASE}/coach`);
const clientHref = await tp
  .getByRole("link", { name: /Alex Rivera/ })
  .first()
  .getAttribute("href");
if (!clientHref) {
  throw new Error("Could not find the accepted client link in the coach roster");
}
const clientId = clientHref.split("/").pop();

// Trainer builds a program
await tp.goto(`${BASE}/coach/exercises`);
await shot(tp, "05-coach-exercises");
await tp.goto(`${BASE}/coach/programs`);
await shot(tp, "06-coach-programs-empty");
await tp.getByPlaceholder("e.g. 12-Week Strength Base").fill("Foundations — Full Body");
await tp.getByRole("button", { name: "Create" }).click();
await tp.waitForURL(/programs\/[0-9a-f-]+/);
for (const name of ["Back Squat", "Bench Press", "Bent-Over Row"]) {
  await tp.getByRole("button", { name: "+ Exercise" }).first().click();
  await tp.getByLabel("Search exercises").last().fill(name);
  await tp.getByRole("button", { name: new RegExp(name) }).first().click();
  await tp.waitForTimeout(300);
}
await tp.getByRole("button", { name: "+ Add week" }).click();
await tp.waitForTimeout(400);
await shot(tp, "07-coach-program-builder");

// Assign
await tp.getByRole("button", { name: "Assign", exact: true }).click();
await tp.locator("#start_date").fill(new Date().toISOString().slice(0, 10));
await tp.getByRole("button", { name: "Confirm assignment" }).click();
await tp.waitForTimeout(600);
await shot(tp, "08-coach-program-assigned");

// Set nutrition targets
await tp.goto(`${BASE}/coach/clients/${clientId}/nutrition/targets`);
await tp.getByLabel("Calories (kcal)").fill("2600");
await tp.getByLabel("Protein (g)").fill("185");
await tp.getByLabel("Carbs (g)").fill("280");
await tp.getByLabel("Fat (g)").fill("80");
await tp.getByLabel("Water (ml)").fill("3000");
await tp.getByRole("button", { name: "Save targets" }).click();
await tp.waitForTimeout(400);
await shot(tp, "09-coach-set-targets");

// Client trains
await cp.goto(`${BASE}/app`);
await shot(cp, "23-app-today-assigned");
await cp.getByRole("link", { name: /Start workout/ }).click();
await cp.waitForURL(/workout/);
await cp.waitForLoadState("networkidle");
await cp.getByRole("button", { name: "Complete workout" }).waitFor();
// Fill the first exercise's 3 sets (scope to its card to avoid strict-mode
// collisions with the other exercises' identically-labelled inputs).
const firstCard = cp.locator("form, main").getByRole("heading", { name: "Back Squat" });
void firstCard;
const weights = [100, 102.5, 105];
for (let i = 0; i < 3; i++) {
  await cp.getByLabel(`Set ${i + 1} weight`).first().fill(String(weights[i]));
  await cp.getByLabel(`Set ${i + 1} reps`).first().fill("5");
  await cp.getByLabel(`Set ${i + 1} weight`).first().blur();
  await cp.waitForTimeout(200);
}
await shot(cp, "24-app-workout-player");
await cp.getByRole("button", { name: "Complete workout" }).click();
await cp.waitForURL(/summary/);
await shot(cp, "25-app-session-summary");

// Check-in
await cp.goto(`${BASE}/app/check-in`);
for (const label of ["Sleep quality", "Soreness", "Energy", "Mood", "Motivation"]) {
  await cp.getByRole("group", { name: label }).getByText("4").click();
}
await shot(cp, "26-app-checkin");
await cp.getByRole("button", { name: /Submit check-in/ }).click();
await cp.waitForTimeout(500);

// Nutrition + meal
await cp.goto(`${BASE}/app/nutrition`);
await cp.getByRole("button", { name: "Log a meal" }).click();
await cp.getByLabel("What did you eat?").fill("Chicken, rice, greens");
await cp.getByLabel("Calories (optional)").fill("640");
await cp.getByLabel("Protein g (optional)").fill("52");
await cp.getByRole("button", { name: "Save meal" }).click();
await cp.waitForTimeout(500);
await cp.getByRole("button", { name: "+0.25 L" }).click();
await cp.getByRole("button", { name: "+0.25 L" }).click();
await cp.waitForTimeout(400);
await shot(cp, "27-app-nutrition");

await cp.goto(`${BASE}/app/progress`);
await shot(cp, "28-app-progress");
await cp.goto(`${BASE}/app/train`);
await shot(cp, "28b-app-train");
await cp.goto(`${BASE}/app/notifications`);
await shot(cp, "29-app-notifications");

// Messaging
await cp.goto(`${BASE}/app/messages`);
await cp.getByLabel("Message").fill("Hit a squat PR today! Felt great.");
await cp.getByRole("button", { name: "Send" }).click();
await cp.waitForTimeout(600);
await shot(cp, "30-app-messages");

// Trainer review
await tp.goto(`${BASE}/coach/clients/${clientId}`);
await shot(tp, "10-coach-client-overview");
await tp.goto(`${BASE}/coach/clients/${clientId}/workouts`);
await shot(tp, "11-coach-client-workouts");
await tp.goto(`${BASE}/coach/clients/${clientId}/check-ins`);
await shot(tp, "12-coach-client-checkins");
await tp.goto(`${BASE}/coach/clients/${clientId}/nutrition`);
await shot(tp, "13-coach-client-nutrition");
await tp.goto(`${BASE}/coach/clients/${clientId}/progress`);
await shot(tp, "14-coach-client-progress");
await tp.goto(`${BASE}/coach/messages/${clientId}`);
await tp.getByLabel("Message").fill("Huge! Let's push the top set next week.");
await tp.getByRole("button", { name: "Send" }).click();
await tp.waitForTimeout(600);
await shot(tp, "15-coach-messages");
await tp.goto(`${BASE}/coach/notifications`);
await shot(tp, "16-coach-notifications");

// Responsive audit lenses required by GOAL.md.
await tp.setViewportSize(DESKTOP_NARROW);
await tp.goto(`${BASE}/coach/clients/${clientId}`);
await shot(tp, "40-coach-overview-1280");
await tp.goto(`${BASE}/coach/programs`);
await shot(tp, "41-coach-programs-1280");
await tp.setViewportSize(DESKTOP);
await tp.goto(`${BASE}/coach/clients/${clientId}/progress`);
await shot(tp, "42-coach-progress-1440");

for (const [label, viewport] of [
  ["360", MOBILE_NARROW],
  ["390", MOBILE],
  ["430", MOBILE_WIDE],
]) {
  await cp.setViewportSize(viewport);
  await cp.goto(`${BASE}/app`);
  await shot(cp, `50-app-today-${label}`);
  await cp.goto(`${BASE}/app/nutrition`);
  await shot(cp, `51-app-nutrition-${label}`);
  await cp.goto(`${BASE}/app/progress`);
  await shot(cp, `52-app-progress-${label}`);
  await cp.goto(`${BASE}/app/messages`);
  await shot(cp, `53-app-messages-${label}`);
}

await browser.close();
writeFileSync(
  `${OUT}/audit-manifest.md`,
  [
    "# Final UI Audit Screenshot Manifest",
    "",
    `Base URL: ${BASE}`,
    `Trainer fixture: ${trainer}`,
    `Client fixture: ${client}`,
    "",
    "The run drives the real trainer/client flow against Supabase:",
    "- trainer signup, invite, and accepted client onboarding",
    "- exercise library, program build, assignment, and targets",
    "- client workout, summary, check-in, nutrition, progress, notifications, and messaging",
    "- trainer review tabs, messages, notifications, and responsive coach widths",
    "- responsive client PWA widths at 360px, 390px, and 430px",
    "",
    "Screenshots:",
    ...manifest.map((name) => `- ${name}.png`),
    "",
  ].join("\n"),
);
console.log("DONE");
