# Database Schema (v1)

Target: Supabase (Postgres 15+, Supabase Auth, Realtime, Storage, RLS). Web-first v1.

## Conventions

- All identifiers are snake_case.
- Every table: `id uuid primary key default gen_random_uuid()` unless noted.
- Every table: `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` (kept current by a shared trigger). Not repeated in the column tables below.
- Enumerated values are Postgres enum types (e.g. `create type user_role as enum ('trainer', 'client')`).
- `profiles.id` references `auth.users(id)`; every other user reference points at `profiles`.
- Weights stored in kg, heights in cm; display units are a client preference.
- Soft data (notes, reasons) is plain `text`; structured-but-flexible data is `jsonb`.

## Enum Types

| Enum | Values |
|---|---|
| `user_role` | trainer, client |
| `relationship_status` | invited, active, paused, ended |
| `invitation_status` | pending, accepted, expired, revoked |
| `experience_level` | beginner, intermediate, advanced, athlete |
| `exercise_category` | squat, hinge, lunge, push_horizontal, push_vertical, pull_horizontal, pull_vertical, carry, core, cardio, mobility, plyometric, olympic, isolation, other |
| `media_kind` | image, video |
| `assignment_status` | active, completed, cancelled |
| `session_status` | pending, in_progress, completed, skipped |
| `pr_kind` | weight, reps, volume, e1rm |
| `photo_pose` | front, side, back, other |
| `notification_kind` | workout_assigned, workout_reminder, checkin_missed, nutrition_reminder, message_received, session_reminder, nudge_approved, pr_achieved, system |
| `ai_rec_kind` | push_harder, maintain, reduce_volume, deload, nutrition_adherence, increase_protein, increase_calories, emotional_check_in, review_technique, change_exercise, celebrate_progress, escalate |
| `ai_rec_status` | pending, approved, edited, dismissed |

## Tables

### Identity

#### profiles

One row per auth user. Role is fixed at signup.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk, references auth.users(id) on delete cascade | Same id as the auth user |
| role | user_role | not null | trainer or client |
| full_name | text | not null | |
| avatar_url | text | | Storage path or public URL |
| timezone | text | not null default 'UTC' | IANA name, drives "today" logic |

#### trainer_profiles

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk, references profiles(id) on delete cascade | 1:1 with a trainer profile |
| business_name | text | | |
| bio | text | | Coaching style, background |
| specialties | text[] | not null default '{}' | e.g. strength, fat loss, rehab |
| website_url | text | | |

#### client_profiles

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk, references profiles(id) on delete cascade | 1:1 with a client profile |
| goal | text | | Primary goal in the client's words |
| height_cm | numeric | | |
| weight_kg | numeric | | Onboarding weight; ongoing weight lives in body_metrics |
| unit_preference | text | not null default 'metric' | metric or imperial, display only |
| injuries | text | | Free text; AI treats as caution flags |
| experience_level | experience_level | | |
| schedule_notes | text | | Days/times available to train |
| equipment_notes | text | | Home gym, commercial gym, bands only, etc. |

#### trainer_clients

The coaching relationship. All trainer-side RLS checks resolve through this table.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| trainer_id | uuid | not null, references profiles(id) | |
| client_id | uuid | not null, references profiles(id) | |
| status | relationship_status | not null default 'invited' | |
| started_at | timestamptz | | When status first became active |
| ended_at | timestamptz | | |
| | | unique (trainer_id, client_id) | One relationship per pair |

#### invitations

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| trainer_id | uuid | not null, references profiles(id) | |
| email | text | not null | Invitee, may not have an account yet |
| token | text | not null, unique | Random, single-use; sent in the invite link |
| status | invitation_status | not null default 'pending' | |
| expires_at | timestamptz | not null | |
| accepted_at | timestamptz | | Set when redeemed; creates the trainer_clients row |

### Training

#### exercises

Shared library plus per-trainer custom exercises.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| name | text | not null | |
| category | exercise_category | not null | |
| equipment | text | | barbell, dumbbell, machine, bodyweight, etc. |
| instructions | text | | Cues and setup |
| is_public | boolean | not null default false | Public = seeded library, visible to all |
| owner_trainer_id | uuid | references profiles(id) | Null for public library rows |

#### exercise_media

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| exercise_id | uuid | not null, references exercises(id) on delete cascade | |
| kind | media_kind | not null | |
| storage_path | text | not null | Supabase Storage path |
| source | text | | e.g. trainer_upload, library, youtube |

#### programs

A program is the reusable template a trainer builds; assignment is separate. Saved templates and one-off programs are the same object in v1.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| trainer_id | uuid | not null, references profiles(id) | Author and owner |
| name | text | not null | |
| description | text | | |
| weeks_count | int | not null default 1 | Denormalized convenience count |

#### program_weeks

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| program_id | uuid | not null, references programs(id) on delete cascade | |
| week_index | int | not null | 1-based |
| label | text | | e.g. "Intro", "Deload" — covers phases in v1 |
| | | unique (program_id, week_index) | |

#### program_days

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| week_id | uuid | not null, references program_weeks(id) on delete cascade | |
| day_index | int | not null | 1-based within the week |
| name | text | | e.g. "Lower A", "Push" |
| | | unique (week_id, day_index) | |

#### program_day_exercises

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| day_id | uuid | not null, references program_days(id) on delete cascade | |
| exercise_id | uuid | not null, references exercises(id) | |
| position | int | not null | Order within the day |
| sets | int | not null | |
| reps_target | text | not null | Text to allow ranges: "8-12", "AMRAP", "30s" |
| rpe_target | numeric | | e.g. 7.5 |
| rest_seconds | int | | |
| notes | text | | Trainer cues for this slot |
| allows_substitution | boolean | not null default true | |

#### program_assignments

Assigning a program to a client materializes workout_sessions on a schedule.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| program_id | uuid | not null, references programs(id) | |
| client_id | uuid | not null, references profiles(id) | |
| trainer_id | uuid | not null, references profiles(id) | |
| start_date | date | not null | |
| status | assignment_status | not null default 'active' | |
| notes | text | | Assignment-level trainer notes |

#### workout_sessions

One row per scheduled workout for a client. This is the Today screen.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| assignment_id | uuid | not null, references program_assignments(id) on delete cascade | |
| client_id | uuid | not null, references profiles(id) | Denormalized for RLS and hot queries |
| program_day_id | uuid | not null, references program_days(id) | |
| scheduled_date | date | not null | |
| status | session_status | not null default 'pending' | |
| skipped_reason | text | | Free text; AI input |
| started_at | timestamptz | | |
| completed_at | timestamptz | | |
| session_rpe | numeric | | Overall session RPE from summary |
| client_notes | text | | Session summary notes |

#### set_logs

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| session_id | uuid | not null, references workout_sessions(id) on delete cascade | |
| program_day_exercise_id | uuid | references program_day_exercises(id) | Null for freestyle/extra sets |
| exercise_id | uuid | not null, references exercises(id) | The prescribed exercise |
| set_index | int | not null | 1-based within the exercise |
| weight_kg | numeric | | Null for bodyweight/cardio |
| reps | int | | |
| rpe | numeric | | |
| is_pr | boolean | not null default false | Set when a personal_records row is created |
| pain_note | text | | Flagged to trainer and AI |
| substituted_exercise_id | uuid | references exercises(id) | Set when the client swapped the movement |

#### personal_records

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| exercise_id | uuid | not null, references exercises(id) | |
| kind | pr_kind | not null | weight, reps, volume, or e1rm |
| value | numeric | not null | |
| set_log_id | uuid | references set_logs(id) | The set that earned it |
| achieved_at | timestamptz | not null default now() | |

### Nutrition

#### nutrition_targets

Trainer-set targets; new row per change so history is kept.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| trainer_id | uuid | not null, references profiles(id) | |
| calories | int | | Nullable — trainer may only set protein |
| protein_g | int | | |
| carbs_g | int | | |
| fat_g | int | | |
| water_ml | int | | |
| notes | text | | Guidance in the trainer's words |
| effective_from | date | not null | Latest row per client at a date wins |

#### meal_logs

Simple-first logging: a title and optional macros. No food database in v1.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| logged_at | timestamptz | not null default now() | |
| title | text | not null | "Chicken and rice" |
| notes | text | | |
| calories | int | | All macros nullable — photo-only logs are valid |
| protein_g | int | | |
| carbs_g | int | | |
| fat_g | int | | |

#### meal_photos

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| meal_log_id | uuid | not null, references meal_logs(id) on delete cascade | |
| storage_path | text | not null | Private bucket, see Storage below |

#### water_logs

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| logged_on | date | not null | |
| total_ml | int | not null | Running total for the day, upserted |
| | | unique (client_id, logged_on) | One row per client per day |

### Recovery

#### check_ins

Daily subjective check-in. Sleep, soreness, mood, energy, pain live here as columns rather than separate entry tables.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| checked_in_on | date | not null | |
| sleep_quality | smallint | check (between 1 and 5) | |
| sleep_hours | numeric | | Nullable — quality without hours is fine |
| soreness | smallint | check (between 1 and 5) | |
| energy | smallint | check (between 1 and 5) | |
| mood | smallint | check (between 1 and 5) | |
| motivation | smallint | check (between 1 and 5) | |
| stress | smallint | check (between 1 and 5) | Nullable |
| pain_note | text | | Nullable; escalation signal for AI |
| comment | text | | |
| | | unique (client_id, checked_in_on) | One check-in per day |

#### body_metrics

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| measured_on | date | not null | |
| weight_kg | numeric | | |
| body_fat_pct | numeric | | Nullable |
| custom | jsonb | | Nullable; e.g. {"waist_cm": 82} — avoids a measurements table in v1 |

#### progress_photos

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | |
| taken_on | date | not null | |
| storage_path | text | not null | Private bucket |
| pose | photo_pose | not null default 'other' | |

### Communication

#### message_threads

One thread per coaching pair.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| trainer_id | uuid | not null, references profiles(id) | |
| client_id | uuid | not null, references profiles(id) | |
| | | unique (trainer_id, client_id) | |

#### messages

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| thread_id | uuid | not null, references message_threads(id) on delete cascade | |
| sender_id | uuid | not null, references profiles(id) | Must be a thread participant (enforced by RLS) |
| body | text | not null | |
| read_at | timestamptz | | Read receipt for the recipient |

#### notifications

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| user_id | uuid | not null, references profiles(id) on delete cascade | |
| kind | notification_kind | not null | |
| title | text | not null | |
| body | text | | |
| link_path | text | | In-app route to the subject |
| read_at | timestamptz | | |
| emailed_at | timestamptz | | Null until the email fallback fires |

### AI (Phase 2, modeled now)

#### ai_recommendations

The AI review inbox. Written by a backend job, never by clients. Source data and status are columns here, not separate tables.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | pk | |
| client_id | uuid | not null, references profiles(id) | Who the recommendation is about |
| trainer_id | uuid | not null, references profiles(id) | Who must act on it |
| kind | ai_rec_kind | not null | |
| summary | text | not null | One-line headline for the inbox |
| reasoning | text | not null | Always show the trainer why |
| source_data | jsonb | not null default '{}' | Snapshot of signals used (sessions, check-ins, nutrition adherence) |
| confidence | numeric | check (between 0 and 1) | |
| status | ai_rec_status | not null default 'pending' | |
| trainer_action_note | text | | What the trainer did or changed |
| resolved_at | timestamptz | | Set on approve/edit/dismiss |

## Relationships and Indexes

Foreign keys are listed in the tables above. Beyond the automatic pk/unique indexes, add these hot-path indexes:

- `trainer_clients (trainer_id, status)` — trainer roster.
- `trainer_clients (client_id, status)` — RLS lookups from the client side.
- `invitations (token)` — unique already; invite redemption.
- `exercises (owner_trainer_id)` partial where not is_public — trainer's custom library.
- `program_day_exercises (day_id, position)` — day rendering.
- `workout_sessions (client_id, scheduled_date)` — Today screen and calendar views.
- `workout_sessions (assignment_id)` — assignment progress.
- `set_logs (session_id)` — session detail.
- `set_logs (exercise_id, created_at)` — exercise history and PR detection.
- `personal_records (client_id, exercise_id)` — PR lookup.
- `meal_logs (client_id, logged_at)` — nutrition day view.
- `check_ins (client_id, checked_in_on)` — unique already; recovery trends.
- `body_metrics (client_id, measured_on)` — weight chart.
- `messages (thread_id, created_at)` — chat pagination.
- `notifications (user_id, read_at)` — unread badge (partial index where read_at is null).
- `ai_recommendations (trainer_id, status)` — the AI inbox (pending first).

## Row Level Security Strategy

RLS is enabled on every table. The single invariant:

> A client can read and write only their own rows. A trainer can read (and write where coaching requires it) only rows belonging to clients linked to them through an **active** `trainer_clients` row. Nobody else sees anything.

This directly satisfies the test plan: clients cannot see other clients; trainers cannot see unassigned clients.

### The pattern (shown once, on check_ins)

```sql
-- Client: full access to their own check-ins
create policy "client_own_check_ins" on check_ins
  for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- Trainer: read-only on linked, active clients
create policy "trainer_read_client_check_ins" on check_ins
  for select
  using (
    exists (
      select 1 from trainer_clients tc
      where tc.client_id = check_ins.client_id
        and tc.trainer_id = auth.uid()
        and tc.status = 'active'
    )
  );

-- Same shape for trainer writes where coaching requires them,
-- e.g. nutrition_targets: trainer insert/update via the exists()
-- check on trainer_id = auth.uid(), client select-only.
create policy "trainer_write_nutrition_targets" on nutrition_targets
  for insert
  with check (
    trainer_id = auth.uid()
    and exists (
      select 1 from trainer_clients tc
      where tc.client_id = nutrition_targets.client_id
        and tc.trainer_id = auth.uid()
        and tc.status = 'active'
    )
  );
```

### Per-table access matrix

"Own" means rows where the user's id matches the owning column. Trainer access always requires the active-link check above.

| Table | Client access | Trainer access |
|---|---|---|
| profiles | read/update own | read own + linked clients' profiles |
| trainer_profiles | read (public info of own trainer) | read/update own |
| client_profiles | read/update own | read linked clients |
| trainer_clients | read own links; update status of own link (leave) | read/insert/update own links |
| invitations | read by token (via RPC, not direct select) | full on own |
| exercises | read public + linked trainer's | full on own; read public |
| exercise_media | follows exercises | follows exercises |
| programs / weeks / days / day_exercises | read when assigned to them | full on own programs |
| program_assignments | read own | full for own clients |
| workout_sessions | read/update own (log, complete, skip) | read + insert/update for own clients |
| set_logs | full on own sessions | read for own clients |
| personal_records | read own (insert via backend) | read for own clients |
| nutrition_targets | read own | insert/update for own clients |
| meal_logs / meal_photos | full own | read for own clients |
| water_logs | full own | read for own clients |
| check_ins | full own | read for own clients |
| body_metrics | full own | read for own clients |
| progress_photos | full own | read for own clients |
| message_threads | read own | read/insert own |
| messages | insert/read in own threads; set read_at | insert/read in own threads; set read_at |
| notifications | read/update own (mark read) | read/update own (mark read) |
| ai_recommendations | none — trainer-only surface | read/update (status, action note) for own clients; insert via backend service role |

### Storage

- Two private buckets: `progress-photos` and `meal-photos` (plus `exercise-media`, which can be public-read for library content).
- Path convention: `{client_id}/{yyyy-mm}/{uuid}.{ext}` — the first path segment is the owner's id.
- Storage RLS policies mirror the table invariant: client matches `storage.foldername(name)[1] = auth.uid()::text`; trainer access via the same `trainer_clients` exists-check.
- The app serves photos through short-lived signed URLs; nothing sensitive is publicly addressable.

## Deferred Objects

Everything from `05-data-model-notes.md` not modeled above, and how it attaches later. None of these block v1.

- **WorkoutTemplate** — folded into `programs` (a template is just an unassigned program). A `is_template` flag or marketplace visibility column can split them later.
- **ProgramPhase** — folded into `program_weeks.label` for v1. A real `program_phases` table can sit between programs and weeks later without breaking assignments.
- **Substitution** — folded into `set_logs.substituted_exercise_id`. If substitution rules/history need their own life, promote to a `substitutions` table keyed by set_log_id.
- **FoodEntry** — folded into `meal_logs` macro columns (simple-first, no food database). A `food_entries` table referencing meal_log_id plus a food database arrives if itemized logging is ever needed.
- **SleepEntry / SorenessEntry / MoodEntry / PainEntry** — folded into `check_ins` columns. Split out only if per-signal timestamps become necessary.
- **WearableSummary** — deferred (Phase 2). `wearable_summaries (client_id, day, source, metrics jsonb)`; feeds `ai_recommendations.source_data`.
- **ReadinessScore** — deferred (Phase 2). `readiness_scores (client_id, scored_on, score, inputs jsonb)`; computed by the same job that writes ai_recommendations.
- **SessionNote** — deferred (Phase 2 live coaching). `session_notes (trainer_id, client_id, workout_session_id nullable, body)`.
- **TrainerTask** — deferred (Phase 2 task queue). `trainer_tasks (trainer_id, client_id nullable, kind, status, due_on, ai_recommendation_id nullable)`.
- **CalendarEvent** — deferred (Phase 2 scheduling). `calendar_events (trainer_id, client_id, starts_at, ends_at, kind)`.
- **MealPlan / GroceryList** — deferred. `meal_plans` mirrors the programs→assignment shape for nutrition; `grocery_lists` hangs off a meal plan.
- **SupplementPlan / SupplementLog** — deferred. Same target/log shape as nutrition_targets/meal_logs, keyed by client_id.
- **WeeklySummary** — deferred (Phase 2). `weekly_summaries (client_id, week_start, body, data jsonb)`; generated alongside recommendations.
- **ClientRiskFlag** — deferred (Phase 2). Starts as `ai_recommendations` with kind = escalate; promote to its own table if flags need independent lifecycle.
- **Package / Subscription / Invoice / PaymentStatus / RevenueSummary** — deferred (Phase 3 business layer). All keyed by trainer_id (and client_id where relevant); nothing in v1 references them, so they bolt on cleanly.
