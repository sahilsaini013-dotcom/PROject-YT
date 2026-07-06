# CLAUDE.md

Training Hub is a trainer-first coaching platform: personal trainers program, monitor, and coach clients (training, nutrition, recovery, messaging) with AI-assisted decision support later. Solo founder building with Claude Code. This repo started as planning docs and is becoming the monorepo — read the docs before writing code.

## Doc Map

- `GOAL.md` — the standing goal prompt: mission, sprint loop, verification protocol, and the executable Definition of Done for v1. If asked to "build the app", execute this file.
- `START HERE.md` — how the repo is organized.
- `Training Hub Plan.md` — big-picture product plan.
- `Brain/` — product truth. Key files:
  - `Brain/08-mvp-scope.md` — the scope gate. If a feature is not IN there, do not build it.
  - `Brain/10-database-schema.md` — schema source of truth; keep in sync with migrations.
  - `Brain/11-brand-design-system.md` — design source of truth (tokens, type, motion, asset log).
- `Work Tracking/` — operating board. In each sprint's closing PR, update `03-sprint-board.md` and `06-weekly-status.md`. Record decisions in `04-decision-log.md` — scope changes REQUIRE a decision entry.

## Stack (decided 2026-07-06 — do not relitigate)

- ONE Next.js 15 app (App Router) + TypeScript + Tailwind + shadcn/ui in `apps/web`.
- Supabase: Postgres, Auth, Realtime, Storage, RLS. Config and migrations checked in under `supabase/`.
- `packages/shared` for shared types and zod schemas.
- Deploy: Vercel (app) + Supabase cloud (backend).

Monorepo layout:

```
apps/web/          Next.js 15 app (landing + coach dashboard + client PWA)
packages/shared/   shared types, zod schemas
supabase/          config, migrations, seed data
assets/brand/      brand asset masters (until scaffold, then apps/web/public/brand/)
Brain/             product truth docs
Work Tracking/     operating board
```

## Conventions

- Routes: `/` public landing; `/coach/*` trainer dashboard, desktop-first; `/app/*` client experience, mobile-first PWA.
- Database is snake_case. Any migration change must update `Brain/10-database-schema.md` in the same PR.
- RLS invariant: clients read/write only their own data; trainers see only their linked, active clients. Every new table gets RLS policies before merge — no exceptions.
- UI uses brand tokens from `Brain/11-brand-design-system.md` as the Tailwind theme. Volt `#C6FF00` is used sparingly: primary CTA, active states, key numbers.
- Privacy: no health data in analytics events. Progress and meal photos go in private Storage buckets, served via signed URLs.

## Commands (after scaffold — app not yet scaffolded)

- `npm run dev` — start the app.
- `npm run build` — production build.
- `npm run typecheck` — TypeScript check.
- `npm run lint` — lint.
- `npm run test` — unit tests.
- `supabase start` — local Supabase; `supabase db reset` — replay migrations + seed.
- `npx playwright test` — e2e (Chromium is preinstalled in the cloud environment).

## Working Rhythm

Vertical-slice sprints — each ends with a usable increment:

- Sprint 0: scaffold monorepo, Supabase project, auth, deploy pipeline.
- Sprint 1: trainer-client invites, roster, client onboarding profile.
- Sprint 2: exercise library (seeded ~100) and program builder.
- Sprint 3: workout assignment, client Today view, workout player + set logging.
- Sprint 4: daily check-ins, nutrition targets, meal/water logging.
- Sprint 5: messaging (Realtime), in-app + email notifications.
- Sprint 6: progress views, trainer review view, landing page, v1 polish.

Work on feature branches and merge via PRs. Quality bar is production-lean: ship usable increments, keep it deployable, no premature infrastructure.
