# Cloud deploy plan — training-hub (buqplfqxyepqtwxmrsui)

State found on restore (2026-07-07):
- Legacy schema from an earlier iteration: `profiles`, `plans`, `sessions`,
  `messages`, `templates` — **all 0 rows** (verified via `list_tables` row
  counts). Storage: 0 objects. `auth.users`: 4 accounts (emails to be listed
  and preserved — auth is untouched by the schema replacement).
- Decision: nothing to preserve in `public`; replace the empty legacy schema
  with the v1 schema from `supabase/migrations/`.

Steps (execute via Supabase MCP `apply_migration`/`execute_sql` in order):

1. `pre_reset_legacy_public` — drop the five empty legacy tables + any legacy
   functions/triggers in `public` (CASCADE), so the v1 migrations apply onto a
   clean schema. Auth and storage schemas untouched.
2. Apply, as migrations (name = filename stem, exact file contents):
   - `20260706000001_init.sql`
   - `20260707000001_invitation_flow.sql`
   - `20260708000001_workout_completion.sql`
   - `20260708000002_assign_program.sql`
   - `20260709000001_realtime_messages.sql`
   - `20260710000001_email_lookup.sql`
3. Seed: run `supabase/seed.sql` via `execute_sql` (100 public exercises).
4. Verify: 26 tables, policies > 60, exercises = 100, RLS enabled everywhere;
   run `get_advisors` (security) and fix anything actionable.
5. Fetch `get_project_url` + `get_publishable_keys` → document in
   `.env.production.example` (never commit real secrets — the anon key is
   public-by-design but keep the file as documentation).
6. Auth config (dashboard, needs user or Management API): site_url = deployed
   domain, add redirect URLs, keep email confirmations OFF until custom SMTP
   is configured (invite-accept RPC requires a session right after signUp).
7. The 4 existing auth users predate the v1 schema (no profiles rows). On
   first sign-in they would hit role routing with no profile. Options:
   (a) leave them — handle_new_user only fires on INSERT, so backfill
   profiles rows for them as clients; or (b) delete stale test accounts.
   → Ask the user which; default to backfill-as-client (non-destructive).

Frontend (Vercel) — needs user credential/connector:
- Import repo, root dir `apps/web`, env vars per `.env.example`
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_SITE_URL`, SMTP vars for real email).
