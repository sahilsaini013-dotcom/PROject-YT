-- Sprint 3: completing a workout. Clients log sets directly (RLS allows it),
-- but personal_records are backend-written, so this security-definer RPC
-- recomputes PRs from the logged sets, marks the session done, and returns
-- the PRs earned for the celebration screen.

-- One logged row per (session, prescribed slot, set index) so the player can
-- upsert as the client edits. Freestyle sets (null slot) stay distinct.
create unique index set_logs_slot_uniq
  on public.set_logs (session_id, program_day_exercise_id, set_index);

create function public.complete_workout_session(
  _session_id uuid,
  _session_rpe numeric default null,
  _client_notes text default null
)
returns table (
  exercise_id uuid,
  exercise_name text,
  kind pr_kind,
  value numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  _client uuid := auth.uid();
begin
  -- Ownership check: the caller must own this session.
  if not exists (
    select 1 from workout_sessions ws
    where ws.id = _session_id and ws.client_id = _client
  ) then
    raise exception 'not your session';
  end if;

  update workout_sessions
    set status = 'completed',
        completed_at = now(),
        session_rpe = _session_rpe,
        client_notes = _client_notes
    where id = _session_id;

  -- Best effort per exercise in this session: heaviest weight, and estimated
  -- 1RM via Epley (weight * (1 + reps/30)). Bodyweight/cardio sets (null
  -- weight) don't produce weight/e1rm PRs.
  return query
  with session_best as (
    select
      sl.exercise_id,
      max(sl.weight_kg) filter (where sl.weight_kg is not null) as best_weight,
      max(sl.weight_kg * (1 + sl.reps / 30.0))
        filter (where sl.weight_kg is not null and sl.reps is not null) as best_e1rm
    from set_logs sl
    where sl.session_id = _session_id
    group by sl.exercise_id
  ),
  prior as (
    select pr.exercise_id, pr.kind, max(pr.value) as prev
    from personal_records pr
    where pr.client_id = _client
    group by pr.exercise_id, pr.kind
  ),
  new_prs as (
    -- weight PRs
    select sb.exercise_id, 'weight'::pr_kind as kind, sb.best_weight as value
    from session_best sb
    left join prior p on p.exercise_id = sb.exercise_id and p.kind = 'weight'
    where sb.best_weight is not null
      and (p.prev is null or sb.best_weight > p.prev)
    union all
    -- estimated-1RM PRs
    select sb.exercise_id, 'e1rm'::pr_kind, round(sb.best_e1rm, 1)
    from session_best sb
    left join prior p on p.exercise_id = sb.exercise_id and p.kind = 'e1rm'
    where sb.best_e1rm is not null
      and (p.prev is null or sb.best_e1rm > p.prev)
  ),
  inserted as (
    insert into personal_records (client_id, exercise_id, kind, value, achieved_at)
    select _client, np.exercise_id, np.kind, np.value, now()
    from new_prs np
    returning personal_records.exercise_id, personal_records.kind,
              personal_records.value
  )
  select i.exercise_id, e.name, i.kind, i.value
  from inserted i
  join exercises e on e.id = i.exercise_id;

  -- Flag exactly one set per PR'd exercise (its heaviest) for display.
  update set_logs sl
    set is_pr = true
    where sl.id in (
      select distinct on (best.exercise_id) best.id
      from set_logs best
      join personal_records pr
        on pr.client_id = _client
       and pr.exercise_id = best.exercise_id
       and pr.kind = 'weight'
       and pr.value = best.weight_kg
      where best.session_id = _session_id
      order by best.exercise_id, best.weight_kg desc
    );
end;
$$;

revoke execute on function public.complete_workout_session(uuid, numeric, text)
  from public, anon;
grant execute on function public.complete_workout_session(uuid, numeric, text)
  to authenticated;
