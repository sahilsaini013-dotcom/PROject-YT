# Backlog

## Priority Key

- P0: required for the first build.
- P1: important for the first complete version.
- P2: useful after the core loop works.
- P3: future growth.

## Product Requirements

| ID | Priority | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| PRD-001 | P0 | Write MVP product requirements | Done | Claude | Delivered by `Brain/08-mvp-scope.md`. |
| PRD-002 | P0 | Define trainer dashboard screen list | Done | Claude | Delivered by `Brain/09-screen-inventory.md`. |
| PRD-003 | P0 | Define client mobile screen list | Done | Claude | Delivered by `Brain/09-screen-inventory.md` (client PWA). |
| PRD-004 | P0 | Define first user journeys | Done | Claude | Covered in `Brain/08-mvp-scope.md` and `Brain/09-screen-inventory.md`. |
| PRD-005 | P1 | Define business tools requirements | Not started | TBD | Phase 2 payments and packages. |

## Design

| ID | Priority | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| DES-001 | P0 | Establish visual direction | Done | Claude | Dark, athletic, premium with volt accent (DEC-012); see `Brain/11-brand-design-system.md`. |
| DES-002 | P0 | Create trainer dashboard wireframes | Not started | TBD | Desktop-first. |
| DES-003 | P0 | Create client mobile wireframes | Not started | TBD | Native mobile experience. |
| DES-004 | P1 | Create design system tokens | In progress | Claude | Tokens defined in `Brain/11-brand-design-system.md`; implemented at scaffold time. |
| DES-005 | P1 | Prototype core workflow | Not started | TBD | Trainer invite to AI review. |

## Engineering

| ID | Priority | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| ENG-001 | P0 | Choose technical architecture | Done | Claude | Web-first Next.js + Supabase monorepo (DEC-008, DEC-010, DEC-011). |
| ENG-002 | P0 | Define repo structure | Done | Claude | Monorepo layout decided: docs at root, `apps/web`, `supabase/`, `packages/shared`; see `CLAUDE.md`. |
| ENG-003 | P0 | Draft database schema | Done | Claude | Delivered by `Brain/10-database-schema.md` (Postgres schema + RLS). |
| ENG-004 | P0 | Define auth and access control | Not started | TBD | Trainer/client roles and relationships. |
| ENG-005 | P1 | Define notification strategy | Not started | TBD | Push, email, reminders. |
| ENG-006 | P1 | Define wearable integration strategy | Not started | TBD | Apple Health and Google Fit summaries. |

## AI

| ID | Priority | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| AI-001 | P0 | Define recommendation types | Not started | TBD | Push, maintain, deload, nutrition, check-in. Schema modeled in `Brain/10-database-schema.md`. |
| AI-002 | P0 | Define AI source data | Not started | TBD | Workouts, nutrition, recovery, notes, wearables. Schema modeled in `Brain/10-database-schema.md`. |
| AI-003 | P0 | Define trainer approval workflow | Not started | TBD | Approve, edit, dismiss. Schema modeled in `Brain/10-database-schema.md`. |
| AI-004 | P1 | Define AI safety guardrails | Not started | TBD | No medical diagnosis, no shame, no auto-sensitive feedback. |
| AI-005 | P1 | Create example AI outputs | Not started | TBD | Useful for design and testing. |

## Operations

| ID | Priority | Item | Status | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| OPS-001 | P0 | Set up weekly status rhythm | Not started | TBD | Use `06-weekly-status.md`. |
| OPS-002 | P0 | Track decisions | In progress | TBD | Use `04-decision-log.md`. |
| OPS-003 | P0 | Track risks | In progress | TBD | Use `05-risk-log.md`. |

