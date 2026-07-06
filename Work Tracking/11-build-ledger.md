# Build Ledger

Append-only session continuity log. Newest entries at the bottom. Format per entry:
date · sprint · completed (with SHAs) · in flight · exact next action · blockers.

---

## 2026-07-06 — Session 2 (Sprint 0)

**Sprint:** 0 — monorepo scaffold, initial migration, brand theme, PWA, CI, landing.

**Completed:**
- Merged PR #1 (docs + brand assets) into main (`e25c4fe`).
- Monorepo: npm workspaces — `apps/web` (Next.js 15.5, TS, Tailwind v4), `packages/shared` (zod enums mirroring DB + category→illustration map), root scripts (dev/build/lint/typecheck/e2e).
- `supabase/migrations/20260706000001_init.sql`: all 26 tables from Brain/10, 13 enums, updated_at triggers, hot-path indexes, `handle_new_user` signup trigger, security-definer RLS helpers, RLS enabled on every table with the full per-table access matrix, storage buckets (`progress-photos`, `meal-photos` private; `exercise-media` public) + storage policies.
- `supabase/seed.sql`: 100 public exercises across all 15 categories.
- Brand: assets copied to `apps/web/public/brand/`; Tailwind theme tokens from Brain/11 in `globals.css`; Archivo/Inter self-hosted via `next/font/local` (woff2 in `apps/web/src/fonts/`); PWA manifest (`manifest.ts`) wired to brand icons, installable shape verified by e2e.
- Landing page at `/` with `hero-loop.svg` background + `logo-reveal.svg` + feature cards using exercise illustrations; placeholder shells at `/coach` and `/app`.
- Playwright: config (chromium + mobile projects; sandbox uses preinstalled `/opt/pw-browsers/chromium`, CI installs its own), 3 passing e2e specs (landing brand, manifest installable, shells).
- CI: `.github/workflows/ci.yml` — typecheck, lint, supabase start + db reset (proves migrations replay), build, Playwright e2e.

**Environment mode (per GOAL.md secrets protocol):** local Supabase stack via Docker IS working in this sandbox — daemon must be started manually (`sudo dockerd &`) and `supabase start -x edge-runtime` (edge-runtime container cannot set rlimits in this sandbox; not needed for v1). `db reset` verified clean: 26 tables, 65 policies, 100 seeded exercises. Local keys in gitignored `apps/web/.env.local` (standard local-dev defaults, not secrets).

**Verification:** typecheck ✓, lint ✓ (0 errors), build ✓, e2e 3/3 ✓, db reset ✓, landing screenshot captured for PR.

**In flight:** Sprint 0 PR about to be opened from `claude/training-hub-setup-7f9wdy`.

**Exact next action:** open Sprint 0 PR → run /code-review (medium) → CI green → merge → start Sprint 1 (auth + invites) on a fresh branch off main.

**Blockers:** none. No cloud Supabase/Vercel credentials provided yet — not blocking; app stays deployable, deploy steps documented in README. DEFERRED: cloud deploy until credentials exist (ask outstanding in Sprint 0 PR description).

### Addendum — code review round (same session)

/code-review (medium, multi-agent) on PR #3 found and fixed before merge:
- **RLS escalation (critical):** `trainer_clients` insert now restricted to `status='invited'` + trainer role; a transition trigger makes participants immutable and blocks invited→active outside the invitation-acceptance RPC (RPC will set local flag `training_hub.invitation_acceptance` — to be built in Sprint 1).
- **Message forgery (critical):** trigger makes messages immutable except `read_at`, settable only by the recipient.
- **Signup bricking:** `handle_new_user` no longer casts raw metadata; unknown roles default to client.
- **Storage policy crash:** `storage_path_owner()` returns null for non-uuid first path segments instead of erroring the query.
- **Missing GRANTs (critical, found by new tests):** this Supabase image's default ACLs give API roles no DML on new tables and no EXECUTE on functions — the whole API would have 42501'd in prod. Explicit grants added to the migration (authenticated + service_role only; anon gets nothing).
- Playwright chromium path now applies only when the sandbox binary exists; `apps/web/.gitignore` keeps `.env.example` trackable; brand tokens defined once in `@theme`.
- **New: `supabase/tests/rls_test.sql`** — 38 pgTAP assertions: per-table stranger-read denial for all 26 tables, write denial, self-activation/repoint/forgery escalation attempts, positive control. Wired into CI (`npx supabase test db`). All pass locally.

Deferred to Sprint 1 (noted from review): invitation-acceptance security-definer RPC (`accept_invitation`) — the redemption path is intentionally absent in Sprint 0.
