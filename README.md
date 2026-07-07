# Training Hub

Trainer-first coaching platform: programs, workout logging, check-ins, nutrition, and messaging between coaches and clients. Dark, athletic, premium — see `Brain/11-brand-design-system.md`.

## Layout

```
apps/web/          Next.js 15 app — / landing, /coach/* trainer dashboard, /app/* client PWA
packages/shared/   shared types + zod schemas
supabase/          config, migrations, seed
assets/brand/      brand asset masters
Brain/             product truth docs
Work Tracking/     operating board + build ledger
```

## Local development

Prereqs: Node 22+, Docker.

```bash
npm install
npx supabase start -x edge-runtime   # local Postgres/Auth/Realtime/Storage; prints keys
cp .env.example apps/web/.env.local  # paste the printed ANON_KEY
npm run dev                          # http://localhost:3000
```

Useful:

```bash
npx supabase db reset   # replay migrations + seed from scratch
npm run typecheck
npm run lint
npm run build
npx playwright test     # e2e (starts the app itself)
```

## Deploy

**Live:** https://training-hub-lyart.vercel.app (Vercel project `training-hub`,
root `apps/web`) backed by the `training-hub` Supabase cloud project (ref
`buqplfqxyepqtwxmrsui`). Deployed 2026-07-07; the steps below reproduce it.
The exact backend push sequence lives in `scripts/cloud-deploy-plan.md`;
one-time cloud fixups live in `supabase/cloud/`.

1. **Supabase cloud**: `npx supabase link --project-ref buqplfqxyepqtwxmrsui`
   then `npx supabase db push` (applies `supabase/migrations/`), run
   `supabase/seed.sql` once, then `supabase/cloud/01_backfill_legacy_auth_profiles.sql`
   (profiles for auth accounts that predate the v1 schema).
2. **Vercel**: import the repo, set root directory to `apps/web`, and set the
   env vars documented in `.env.production.example`.
3. In Supabase Auth settings: site URL = the deployed domain, add it to the
   redirect URLs, and keep email confirmations OFF until custom SMTP exists
   (the invite-accept flow needs a session immediately after signup).

## CI

GitHub Actions (`.github/workflows/ci.yml`): typecheck → lint → `supabase start` + `db reset` (proves migrations replay) → build → Playwright e2e. CI must be green before merge.
