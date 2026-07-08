-- Self-training (DEC-014): clients can save personal routines and run solo
-- workout sessions (quick start or from a routine) through the same player,
-- set logging, and PR pipeline as assigned work. Coach-assigned sessions are
-- unchanged and keep precedence in the UI.

-- Personal routines --------------------------------------------------------

create table public.client_routines (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.client_routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  position int not null,
  target_sets int not null default 3,
  reps_target text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_client_routines_client on public.client_routines (client_id);
create index idx_client_routine_exercises_routine
  on public.client_routine_exercises (routine_id, position);

create trigger set_updated_at before update on public.client_routines
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.client_routine_exercises
  for each row execute function public.set_updated_at();

-- Solo workout sessions ----------------------------------------------------

-- A session is either fully assigned (assignment + program day, no routine or
-- title) or solo (no assignment/day; optional routine link and title snapshot).
alter table public.workout_sessions
  alter column assignment_id drop not null,
  alter column program_day_id drop not null;

alter table public.workout_sessions
  add column routine_id uuid references public.client_routines(id) on delete set null,
  add column title text;

alter table public.workout_sessions
  add constraint workout_sessions_origin_check check (
    (
      assignment_id is not null
      and program_day_id is not null
      and routine_id is null
      and title is null
    )
    or (assignment_id is null and program_day_id is null)
  );

-- Solo sets have no program_day_exercise slot; their identity is the exercise.
create unique index set_logs_solo_slot_uniq
  on public.set_logs (session_id, exercise_id, set_index)
  where program_day_exercise_id is null;

-- RLS -----------------------------------------------------------------------

create function public.routine_client(_routine uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id from client_routines where id = _routine;
$$;

alter table public.client_routines enable row level security;
alter table public.client_routine_exercises enable row level security;

create policy "routines_client_all" on public.client_routines for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
create policy "routines_trainer_read" on public.client_routines for select
  using (public.is_linked_trainer(auth.uid(), client_id));

create policy "routine_exercises_client_all" on public.client_routine_exercises for all
  using (public.routine_client(routine_id) = auth.uid())
  with check (
    public.routine_client(routine_id) = auth.uid()
    and public.can_read_exercise(exercise_id, auth.uid())
  );
create policy "routine_exercises_trainer_read" on public.client_routine_exercises for select
  using (public.is_linked_trainer(auth.uid(), public.routine_client(routine_id)));

-- Clients may create only their own solo sessions; assigned sessions still
-- come exclusively from assign_program / trainers.
create policy "sessions_client_insert_solo" on public.workout_sessions for insert
  with check (
    client_id = auth.uid()
    and assignment_id is null
    and program_day_id is null
    and (routine_id is null or public.routine_client(routine_id) = auth.uid())
  );

-- A session's origin is immutable: clients update status/RPE/notes, never who
-- it belongs to or where it came from (closes pre-existing update latitude).
create function public.enforce_session_origin()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.client_id is distinct from old.client_id
     or new.assignment_id is distinct from old.assignment_id
     or new.program_day_id is distinct from old.program_day_id then
    raise exception 'session origin cannot be changed';
  end if;
  return new;
end;
$$;

create trigger enforce_session_origin before update on public.workout_sessions
  for each row execute function public.enforce_session_origin();

-- Solo set upsert: PostgREST upserts cannot target a partial unique index, so
-- the player saves solo sets through this security-INVOKER function (set_logs
-- RLS still applies to the caller).
create function public.save_solo_set(
  _session_id uuid,
  _exercise_id uuid,
  _set_index int,
  _weight_kg numeric default null,
  _reps int default null,
  _rpe numeric default null,
  _pain_note text default null
)
returns void
language sql
set search_path = public
as $$
  insert into set_logs (session_id, exercise_id, set_index, weight_kg, reps, rpe, pain_note)
  values (_session_id, _exercise_id, _set_index, _weight_kg, _reps, _rpe, _pain_note)
  on conflict (session_id, exercise_id, set_index)
    where program_day_exercise_id is null
  do update set
    weight_kg = excluded.weight_kg,
    reps = excluded.reps,
    rpe = excluded.rpe,
    pain_note = excluded.pain_note;
$$;

-- Grants (the init migration's blanket grants predate these objects).

grant select, insert, update, delete
  on public.client_routines, public.client_routine_exercises
  to authenticated, service_role;

revoke execute on function public.routine_client(uuid) from public;
grant execute on function public.routine_client(uuid) to authenticated, service_role;

revoke execute on function public.save_solo_set(uuid, uuid, int, numeric, int, numeric, text) from public;
grant execute on function public.save_solo_set(uuid, uuid, int, numeric, int, numeric, text) to authenticated, service_role;
