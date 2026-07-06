-- Sprint 3 (also fixes a Sprint 2 review finding): assignment is atomic.
-- Materializing the assignment + its sessions + the notification in one
-- transaction avoids orphan assignments, and the pre-check avoids silently
-- assigning the same active program to the same client twice.

create function public.assign_program(
  _program_id uuid,
  _client_id uuid,
  _start_date date,
  _notes text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  _trainer uuid := auth.uid();
  _assignment_id uuid;
  _count integer;
begin
  if _trainer is null or not public.is_trainer(_trainer) then
    raise exception 'only trainers can assign programs';
  end if;
  if public.program_trainer(_program_id) <> _trainer then
    raise exception 'not your program';
  end if;
  if not public.is_linked_trainer(_trainer, _client_id) then
    raise exception 'client is not on your active roster';
  end if;
  if exists (
    select 1 from program_assignments
    where program_id = _program_id and client_id = _client_id and status = 'active'
  ) then
    raise exception 'this program is already assigned to that client';
  end if;

  insert into program_assignments (program_id, client_id, trainer_id, start_date, notes)
  values (_program_id, _client_id, _trainer, _start_date, _notes)
  returning id into _assignment_id;

  insert into workout_sessions (assignment_id, client_id, program_day_id, scheduled_date)
  select _assignment_id, _client_id, d.id,
         _start_date + ((w.week_index - 1) * 7 + (d.day_index - 1))
  from program_weeks w
  join program_days d on d.week_id = w.id
  where w.program_id = _program_id;

  get diagnostics _count = row_count;
  if _count = 0 then
    raise exception 'add at least one day before assigning';
  end if;

  insert into notifications (user_id, kind, title, body, link_path)
  values (_client_id, 'workout_assigned', 'New program assigned',
          'Your coach assigned you a new training program.', '/app');

  return _count;
end;
$$;

revoke execute on function public.assign_program(uuid, uuid, date, text)
  from public, anon;
grant execute on function public.assign_program(uuid, uuid, date, text)
  to authenticated;
