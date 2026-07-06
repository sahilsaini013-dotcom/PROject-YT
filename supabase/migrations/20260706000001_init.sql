-- Training Hub v1 initial schema.
-- Implements Brain/10-database-schema.md: 26 tables, enums, indexes, RLS, storage buckets.

-- ============================================================
-- Enum types
-- ============================================================

create type user_role as enum ('trainer', 'client');
create type relationship_status as enum ('invited', 'active', 'paused', 'ended');
create type invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');
create type experience_level as enum ('beginner', 'intermediate', 'advanced', 'athlete');
create type exercise_category as enum (
  'squat', 'hinge', 'lunge', 'push_horizontal', 'push_vertical',
  'pull_horizontal', 'pull_vertical', 'carry', 'core', 'cardio',
  'mobility', 'plyometric', 'olympic', 'isolation', 'other'
);
create type media_kind as enum ('image', 'video');
create type assignment_status as enum ('active', 'completed', 'cancelled');
create type session_status as enum ('pending', 'in_progress', 'completed', 'skipped');
create type pr_kind as enum ('weight', 'reps', 'volume', 'e1rm');
create type photo_pose as enum ('front', 'side', 'back', 'other');
create type notification_kind as enum (
  'workout_assigned', 'workout_reminder', 'checkin_missed', 'nutrition_reminder',
  'message_received', 'session_reminder', 'nudge_approved', 'pr_achieved', 'system'
);
create type ai_rec_kind as enum (
  'push_harder', 'maintain', 'reduce_volume', 'deload', 'nutrition_adherence',
  'increase_protein', 'increase_calories', 'emotional_check_in', 'review_technique',
  'change_exercise', 'celebrate_progress', 'escalate'
);
create type ai_rec_status as enum ('pending', 'approved', 'edited', 'dismissed');

-- ============================================================
-- Shared updated_at trigger
-- ============================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ============================================================
-- Identity
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  business_name text,
  bio text,
  specialties text[] not null default '{}',
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  goal text,
  height_cm numeric,
  weight_kg numeric,
  unit_preference text not null default 'metric',
  injuries text,
  experience_level experience_level,
  schedule_notes text,
  equipment_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainer_clients (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  client_id uuid not null references public.profiles(id),
  status relationship_status not null default 'invited',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trainer_id, client_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  email text not null,
  token text not null unique,
  status invitation_status not null default 'pending',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Training
-- ============================================================

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category exercise_category not null,
  equipment text,
  instructions text,
  is_public boolean not null default false,
  owner_trainer_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercise_media (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  kind media_kind not null,
  storage_path text not null,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  name text not null,
  description text,
  weeks_count int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.program_weeks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  week_index int not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, week_index)
);

create table public.program_days (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.program_weeks(id) on delete cascade,
  day_index int not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week_id, day_index)
);

create table public.program_day_exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.program_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  position int not null,
  sets int not null,
  reps_target text not null,
  rpe_target numeric,
  rest_seconds int,
  notes text,
  allows_substitution boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.program_assignments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id),
  client_id uuid not null references public.profiles(id),
  trainer_id uuid not null references public.profiles(id),
  start_date date not null,
  status assignment_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.program_assignments(id) on delete cascade,
  client_id uuid not null references public.profiles(id),
  program_day_id uuid not null references public.program_days(id),
  scheduled_date date not null,
  status session_status not null default 'pending',
  skipped_reason text,
  started_at timestamptz,
  completed_at timestamptz,
  session_rpe numeric,
  client_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  program_day_exercise_id uuid references public.program_day_exercises(id),
  exercise_id uuid not null references public.exercises(id),
  set_index int not null,
  weight_kg numeric,
  reps int,
  rpe numeric,
  is_pr boolean not null default false,
  pain_note text,
  substituted_exercise_id uuid references public.exercises(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.personal_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  exercise_id uuid not null references public.exercises(id),
  kind pr_kind not null,
  value numeric not null,
  set_log_id uuid references public.set_logs(id),
  achieved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Nutrition
-- ============================================================

create table public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  trainer_id uuid not null references public.profiles(id),
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  water_ml int,
  notes text,
  effective_from date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  logged_at timestamptz not null default now(),
  title text not null,
  notes text,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_photos (
  id uuid primary key default gen_random_uuid(),
  meal_log_id uuid not null references public.meal_logs(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  logged_on date not null,
  total_ml int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, logged_on)
);

-- ============================================================
-- Recovery
-- ============================================================

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  checked_in_on date not null,
  sleep_quality smallint check (sleep_quality between 1 and 5),
  sleep_hours numeric,
  soreness smallint check (soreness between 1 and 5),
  energy smallint check (energy between 1 and 5),
  mood smallint check (mood between 1 and 5),
  motivation smallint check (motivation between 1 and 5),
  stress smallint check (stress between 1 and 5),
  pain_note text,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, checked_in_on)
);

create table public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  measured_on date not null,
  weight_kg numeric,
  body_fat_pct numeric,
  custom jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  taken_on date not null,
  storage_path text not null,
  pose photo_pose not null default 'other',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Communication
-- ============================================================

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id),
  client_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trainer_id, client_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind notification_kind not null,
  title text not null,
  body text,
  link_path text,
  read_at timestamptz,
  emailed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- AI (Phase 2, modeled now)
-- ============================================================

create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  trainer_id uuid not null references public.profiles(id),
  kind ai_rec_kind not null,
  summary text not null,
  reasoning text not null,
  source_data jsonb not null default '{}',
  confidence numeric check (confidence between 0 and 1),
  status ai_rec_status not null default 'pending',
  trainer_action_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- updated_at triggers (every table)
-- ============================================================

do $$
declare
  t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'public'
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ============================================================
-- Hot-path indexes
-- ============================================================

create index idx_trainer_clients_trainer on public.trainer_clients (trainer_id, status);
create index idx_trainer_clients_client on public.trainer_clients (client_id, status);
create index idx_exercises_owner on public.exercises (owner_trainer_id) where not is_public;
create index idx_pde_day_position on public.program_day_exercises (day_id, position);
create index idx_sessions_client_date on public.workout_sessions (client_id, scheduled_date);
create index idx_sessions_assignment on public.workout_sessions (assignment_id);
create index idx_set_logs_session on public.set_logs (session_id);
create index idx_set_logs_exercise on public.set_logs (exercise_id, created_at);
create index idx_prs_client_exercise on public.personal_records (client_id, exercise_id);
create index idx_meal_logs_client on public.meal_logs (client_id, logged_at);
create index idx_body_metrics_client on public.body_metrics (client_id, measured_on);
create index idx_messages_thread on public.messages (thread_id, created_at);
create index idx_notifications_unread on public.notifications (user_id) where read_at is null;
create index idx_ai_recs_trainer_status on public.ai_recommendations (trainer_id, status);

-- ============================================================
-- New-user bootstrap: create a profile row on signup.
-- Role and name come from auth signup metadata.
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, timezone)
  values (
    new.id,
    -- Never cast raw metadata: an unexpected value would abort the auth
    -- insert and brick the signup. Unknown roles default to client.
    case when new.raw_user_meta_data ->> 'role' = 'trainer'
      then 'trainer'::user_role else 'client'::user_role end,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'timezone', 'UTC')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS helper functions (security definer so policy checks do not
-- recurse through RLS on the tables they consult)
-- ============================================================

-- True when _trainer actively coaches _client.
create function public.is_linked_trainer(_trainer uuid, _client uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from trainer_clients tc
    where tc.trainer_id = _trainer
      and tc.client_id = _client
      and tc.status = 'active'
  );
$$;

-- True when the current user has a role of trainer.
create function public.is_trainer(_user uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles p where p.id = _user and p.role = 'trainer');
$$;

-- True when _client has any assignment of _program.
create function public.client_has_assignment(_program uuid, _client uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from program_assignments pa
    where pa.program_id = _program and pa.client_id = _client
  );
$$;

-- Owning trainer of a program.
create function public.program_trainer(_program uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select trainer_id from programs where id = _program;
$$;

-- Program id reached from a week / day.
create function public.week_program(_week uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select program_id from program_weeks where id = _week;
$$;

create function public.day_program(_day uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select w.program_id
  from program_days d
  join program_weeks w on w.id = d.week_id
  where d.id = _day;
$$;

-- Owning client of a workout session / meal log / message thread.
create function public.session_client(_session uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id from workout_sessions where id = _session;
$$;

create function public.meal_log_client(_meal_log uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id from meal_logs where id = _meal_log;
$$;

create function public.is_thread_participant(_thread uuid, _user uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from message_threads t
    where t.id = _thread and (t.trainer_id = _user or t.client_id = _user)
  );
$$;

-- True when the exercise is readable by _user: public library,
-- their own custom exercise, or a custom exercise of their linked trainer.
create function public.can_read_exercise(_exercise uuid, _user uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from exercises e
    where e.id = _exercise
      and (
        e.is_public
        or e.owner_trainer_id = _user
        or public.is_linked_trainer(e.owner_trainer_id, _user)
      )
  );
$$;

-- ============================================================
-- Row-shape guards (RLS cannot restrict columns, so triggers do)
-- ============================================================

-- trainer_clients: participants are immutable, and a link may only become
-- active inside the invitation-acceptance RPC (which sets the local flag).
create function public.enforce_trainer_clients_transitions()
returns trigger
language plpgsql
as $$
begin
  if new.trainer_id is distinct from old.trainer_id
     or new.client_id is distinct from old.client_id then
    raise exception 'participants of a coaching link cannot be changed';
  end if;
  if new.status = 'active' and old.status = 'invited'
     and coalesce(current_setting('training_hub.invitation_acceptance', true), '') <> 'on' then
    raise exception 'links are activated only by accepting an invitation';
  end if;
  return new;
end;
$$;

create trigger enforce_trainer_clients_transitions
  before update on public.trainer_clients
  for each row execute function public.enforce_trainer_clients_transitions();

-- messages: immutable once sent; only the recipient may set read_at.
create function public.enforce_message_update()
returns trigger
language plpgsql
as $$
begin
  if new.thread_id is distinct from old.thread_id
     or new.sender_id is distinct from old.sender_id
     or new.body is distinct from old.body then
    raise exception 'messages are immutable; only read_at may change';
  end if;
  if new.read_at is distinct from old.read_at and auth.uid() = old.sender_id then
    raise exception 'only the recipient may set read_at';
  end if;
  return new;
end;
$$;

create trigger enforce_message_update
  before update on public.messages
  for each row execute function public.enforce_message_update();

-- Owner uuid of a storage object path ({client_id}/...), null when the
-- first segment is not a uuid — so policies filter instead of erroring.
create function public.storage_path_owner(_name text)
returns uuid
language sql
stable
as $$
  select case
    when (storage.foldername(_name))[1]
         ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then ((storage.foldername(_name))[1])::uuid
  end;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.trainer_profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.trainer_clients enable row level security;
alter table public.invitations enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_media enable row level security;
alter table public.programs enable row level security;
alter table public.program_weeks enable row level security;
alter table public.program_days enable row level security;
alter table public.program_day_exercises enable row level security;
alter table public.program_assignments enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.set_logs enable row level security;
alter table public.personal_records enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.meal_logs enable row level security;
alter table public.meal_photos enable row level security;
alter table public.water_logs enable row level security;
alter table public.check_ins enable row level security;
alter table public.body_metrics enable row level security;
alter table public.progress_photos enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_recommendations enable row level security;

-- profiles: own row, trainer reads linked clients, client reads own trainer
create policy "profiles_select" on public.profiles for select
  using (
    id = auth.uid()
    or public.is_linked_trainer(auth.uid(), id)
    or public.is_linked_trainer(id, auth.uid())
  );
create policy "profiles_insert_own" on public.profiles for insert
  with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- trainer_profiles: trainer full own; client reads own trainer's
create policy "trainer_profiles_select" on public.trainer_profiles for select
  using (id = auth.uid() or public.is_linked_trainer(id, auth.uid()));
create policy "trainer_profiles_insert_own" on public.trainer_profiles for insert
  with check (id = auth.uid());
create policy "trainer_profiles_update_own" on public.trainer_profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- client_profiles: client full own; trainer reads linked clients
create policy "client_profiles_own" on public.client_profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());
create policy "client_profiles_trainer_read" on public.client_profiles for select
  using (public.is_linked_trainer(auth.uid(), id));

-- trainer_clients: both sides read; trainer may only create *invited* links
-- (activation happens exclusively in the invitation-acceptance RPC); both
-- sides may update status, guarded by the transition trigger below.
create policy "trainer_clients_select" on public.trainer_clients for select
  using (trainer_id = auth.uid() or client_id = auth.uid());
create policy "trainer_clients_trainer_insert" on public.trainer_clients for insert
  with check (
    trainer_id = auth.uid()
    and public.is_trainer(auth.uid())
    and status = 'invited'
  );
create policy "trainer_clients_update" on public.trainer_clients for update
  using (trainer_id = auth.uid() or client_id = auth.uid())
  with check (trainer_id = auth.uid() or client_id = auth.uid());

-- invitations: trainer full on own; clients redeem via RPC, no direct select
create policy "invitations_trainer_all" on public.invitations for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- exercises: read public + own + linked trainer's; trainer writes own
create policy "exercises_select" on public.exercises for select
  using (
    is_public
    or owner_trainer_id = auth.uid()
    or public.is_linked_trainer(owner_trainer_id, auth.uid())
  );
create policy "exercises_trainer_insert" on public.exercises for insert
  with check (owner_trainer_id = auth.uid() and public.is_trainer(auth.uid()));
create policy "exercises_trainer_update" on public.exercises for update
  using (owner_trainer_id = auth.uid())
  with check (owner_trainer_id = auth.uid());
create policy "exercises_trainer_delete" on public.exercises for delete
  using (owner_trainer_id = auth.uid());

-- exercise_media: follows exercises
create policy "exercise_media_select" on public.exercise_media for select
  using (public.can_read_exercise(exercise_id, auth.uid()));
create policy "exercise_media_trainer_write" on public.exercise_media for insert
  with check (
    exists (
      select 1 from public.exercises e
      where e.id = exercise_id and e.owner_trainer_id = auth.uid()
    )
  );
create policy "exercise_media_trainer_delete" on public.exercise_media for delete
  using (
    exists (
      select 1 from public.exercises e
      where e.id = exercise_id and e.owner_trainer_id = auth.uid()
    )
  );

-- programs: trainer full own; client reads programs assigned to them
create policy "programs_trainer_all" on public.programs for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());
create policy "programs_client_read_assigned" on public.programs for select
  using (public.client_has_assignment(id, auth.uid()));

-- program_weeks / days / day_exercises: derive access from the program
create policy "program_weeks_trainer_all" on public.program_weeks for all
  using (public.program_trainer(program_id) = auth.uid())
  with check (public.program_trainer(program_id) = auth.uid());
create policy "program_weeks_client_read" on public.program_weeks for select
  using (public.client_has_assignment(program_id, auth.uid()));

create policy "program_days_trainer_all" on public.program_days for all
  using (public.program_trainer(public.week_program(week_id)) = auth.uid())
  with check (public.program_trainer(public.week_program(week_id)) = auth.uid());
create policy "program_days_client_read" on public.program_days for select
  using (public.client_has_assignment(public.week_program(week_id), auth.uid()));

create policy "program_day_exercises_trainer_all" on public.program_day_exercises for all
  using (public.program_trainer(public.day_program(day_id)) = auth.uid())
  with check (public.program_trainer(public.day_program(day_id)) = auth.uid());
create policy "program_day_exercises_client_read" on public.program_day_exercises for select
  using (public.client_has_assignment(public.day_program(day_id), auth.uid()));

-- program_assignments: trainer full for own linked clients; client reads own
create policy "assignments_trainer_select" on public.program_assignments for select
  using (trainer_id = auth.uid());
create policy "assignments_trainer_insert" on public.program_assignments for insert
  with check (
    trainer_id = auth.uid()
    and public.is_linked_trainer(auth.uid(), client_id)
    and public.program_trainer(program_id) = auth.uid()
  );
create policy "assignments_trainer_update" on public.program_assignments for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());
create policy "assignments_client_read" on public.program_assignments for select
  using (client_id = auth.uid());

-- workout_sessions: client reads/updates own; trainer reads + writes for linked clients
create policy "sessions_client_select" on public.workout_sessions for select
  using (client_id = auth.uid());
create policy "sessions_client_update" on public.workout_sessions for update
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "sessions_trainer_select" on public.workout_sessions for select
  using (public.is_linked_trainer(auth.uid(), client_id));
create policy "sessions_trainer_insert" on public.workout_sessions for insert
  with check (public.is_linked_trainer(auth.uid(), client_id));
create policy "sessions_trainer_update" on public.workout_sessions for update
  using (public.is_linked_trainer(auth.uid(), client_id))
  with check (public.is_linked_trainer(auth.uid(), client_id));

-- set_logs: client full on own sessions; trainer read-only for linked clients
create policy "set_logs_client_all" on public.set_logs for all
  using (public.session_client(session_id) = auth.uid())
  with check (public.session_client(session_id) = auth.uid());
create policy "set_logs_trainer_read" on public.set_logs for select
  using (public.is_linked_trainer(auth.uid(), public.session_client(session_id)));

-- personal_records: read own / linked; writes come from backend triggers
create policy "prs_client_read" on public.personal_records for select
  using (client_id = auth.uid());
create policy "prs_trainer_read" on public.personal_records for select
  using (public.is_linked_trainer(auth.uid(), client_id));

-- nutrition_targets: client reads own; trainer writes for linked clients
create policy "nutrition_targets_client_read" on public.nutrition_targets for select
  using (client_id = auth.uid());
create policy "nutrition_targets_trainer_select" on public.nutrition_targets for select
  using (trainer_id = auth.uid() or public.is_linked_trainer(auth.uid(), client_id));
create policy "nutrition_targets_trainer_insert" on public.nutrition_targets for insert
  with check (
    trainer_id = auth.uid()
    and public.is_linked_trainer(auth.uid(), client_id)
  );
create policy "nutrition_targets_trainer_update" on public.nutrition_targets for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- meal_logs / meal_photos: client full own; trainer read for linked clients
create policy "meal_logs_client_all" on public.meal_logs for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "meal_logs_trainer_read" on public.meal_logs for select
  using (public.is_linked_trainer(auth.uid(), client_id));

create policy "meal_photos_client_all" on public.meal_photos for all
  using (public.meal_log_client(meal_log_id) = auth.uid())
  with check (public.meal_log_client(meal_log_id) = auth.uid());
create policy "meal_photos_trainer_read" on public.meal_photos for select
  using (public.is_linked_trainer(auth.uid(), public.meal_log_client(meal_log_id)));

-- water_logs: client full own; trainer read
create policy "water_logs_client_all" on public.water_logs for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "water_logs_trainer_read" on public.water_logs for select
  using (public.is_linked_trainer(auth.uid(), client_id));

-- check_ins: client full own; trainer read
create policy "check_ins_client_all" on public.check_ins for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "check_ins_trainer_read" on public.check_ins for select
  using (public.is_linked_trainer(auth.uid(), client_id));

-- body_metrics: client full own; trainer read
create policy "body_metrics_client_all" on public.body_metrics for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "body_metrics_trainer_read" on public.body_metrics for select
  using (public.is_linked_trainer(auth.uid(), client_id));

-- progress_photos: client full own; trainer read
create policy "progress_photos_client_all" on public.progress_photos for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "progress_photos_trainer_read" on public.progress_photos for select
  using (public.is_linked_trainer(auth.uid(), client_id));

-- message_threads: both participants read; trainer creates for linked clients
create policy "threads_select" on public.message_threads for select
  using (trainer_id = auth.uid() or client_id = auth.uid());
create policy "threads_trainer_insert" on public.message_threads for insert
  with check (
    trainer_id = auth.uid()
    and public.is_linked_trainer(auth.uid(), client_id)
  );

-- messages: participants read and send in their own threads
create policy "messages_select" on public.messages for select
  using (public.is_thread_participant(thread_id, auth.uid()));
create policy "messages_insert" on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_thread_participant(thread_id, auth.uid())
  );
create policy "messages_update_read" on public.messages for update
  using (public.is_thread_participant(thread_id, auth.uid()))
  with check (public.is_thread_participant(thread_id, auth.uid()));

-- notifications: own only (mark read); inserts come from backend triggers
create policy "notifications_select_own" on public.notifications for select
  using (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ai_recommendations: trainer-only surface; inserts via backend service role
create policy "ai_recs_trainer_select" on public.ai_recommendations for select
  using (trainer_id = auth.uid());
create policy "ai_recs_trainer_update" on public.ai_recommendations for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- ============================================================
-- Grants — this image's default ACLs give new tables/functions no
-- privileges to API roles; RLS is the row filter on top of these.
-- anon gets nothing: every v1 surface requires a signed-in user.
-- ============================================================

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public
  to authenticated, service_role;
grant usage, select on all sequences in schema public
  to authenticated, service_role;
grant execute on all functions in schema public
  to authenticated, service_role;

-- ============================================================
-- Storage buckets + policies
-- Path convention: {client_id}/{yyyy-mm}/{uuid}.{ext}
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('progress-photos', 'progress-photos', false),
  ('meal-photos', 'meal-photos', false),
  ('exercise-media', 'exercise-media', true)
on conflict (id) do nothing;

create policy "progress_photos_owner_all" on storage.objects for all
  using (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "progress_photos_trainer_read" on storage.objects for select
  using (
    bucket_id = 'progress-photos'
    and public.is_linked_trainer(auth.uid(), public.storage_path_owner(name))
  );

create policy "meal_photos_owner_all" on storage.objects for all
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "meal_photos_trainer_read" on storage.objects for select
  using (
    bucket_id = 'meal-photos'
    and public.is_linked_trainer(auth.uid(), public.storage_path_owner(name))
  );

create policy "exercise_media_public_read" on storage.objects for select
  using (bucket_id = 'exercise-media');
create policy "exercise_media_trainer_write" on storage.objects for insert
  with check (bucket_id = 'exercise-media' and public.is_trainer(auth.uid()));
