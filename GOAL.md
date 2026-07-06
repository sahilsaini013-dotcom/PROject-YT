# Training Hub — Goal Prompt

Paste everything below this line into Claude Code (or reference this file: "Read GOAL.md and execute it") to drive the app to completion.

---

## Mission

Build Training Hub — the trainer-first coaching platform specified in this repo — to a complete, working v1. Do not stop at scaffolding, mockups, or a single feature: the goal is the full coaching loop running end-to-end in a real browser against a real database. Work sprint by sprint until the v1 success criteria below all pass. Do not wait for permission between sprints; only stop for genuine scope decisions that contradict the docs.

## Read first (in this order)

1. `CLAUDE.md` — stack, conventions, working rhythm. The stack is locked: do not relitigate it.
2. `Brain/08-mvp-scope.md` — the scope gate. Everything IN gets built; nothing OUT gets built.
3. `Brain/10-database-schema.md` — schema source of truth (26 tables + RLS strategy).
4. `Brain/09-screen-inventory.md` — every screen with routes and components.
5. `Brain/11-brand-design-system.md` — tokens, typography, motion. Assets already exist in `assets/brand/` (logo suite, icons, 18 illustrations, 3 animated SVGs) — wire them in, do not regenerate.
6. `Work Tracking/03-sprint-board.md` — current sprint state.

## Locked decisions (DEC-001..013 in `Work Tracking/04-decision-log.md`)

One Next.js 15 App Router app (TypeScript, Tailwind, shadcn/ui) in `apps/web` serving `/` landing, `/coach/*` desktop-first trainer dashboard, `/app/*` mobile-first client PWA. Supabase for Postgres, Auth, Realtime, Storage, RLS; migrations checked into `supabase/`. Shared types/zod in `packages/shared`. Dark-only brand, volt #C6FF00 used sparingly. Production-lean: real auth and data from day one, no premature infra.

## Build order (one PR per sprint, merge when green)

- **Sprint 0 (finish it):** monorepo scaffold, Supabase local setup + initial migration implementing `Brain/10` exactly, brand tokens as Tailwind theme, fonts (Archivo + Inter), PWA manifest wired to `assets/brand` icons, GitHub Actions CI (typecheck, lint, build, Playwright smoke), landing page with `hero-loop.svg` + `logo-reveal.svg` and sign-up CTA.
- **Sprint 1:** Supabase auth (email/password + magic link), trainer/client roles, trainer→client invite flow with emailed token, client onboarding profile.
- **Sprint 2:** exercise library seeded (~100 exercises mapped to the 15 category illustrations), program builder (program → weeks → days → exercises with sets/reps/RPE/rest), assignment to client with start date.
- **Sprint 3:** client Today view, workout player (set logging, rest timer, substitution note), session summary with `celebration.svg`. The coaching loop closes read-only here.
- **Sprint 4:** daily check-ins, nutrition targets, meal log (notes/photos, optional macros), water tracking.
- **Sprint 5:** trainer review — client detail tabs (logs, check-ins, adherence) — and realtime 1:1 messaging. The full coaching loop closes here.
- **Sprint 6:** progress view (strength trends, PRs, consistency), in-app + email notifications, polish pass, landing page final.

## Non-negotiable quality gates (every PR)

- Every new table ships with RLS policies in the same migration. Invariant: clients access only their own rows; trainers only rows of clients linked via an active `trainer_clients` row. No exceptions, no service-role shortcuts in app code.
- Progress/meal photos go to private Storage buckets, served via signed URLs. No health data in analytics.
- `Brain/10-database-schema.md` is updated in the same PR as any migration that diverges from it.
- CI green before merge: typecheck, lint, build, Playwright e2e covering the sprint's slice (drive the real flow in Chromium, not just unit tests).
- Update `Work Tracking/03-sprint-board.md` and `06-weekly-status.md` in each sprint's closing PR. Scope changes require a `04-decision-log.md` entry.

## Definition of done (v1 ships when ALL of these pass as Playwright e2e)

1. A trainer signs up, invites a client by email; the client accepts, onboards, and lands on Today.
2. The trainer builds a program, assigns it; the client sees it on Today, completes a workout logging real sets, and gets the celebration screen.
3. The client submits a daily check-in, logs a meal with photo, and tracks water against trainer-set targets.
4. The trainer opens the client's profile and sees logs, check-ins, adherence, and progress trends; trainer and client exchange realtime messages.
5. Access control: a second client cannot read the first client's data; a second trainer cannot read an unlinked client's data (assert at the API/RLS level).
6. Notifications fire for invite, assigned workout, and new message (in-app + email).
7. Lighthouse on `/app` mobile: PWA installable, dark theme, brand fonts/tokens applied.

When all seven pass and the final PR is merged: update the dashboard and release log, mark v1 in `Work Tracking/07-release-log.md`, and report completion. Phase 2 (AI inbox) starts only after that report.
