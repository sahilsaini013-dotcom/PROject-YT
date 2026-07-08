# Decision Log

Use this file for decisions that affect product, architecture, brand, scope, or business model.

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| DEC-001 | 2026-07-05 | Training Hub is trainer-first. | The product is built around personal trainers managing clients, not solo users tracking workouts alone. | Accepted |
| DEC-002 | 2026-07-05 | Nutrition is a core pillar. | Training performance cannot be understood without food, water, and recovery context. | Accepted |
| DEC-003 | 2026-07-05 | AI assists the trainer instead of replacing the trainer. | Recommendations should remain controlled, explainable, and safe. | Accepted |
| DEC-004 | 2026-07-05 | Payments are Phase 2. | Business tools matter, but coaching foundation comes first. | Accepted |
| DEC-005 | 2026-07-05 | Native mobile apps are planned for iOS and Android. | The user prefers native mobile for the client/trainer app experience. | Accepted |
| DEC-006 | 2026-07-05 | Trainers also need a web dashboard. | Programming, review, and client management are easier on desktop. | Accepted |
| DEC-007 | 2026-07-06 | Build capacity is a solo founder working with Claude Code. | Scope must fit one builder; favor one codebase surface at a time. | Accepted |
| DEC-008 | 2026-07-06 | v1 is web-first: one Next.js app serving the trainer dashboard and the client experience as a mobile-first PWA. | Native iOS/Android is deferred until the coaching loop is proven with real trainers; this revises the sequencing of DEC-005, not the long-term plan. | Accepted |
| DEC-009 | 2026-07-06 | Quality bar is "production-lean". | Real auth and database from day one, minimal infra, every sprint ships something a real trainer could use; not a throwaway prototype, not enterprise setup. | Accepted |
| DEC-010 | 2026-07-06 | Backend is Supabase (managed Postgres, Auth, Realtime, Storage, RLS). | Supersedes the custom NestJS API for v1; still Postgres, so the data model carries over if we outgrow it. | Accepted |
| DEC-011 | 2026-07-06 | This repo becomes a monorepo: docs at root, code in `apps/web` (Next.js 15 + TypeScript + Tailwind + shadcn/ui), `supabase/`, `packages/shared`. | One repo keeps docs, schema, and code in sync for a solo builder. | Accepted |
| DEC-012 | 2026-07-06 | Brand direction is dark, athletic, premium: near-black surfaces, volt-green accent (#C6FF00), bold type, icon + "Training Hub" wordmark lockup. | Matches the elite/performance positioning; assets generated via Higgsfield (Recraft V4.1 vectors, Seedance 2.0 animations). | Accepted |
| DEC-013 | 2026-07-06 | v1 includes a public one-page marketing/landing page with sign-up CTA. | Built in the same Next.js app, so the product has a front door from day one. | Accepted |
| DEC-014 | 2026-07-08 | Clients can self-train: save personal routines and start quick solo workouts (Train tab), logged with the same player, rest timer, and PR pipeline as assigned work; coach-assigned sessions keep precedence on Today. Linked trainers see solo work read-only. | Refines, does not reverse, DEC-001: the product is still trainer-first, but a client without an active program (or between assignments) had nothing to do — the older app (RecoverWell) let them train solo. Answers the open question in `Brain/07-open-questions.md`. Public solo signup (a client account with no trainer at all) stays deferred — signup is still invite-only. | Accepted |
| DEC-015 | 2026-07-08 | The client app honors each client's `unit_preference` for display: weights in kg or lb, height in cm or ft/in, water in liters. The database stays canonical metric (kg/cm/ml); conversion happens only at the UI edge. Trainer views stay metric for v1. | The onboarding units selector existed but did nothing; clients expect to see their own units. Keeping the DB metric avoids migration churn and keeps trainer math consistent. | Accepted |

## Decision Template

| ID | Date | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| DEC-000 | YYYY-MM-DD | TBD | TBD | Proposed |

