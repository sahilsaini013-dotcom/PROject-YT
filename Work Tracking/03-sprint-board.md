# Sprint Board

## Current State

Training Hub v1 is complete and merged. The backend is live on Supabase cloud (`training-hub`, ref `buqplfqxyepqtwxmrsui`) — schema, seed, and RLS verified against the live API. Frontend deploy waits only on Vercel access (steps in README + `.env.production.example`).

## To Do

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |
| D1-002 | Vercel frontend deploy | Sahil + Claude | Import repo (root `apps/web`), env per `.env.production.example`, then set site/redirect URLs. |
| P2-001 | Plan Phase 2 AI review inbox | TBD | Starts after the app is deployed. |

## In Progress

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |

## Review

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |
| D1-001 | Cloud backend deploy + legacy data review | Claude | PR #12: migrations/seed applied to cloud, advisors hardening migration, live RLS smoke test clean. |
| V1-FINAL | Final UI audit and release bookkeeping | Codex | Merged (PR #10/#11): final audit artifact inspected, no release-blocking findings. |

## Done

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |
| S0-000 | Create tracking system | Codex | Initial tracking folder and docs. |
| S0-D01 | Create main product plan | Codex | Saved in Project YT. |
| S0-D02 | Create project brain | Codex | Saved in Project YT/Brain. |
| S0-001 | Update planning docs for execution | Claude | Decisions DEC-007..DEC-013 logged; plan, risks, backlog, dashboard revised. |
| S0-002 | Write MVP scope doc | Claude | `Brain/08-mvp-scope.md` - v1 in/out scope. |
| S0-003 | Write screen inventory | Claude | `Brain/09-screen-inventory.md` - trainer dashboard, client PWA, landing page. |
| S0-004 | Draft database schema | Claude | `Brain/10-database-schema.md` - Postgres schema + RLS. |
| S0-005 | Write brand design system | Claude | `Brain/11-brand-design-system.md` - palette, typography, asset inventory. |
| S0-006 | Generate logo and brand assets | Claude | Logo suite, icons, 18 illustrations, 3 animated SVGs in `assets/brand/` (PR #1). |
| S0-007 | Scaffold monorepo | Claude | npm workspaces, Next.js app, shared package, Supabase migration/seed, RLS, and brand assets (PR #3). |
| S0-008 | Set up CI | Claude | GitHub Actions: typecheck, lint, Supabase start/reset, pgTAP, build, Playwright e2e (PR #3). |
| S0-009 | Build landing page shell | Claude | `/` with hero-loop + logo-reveal animations, brand tokens, volt CTA, and installable PWA manifest (PR #3). |
| S1-001 | Auth, roles, invites, onboarding | Claude | Trainer signup, client invite, accept flow, role routing, onboarding, auth/security fixes (PR #4). |
| S2-001 | Exercise library, program builder, assignment | Claude | Seeded exercise search, full program tree editor, atomic assignment path, program RLS coverage (PR #5). |
| S3-001 | Client Today, workout player, summary | Claude/Codex | Workout logging, PR detection, session summary, persisted substitution notes (PR #6). |
| S4-001 | Recovery and nutrition logging | Claude/Codex | Check-ins, nutrition targets, meal logging/photo storage, water tracking, client tab shell (PR #7). |
| S5-001 | Trainer review and realtime messaging | Claude/Codex | Client review tabs, adherence/log views, realtime chat, messaging security review (PR #8). |
| S6-001 | Progress, notifications, email, polish | Claude/Codex | Progress trends, in-app/email notifications, Mailpit coverage, accessibility checks, landing polish (PR #9). |
| V1-DOD | Definition of Done suite | Codex | Full CI green through PR #9 and PR #10 round 1: typecheck, lint, Supabase reset, pgTAP, build, Playwright e2e, a11y, notifications, final screenshots. |

## Completed Sprint Summary

| Sprint | Slice | Proof |
| --- | --- | --- |
| 0 | Foundation and brand | PR #3, CI run 28800548944 |
| 1 | Auth + roles + trainer-to-client invite + client onboarding | PR #4, CI run 28810655121 |
| 2 | Exercise library + program builder + workout assignment | PR #5, CI run 28812834940 |
| 3 | Client Today + workout player + set logging + session summary | PR #6, CI run 28814396719 |
| 4 | Daily check-ins + nutrition targets + meal/water logging | PR #7, CI run 28815177048 |
| 5 | Trainer review + realtime messaging | PR #8, CI run 28815633691 |
| 6 | Progress trends + notifications + landing/a11y polish | PR #9, CI run 28816971407 |
| Final | Multi-screen UI audit + release bookkeeping | PR #10, CI run 28817641394 plus follow-up docs CI |

## Sprint Notes

- v1 is web-first per DEC-008: one Next.js app serves trainer dashboard and client PWA.
- Main remains deployable; cloud deploy is ready pending Supabase/Vercel credentials.
- Open draft PR #2 for Supabase MCP configuration is unrelated to v1 delivery.
