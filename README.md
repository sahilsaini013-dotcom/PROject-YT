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

## Deploy (ready, pending credentials)

The app deploys as a standard Next.js + Supabase pair:

1. **Supabase cloud**: create a project, then `npx supabase link --project-ref <ref>` and `npx supabase db push` (applies `supabase/migrations/`), then run `supabase/seed.sql` once via the SQL editor or `psql`.
2. **Vercel**: import the repo, set root directory to `apps/web`, and set env vars from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY` server-side only).
3. In Supabase Auth settings, set the site URL to the deployed domain and add it to redirect URLs.

## CI

GitHub Actions (`.github/workflows/ci.yml`): typecheck → lint → `supabase start` + `db reset` (proves migrations replay) → build → Playwright e2e. CI must be green before merge.
