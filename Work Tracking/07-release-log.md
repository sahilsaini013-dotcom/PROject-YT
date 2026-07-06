# Release Log

## v1.0.0 - Training Hub MVP

Date: 2026-07-06

### Added

- Trainer-first coaching loop from invite to review: trainer signup, client invite, invite acceptance, onboarding, program build, assignment, workout logging, check-ins, nutrition logging, progress views, notifications, and realtime messaging.
- Supabase-backed app foundation: Auth, Postgres schema, RLS policies, Storage buckets, Realtime messages, seed exercises, and pgTAP negative access-control tests.
- Client PWA surfaces under `/app`: Today, workout player, session summary, daily check-in, nutrition, progress, notifications, and coach messaging.
- Coach dashboard surfaces under `/coach`: roster, exercise library, program builder, client review tabs, nutrition targets, notifications, and messaging.
- Brand system and assets: dark athletic theme, Training Hub logo suite, exercise illustrations, empty states, PWA icons, and landing page animation assets.
- CI Definition of Done: typecheck, lint, Supabase start/reset, pgTAP RLS tests, build, Playwright e2e, axe accessibility checks, Mailpit email assertions, and final UI audit screenshot artifact.

### Changed

- Moved the project from planning and Sprint 0 execution into a complete v1 MVP.
- Documented deploy readiness in `README.md`; cloud Supabase/Vercel deployment remains pending credentials, not product implementation.

### Fixed

- Hardened early RLS, storage, invite, auth, and messaging security findings found during sprint reviews.
- Persisted workout substitution notes to `set_logs.pain_note` instead of keeping them local to the workout player.
- Allowed bidirectional linked trainer/client email lookup for message notifications while preserving relationship checks.
- Escaped user-controlled email content before HTML rendering.
- Added CI SMTP/Mailpit configuration so email notification coverage is exercised in CI.

### Verification

- Sprint 0 PR #3 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28800548944
- Sprint 1 PR #4 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28810655121
- Sprint 2 PR #5 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28812834940
- Sprint 3 PR #6 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28814396719
- Sprint 4 PR #7 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28815177048
- Sprint 5 PR #8 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28815633691
- Sprint 6 PR #9 CI: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28816971407
- Final audit PR #10 CI round 1: https://github.com/sahilsaini013-dotcom/PROject-YT/actions/runs/28817641394

### Notes

- Open draft PR #2 for Supabase MCP setup is unrelated to v1 product delivery and remains intentionally unmerged.
- Phase 2 AI review inbox should start only after PR #10 merges and the v1 completion report is on main.

## Unreleased

### Added

- None.

### Changed

- None.

### Fixed

- None.

## Release Template

### Version

Date:

### Added

- TBD

### Changed

- TBD

### Fixed

- TBD

### Notes

- TBD
