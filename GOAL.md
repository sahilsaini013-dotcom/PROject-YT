# Training Hub — Goal Prompt (v2)

Invocation: **"Read GOAL.md and execute it. Don't stop until the Definition of Done passes."**
This file is written to survive many sessions, context compaction, and a cold start by a fresh Claude instance. Follow it literally.

---

## Mission

Build Training Hub — the trainer-first coaching platform specified in this repo — to a complete, working v1: the full coaching loop (trainer invites → programs → client trains, eats, checks in → trainer reviews and messages) running end-to-end in a real browser against a real database, proven by the executable Definition of Done at the bottom. Scaffolding, mockups, or "mostly working" is not done. Work sprint by sprint without waiting for permission between sprints. Only stop for the two things listed in **Ask the user only for**.

## Session-start ritual (every session, before writing code)

1. Read `CLAUDE.md`, then `Work Tracking/11-build-ledger.md` (create it on first session — see Ledger below), then `Work Tracking/03-sprint-board.md`, then `git log --oneline -15` and open PR state.
2. Determine exactly where the build stands: current sprint, last green commit, any red CI, any unfinished PR. Resume from there — never restart or re-scaffold something that exists.
3. If a previous session left main red or a PR half-done, fixing that outranks new feature work.

## Ledger (session continuity)

Maintain `Work Tracking/11-build-ledger.md`, append-only. At session end — or before any risky/long operation — append: date, sprint, what was completed (with commit SHAs), what is in flight, exact next action, open blockers. Write it so a stranger could resume in five minutes. This file is the memory between sessions; keeping it current is part of the job, not optional.

## Source-of-truth docs (read once, obey always)

- `Brain/08-mvp-scope.md` — scope gate. Not IN ⇒ not built. Scope change ⇒ `04-decision-log.md` entry first.
- `Brain/10-database-schema.md` — schema truth (26 tables, RLS strategy). Migrations implement it; divergence updates the doc in the same PR.
- `Brain/09-screen-inventory.md` — all routes/screens. `Brain/11-brand-design-system.md` — tokens, type, motion; brand assets already exist in `assets/brand/` (logo suite, icons, 18 illustrations, 3 animated SVGs) — wire them in, never regenerate.
- Stack is locked by DEC-007..013: one Next.js 15 App Router app (TS, Tailwind, shadcn/ui) in `apps/web` with `/` landing, `/coach/*` desktop-first, `/app/*` mobile-first PWA; Supabase (Postgres/Auth/Realtime/Storage/RLS); `packages/shared`. Do not relitigate.

## Environment & secrets protocol

- **Local dev/e2e:** try `supabase start` (needs Docker). If Docker is unavailable (common in cloud sandboxes), fall back in order: (a) run standalone Postgres in the container (apt/nix) with migrations applied via `psql`/`supabase db push --db-url`, stubbing `auth.uid()` per test via `set_config` for RLS tests; (b) if the user has provided cloud Supabase credentials, use a dedicated dev project. Record which mode is active in the ledger.
- **CI is the equalizer:** GitHub Actions has Docker — run the full stack there (`supabase start` + Playwright). A flow may be hard to run locally; it must still be proven in CI.
- **Secrets:** never commit keys. `.env*` stays gitignored; ship `.env.example` with every variable named and explained. If cloud credentials/deploy are wanted, ask the user once, precisely (which keys, where to put them), then continue building everything that doesn't need them while waiting.
- **Deploy:** if Vercel + Supabase cloud credentials exist, deploy each merged sprint. If not, keep the app fully deployable, document the exact deploy steps in `README`, and note "ready to deploy" in the ledger — do not block v1 on missing accounts.

## Sprint loop (repeat until done)

For each sprint: branch → build the slice → verify (below) → self-review → PR → CI green → merge → update boards + ledger → next sprint. One PR per sprint (split only if a PR exceeds ~2k changed lines).

| # | Slice | Exit criteria (all must pass before merge) |
|---|---|---|
| 0 | Scaffold: monorepo, initial migration implementing `Brain/10` exactly (all tables + RLS + seed: ~100 exercises mapped to the 15 category illustrations), Tailwind brand theme + Archivo/Inter, PWA manifest wired to brand icons, CI (typecheck/lint/build/Playwright), landing page using `hero-loop.svg` + `logo-reveal.svg` | `npm run dev` serves landing with brand + animations; `db reset` replays clean; CI green on a trivial e2e; Lighthouse: installable PWA |
| 1 | Auth (email/password + magic link), roles, trainer→client invite with emailed token, client onboarding | e2e: trainer signs up → invites → client accepts → onboards → lands on Today; invite tokens expire; role routing enforced |
| 2 | Exercise library, program builder (program→weeks→days→exercises: sets/reps/RPE/rest/notes), assignment with start date | e2e: trainer builds a 2-week program from seeded exercises and assigns it; RLS: another trainer cannot read it |
| 3 | Client Today view, workout player (set logging, rest timer, substitution note), session summary with `celebration.svg` | e2e: client completes an assigned workout logging real sets; data lands in `set_logs`; PRs detected; loop closes read-only |
| 4 | Daily check-ins, nutrition targets, meal log (notes/photo, optional macros), water tracking | e2e: client checks in, logs meal with photo (private bucket, signed URL), tracks water vs target; one check-in per day enforced |
| 5 | Trainer review (client tabs: overview/workouts/check-ins/nutrition/progress) + Realtime 1:1 messaging | e2e: trainer sees the client's real logged data and adherence; two browser contexts exchange messages live |
| 6 | Progress view (strength trends, PRs, consistency), in-app + email notifications, polish, landing final | Full Definition of Done suite passes; Lighthouse a11y ≥ 90 on `/app` and `/coach` |

## Verification protocol (every sprint — non-negotiable)

- Drive the real flow in a real browser (Playwright/Chromium, preinstalled), not just unit tests. Capture screenshots of the working flow and attach them to the PR description.
- RLS is tested negatively: for each new table, at least one test proving the wrong user CANNOT read/write. Never weaken a policy or use the service role in app code to make a test pass — that is failing with extra steps.
- Run `/code-review` (medium) on every sprint PR and fix real findings before merge. Additionally run `/security-review` after Sprint 1 (auth) and Sprint 5 (messaging/storage).
- CI must be green before merge. Flaky test → fix or quarantine with a ledger note, never delete.

## Working style

- Parallelize with subagents where units are independent (seed-data authoring, UI components, e2e specs, docs updates). Keep migrations/schema single-threaded — one writer, always.
- Match the brand: dark-only, tokens from `Brain/11`, volt scarce, tabular numerals for logged data. Screens should look like the premium product the docs describe, not a wireframe.
- Commit early and often with clear messages; push at every stable point (sandboxes are ephemeral). Keep main deployable at all times.

## No-halt protocol (the build never stops)

A "stop" is never an end state. On any blocker, walk this ladder in order:

1. **Self-resolve in the sandbox** — up to 3 genuinely different attempts (different approach each time, not retries).
2. **Self-resolve through the user's Google Chrome connector** — if a browser/Chrome connector tool is available in the session (search for it with ToolSearch before assuming it isn't), use it to figure the blocker out yourself: read docs and dashboards, complete signups or project creation (e.g. Supabase project, Vercel link), retrieve non-secret configuration, verify external state. Treat the user's logged-in browser with care: least-privilege actions only, nothing destructive, no purchases, never exfiltrate credentials into the repo or logs — copy secrets only into gitignored `.env` files, and record in the ledger *what* was obtained, never the values.
3. **Defer and reroute** — if the ladder fails: log the blocker in `Work Tracking/05-risk-log.md` (what failed, why, evidence), append a `DEFERRED:` item to the ledger with exactly what would unblock it, then immediately pull the next unblocked work forward — later sprint tasks, tests, seed data, UI polish, docs. The session keeps producing regardless.
4. **Circle back** — every session-start ritual re-checks `DEFERRED:` items; before v1 ships, all of them must be resolved or explicitly descoped via a decision-log entry.

Questions for the user follow the same rule: ask **asynchronously** (in the ledger, PR description, or a message) and keep building everything that doesn't depend on the answer. Never idle waiting for a reply.

## Final phase — multi-agent UI audit (mandatory before declaring v1 done)

After the Definition of Done suite passes, run an adversarial audit-and-fix loop. This is part of the goal, not optional polish:

1. **Fan out parallel audit agents**, each driving the real running app in Chromium with screenshots, one lens per agent: (a) visual/brand consistency vs `Brain/11` (tokens, volt scarcity, typography, spacing); (b) responsive behavior — `/app` at 360/390/430px widths, `/coach` at 1280/1440+; (c) accessibility — contrast, focus order, labels, keyboard nav, a11y ≥ 90; (d) flow friction — every screen in `Brain/09` walked end-to-end, dead ends and confusing states; (e) empty/error/loading states — new-account experience, offline PWA, failed requests; (f) data correctness — logged numbers rendering right (units, tabular alignment, trends).
2. **Verify findings** — dedupe, then confirm each finding is real (reproduce it) before fixing; discard speculation.
3. **Fix and re-audit** — apply fixes, re-run the affected lenses. Loop until two consecutive audit rounds surface nothing new (loop-until-dry). Log each round's findings and fixes in the ledger.
4. Only then write the v1 completion report.

## Definition of Done (v1 ships when ALL pass as Playwright e2e in CI)

1. Trainer signs up, invites a client by email; client accepts, onboards, lands on Today.
2. Trainer builds and assigns a program; client sees it on Today, completes a workout logging real sets, gets the celebration screen.
3. Client submits a daily check-in, logs a meal with photo, tracks water against trainer-set targets.
4. Trainer opens the client profile and sees logs, check-ins, adherence, and progress trends; trainer and client exchange Realtime messages.
5. Access control proven negatively: a second client cannot read the first client's data; an unlinked trainer cannot read the client's data (asserted at RLS level).
6. Notifications fire for invite, assigned workout, and new message (in-app + email; email may be a captured test transport).
7. `/app` is an installable dark-theme PWA with brand tokens and fonts applied; a11y ≥ 90.

On completion: run the **Final phase — multi-agent UI audit** above until dry, then update `07-release-log.md` (v1 entry), dashboard, sprint board, and ledger; write the final report with links to the merged PRs, passing CI runs, and the audit rounds. Phase 2 (AI review inbox) begins only after that report.
