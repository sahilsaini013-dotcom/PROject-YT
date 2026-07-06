# Sprint Board

## Sprint 0: Foundation and Brand

Goal: brand and foundation exist — docs updated, brand assets generated, monorepo scaffolded, CI running, landing page shell live with hero animation.

Dates: started 2026-07-06

## To Do

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |

## In Progress

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |

## Review

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |

## Done

| ID | Task | Owner | Notes |
| --- | --- | --- | --- |
| S0-006 | Generate logo and brand assets | Claude | Logo suite, icons, 18 illustrations, 3 animated SVGs in `assets/brand/` (PR #1). |
| S0-007 | Scaffold monorepo | Claude | npm workspaces: `apps/web` (Next.js 15 + TS + Tailwind v4), `packages/shared`, `supabase/` with full 26-table migration + RLS + 100-exercise seed. |
| S0-008 | Set up CI | Claude | GitHub Actions: typecheck, lint, supabase db reset, build, Playwright e2e. |
| S0-009 | Build landing page shell | Claude | `/` with hero-loop + logo-reveal animations, brand tokens, volt CTA; `/coach` + `/app` shells; installable PWA manifest. |
| S0-D01 | Create main product plan | Codex | Saved in Project YT. |
| S0-D02 | Create project brain | Codex | Saved in Project YT/Brain. |
| S0-000 | Create tracking system | Codex | Initial tracking folder and docs. |
| S0-001 | Update planning docs for execution | Claude | Decisions DEC-007..DEC-013 logged; plan, risks, backlog, dashboard revised. |
| S0-002 | Write MVP scope doc | Claude | `Brain/08-mvp-scope.md` — v1 in/out scope. |
| S0-003 | Write screen inventory | Claude | `Brain/09-screen-inventory.md` — trainer dashboard, client PWA, landing page. |
| S0-004 | Draft database schema | Claude | `Brain/10-database-schema.md` — Postgres schema + RLS. |
| S0-005 | Write brand design system | Claude | `Brain/11-brand-design-system.md` — palette, typography, asset inventory. |

## Next Sprints

| Sprint | Slice | Proves |
| --- | --- | --- |
| 1 | Auth + roles + trainer-to-client invite (branded email) + client onboarding | Two-sided account system |
| 2 | Exercise library (seeded with generated media) + program builder + workout assignment | Trainer can program |
| 3 | Client Today view + workout player + set logging + session summary with celebration animation | Client can train — coaching loop closes read-only |
| 4 | Daily check-ins + nutrition targets + meal/water logging | Recovery + nutrition pillars live |
| 5 | Trainer review (client detail: logs, check-ins, adherence) + realtime messaging | Full coaching loop closes |
| 6 | Progress view (trends, PRs, consistency) + notifications + landing page final + polish | v1 complete per MVP scope |

Phase 2 (AI review inbox) starts only after Sprint 6.

## Sprint Notes

- Quality bar is production-lean (DEC-009): real auth and database from day one, minimal infra, every sprint ships something a real trainer could use.
- Build capacity is a solo founder working with Claude Code (DEC-007): one codebase surface at a time.
