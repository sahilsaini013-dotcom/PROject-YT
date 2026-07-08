# Weekly Status

## Week of 2026-07-08 (Post-v1: self-training + units)

### Overall Status

Green. v1 is deployed and live; this is the first post-launch feature slice.

### Completed

- Client **self-training** (DEC-014): new Train tab where any client saves personal routines and starts quick solo workouts, logged through the same player/rest-timer/PR pipeline as assigned work. Coach-assigned sessions keep precedence on Today; linked trainers see solo work read-only. New tables `client_routines` / `client_routine_exercises`, nullable session origin + `routine_id`/`title`, `enforce_session_origin` guard, `save_solo_set` RPC, extracted shared `ExercisePicker`.
- Client **unit preferences** (DEC-015): onboarding units toggle moved to the top and made functional — kg/lb and ft/in on input, weights rendered per preference in the player, summary, and progress; water shown in liters (client + coach). DB stays canonical metric.
- Tests: pgTAP 61 assertions (routine isolation, solo-session insert/forge, origin-immutability, trainer visibility, solo-set dedupe); new `e2e/self-training.spec.ts` (imperial onboarding → quick start → add exercise → log in lb → complete → routine start); nutrition water assertions updated to liters.

### Next

- Merge the PR (CI green), apply the migration to the cloud project, redeploy Vercel, and smoke-test the live app.

### Risks

- None blocking. Cloud migration apply + Vercel redeploy need the running Supabase MCP and a fresh Vercel token / git integration.

### Decisions Needed

- None.

## Week of 2026-07-06 (Sprint 0)

### Overall Status

Green.

### Completed

- Merged execution kickoff PR #1: decisions DEC-007..013, blueprint docs (MVP scope, screens, schema, brand system), full brand asset suite.
- Sprint 0 built: monorepo (Next.js 15 `apps/web`, `packages/shared`, `supabase/`), initial migration implementing all 26 tables with RLS + storage buckets, 100-exercise seed, brand Tailwind theme with self-hosted Archivo/Inter, installable PWA manifest, landing page with brand animations, Playwright e2e, GitHub Actions CI.

### In Progress

- Sprint 0 PR (scaffold) heading to review/merge.

### Next

- Sprint 1: auth (email/password + magic link), roles, trainer→client invite with emailed token, client onboarding.

### Risks

- No cloud Supabase/Vercel credentials yet — local + CI stacks cover development; deploy deferred without blocking v1.

### Decisions Needed

- None blocking. Cloud credentials wanted eventually (see Sprint 0 PR).

## Week of 2026-07-05

### Overall Status

Green.

### Completed

- Created Training Hub product plan.
- Added Nutrition Hub as a core product pillar.
- Created project brain.
- Created work tracking system.

### In Progress

- Defining the first buildable version of Training Hub.
- Turning product direction into concrete requirements and backlog.

### Next

- Finalize MVP scope.
- Create screen inventory.
- Draft user journeys.
- Draft technical architecture.
- Prepare Sprint 1.

### Risks

- Scope is broad and should be controlled before implementation starts.
- Native iOS, native Android, web dashboard, backend, AI, and nutrition together create a large build surface.

### Decisions Needed

- Should nutrition logging start simple/photo-based or macro-detailed?
- Should trainer web dashboard be built before mobile trainer app?
- Should the first implementation be production-grade or prototype-first?

