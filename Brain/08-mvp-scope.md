# MVP Scope

## Purpose

This document is the single source of truth for what Version 1 includes and excludes. If something is not listed as IN, it is not in v1. Any change to this scope requires a decision-log entry.

## Locked Decisions (2026-07-06)

- Solo founder building with Claude Code.
- v1 is web-first: ONE Next.js app with a trainer dashboard (desktop web) and a client mobile-first PWA.
- Native iOS/Android apps are deferred until the coaching loop is proven.
- Quality bar: production-lean.
- Backend: Supabase (Postgres, Auth, Realtime, Storage, RLS).
- Brand: dark, athletic, premium, with volt-green (#C6FF00) accent.
- A public one-page landing page ships in v1.

## IN for v1

### Accounts & Access

- Trainer auth (sign up, sign in) and client invites.
- Client accepts invite, creates account, completes profile onboarding.
- Roles and access control enforced with Supabase RLS.

### Training

- Client roster with per-client profile view.
- Exercise library, seeded with ~100 exercises and generated category media.
- Simple program builder: program → weeks → days → exercises with sets, reps, target RPE, rest, and notes.
- Workout assignment to a client with a start date.
- Client Today view showing what is due.
- Workout player: set logging (weight, reps, RPE), rest timer, exercise substitution note, session summary.

### Recovery

- Daily check-in: sleep, soreness, energy, mood, motivation, optional pain note.

### Nutrition (simple)

- Trainer-set targets for calories, protein, and water.
- Client meal log via notes and photos, with optional macros.
- Water tracking.

### Communication

- 1:1 trainer-client messaging via Supabase Realtime.
- In-app and email notifications.

### Progress & Review

- Client progress view: strength trends, adherence/consistency, body metrics, PRs.
- Trainer client-review view: logs, check-ins, and adherence at a glance.

### Marketing

- Public one-page landing page.

## OUT of v1 (Deferred)

Some deferred features are still modeled in the database schema now so v1 data supports them later.

| Feature | Deferred to | Modeled in schema now? |
| --- | --- | --- |
| AI recommendation inbox | Phase 2 | Yes — ai_recommendations table |
| Wearables (Apple Health / Google Fit) | Later | No |
| Payments, packages, invoices | Phase 3 | No |
| Calendar, scheduling, session notes | Phase 2 | No |
| Meal plans, grocery lists, supplement plans | Later | No |
| Automatic progression-rules engine | Later | No |
| Push notifications (v1 is email + in-app only) | Later | No |
| Native iOS/Android apps | After coaching loop proven | n/a |
| Template marketplace | Phase 4 | No |
| Group coaching, challenges, leaderboards | Phase 4 | No |

## v1 Success Criteria

v1 succeeds when the full coaching loop works end to end:

- A trainer can invite a client.
- The trainer can build a program and assign it.
- The client completes and logs workouts, check-ins, and meals.
- The trainer reviews the client's data and adjusts the plan.
- Access control is correct throughout: clients see only their own data; trainers see only their linked clients.

## Privacy & Data Sensitivity

Training Hub stores health-adjacent data: pain notes, mood, injuries, body metrics, and progress photos. Commitments for v1:

- RLS enforces client-sees-own-data and trainer-sees-linked-clients-only.
- Progress photos live in private storage buckets, served via signed URLs.
- No health data is sent to analytics.
- A privacy policy is required before any real users.
- Data export and delete are supported (Postgres makes this tractable).
