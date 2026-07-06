import { chromium } from "@playwright/test";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const run = Date.now();

// trainer invites
const tctx = await browser.newContext();
const tp = await tctx.newPage();
await tp.goto("http://127.0.0.1:3000/auth/sign-up");
await tp.getByLabel("Full name").fill("Debug Trainer");
await tp.getByLabel("Email").fill(`dbgt.${run}@e2e.local`);
await tp.getByLabel("Password").fill("training-hub-e2e");
await tp.getByRole("button", { name: "Start coaching" }).click();
await tp.waitForURL(/coach/);
await tp.getByLabel("Invite a client by email").fill(`dbgc.${run}@e2e.local`);
await tp.getByRole("button", { name: "Send invite" }).click();
const link = await tp.getByTestId("invite-link").textContent();
console.log("invite link ok:", link.includes("/auth/invite/"));

// client accepts
const cctx = await browser.newContext();
const cp = await cctx.newPage();
cp.on("console", m => { if (m.type() === "error") console.log("PAGE ERR:", m.text().slice(0,200)); });
await cp.goto(link);
await cp.getByLabel("Full name").fill("Debug Client");
await cp.getByLabel("Choose a password").fill("training-hub-e2e");
await cp.getByRole("button", { name: "Join Training Hub" }).click();
await cp.waitForURL(/onboarding/, { timeout: 15000 }).catch(() => console.log("no onboarding redirect, url:", cp.url()));
console.log("after accept URL:", cp.url());
console.log("client cookies:", (await cctx.cookies()).map(c => `${c.name}[${c.value.length}]`).join(", "));

await cp.goto("http://127.0.0.1:3000/coach");
console.log("client goto /coach →", cp.url());
await cp.goto("http://127.0.0.1:3000/app");
console.log("client goto /app →", cp.url());

await browser.close();
