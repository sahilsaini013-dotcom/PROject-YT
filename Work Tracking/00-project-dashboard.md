# Project Dashboard

## Project

Training Hub

## Current Goal

Ship a trainer-first fitness coaching platform that combines training, nutrition, recovery, communication, progress tracking, and a deploy-ready foundation for AI-assisted coaching.

## Current Phase

v1 complete - final audit/bookkeeping PR #10 pending merge.

## Status

Green: the core coaching loop is built and verified in CI. Sprints 0-6 are merged. Final UI audit round 1 passed in CI and produced the `final-ui-audit` artifact; the release docs update in PR #10 will produce the second clean audit run before merge.

## Shipped v1 Scope

1. Trainer signup, client invitation, invite acceptance, onboarding, and role routing.
2. Exercise library, program builder, program assignment, and seeded exercises.
3. Client Today, workout player, set logging, PR detection, and celebration summary.
4. Daily check-ins, nutrition targets, meal logging, optional photos, and water tracking.
5. Trainer client review tabs and realtime coach/client messaging.
6. Progress trends, in-app/email notifications, landing polish, PWA manifest, and accessibility coverage.
7. Supabase Postgres/Auth/Storage/Realtime with RLS and negative pgTAP tests.

## Active Priorities

1. Merge PR #10 once the docs-update CI run is green and the second final audit artifact is clean.
2. Keep cloud deployment ready; complete Supabase/Vercel deployment when credentials are available.
3. Begin Phase 2 AI review inbox planning only after v1 completion report is on main.

## Next Milestone

Phase 2: AI-assisted review inbox for trainers.

Definition of ready:

- PR #10 merged.
- `Work Tracking/12-v1-completion-report.md` present on main.
- Cloud deploy credentials or a dedicated deployment decision recorded.
- Phase 2 scope and safety boundaries written before implementation.

## Key Links

- Main plan: `../Training Hub Plan.md`
- Project brain: `../Brain/README.md`
- MVP scope: `../Brain/08-mvp-scope.md`
- Screen inventory: `../Brain/09-screen-inventory.md`
- Database schema: `../Brain/10-database-schema.md`
- Brand design system: `../Brain/11-brand-design-system.md`
- Repo guide: `../CLAUDE.md`
- Backlog: `02-backlog.md`
- Sprint board: `03-sprint-board.md`
- Decision log: `04-decision-log.md`
- Release log: `07-release-log.md`
- Build ledger: `11-build-ledger.md`
- v1 completion report: `12-v1-completion-report.md`
