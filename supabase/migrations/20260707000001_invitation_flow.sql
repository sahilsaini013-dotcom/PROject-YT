-- Sprint 1: invitation lifecycle RPCs.
-- Invitations are never selected by token directly (RLS denies it);
-- these security-definer functions are the only redemption path.

-- Trainer creates an invitation; token is generated server-side.
create function public.create_invitation(_email text)
returns table (invitation_id uuid, token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions  -- extensions: gen_random_bytes (pgcrypto)
as $$
declare
  _trainer uuid := auth.uid();
  _token text := encode(gen_random_bytes(24), 'hex');
  _expires timestamptz := now() + interval '7 days';
  _id uuid;
begin
  if _trainer is null or not public.is_trainer(_trainer) then
    raise exception 'only trainers can invite clients';
  end if;
  if _email is null or _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email address';
  end if;

  -- Re-inviting the same email supersedes any previous pending invite.
  update invitations
    set status = 'revoked'
    where trainer_id = _trainer and email = lower(_email) and status = 'pending';

  insert into invitations (trainer_id, email, token, status, expires_at)
  values (_trainer, lower(_email), _token, 'pending', _expires)
  returning id into _id;

  return query select _id, _token, _expires;
end;
$$;

-- Public lookup for the accept page: reveals only what the invitee needs.
-- Expired-but-pending invites are reported (and marked) expired.
create function public.get_invitation(_token text)
returns table (email text, trainer_name text, status invitation_status)
language plpgsql
security definer
set search_path = public
as $$
begin
  update invitations i
    set status = 'expired'
    where i.token = _token and i.status = 'pending' and i.expires_at <= now();

  return query
    select i.email, p.full_name, i.status
    from invitations i
    join profiles p on p.id = i.trainer_id
    where i.token = _token;
end;
$$;

-- Called by the signed-in invitee after account creation. Validates the
-- token, requires the caller's auth email to match the invited email,
-- then activates the coaching link and opens the message thread.
create function public.accept_invitation(_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _caller uuid := auth.uid();
  _caller_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  _inv invitations%rowtype;
  _link_id uuid;
begin
  if _caller is null then
    raise exception 'sign in before accepting an invitation';
  end if;

  select * into _inv from invitations where token = _token for update;
  if not found then
    raise exception 'invitation not found';
  end if;
  if _inv.status = 'pending' and _inv.expires_at <= now() then
    update invitations set status = 'expired' where id = _inv.id;
    raise exception 'invitation has expired';
  end if;
  if _inv.status <> 'pending' then
    raise exception 'invitation is no longer valid';
  end if;
  if lower(_inv.email) <> _caller_email then
    raise exception 'this invitation was sent to a different email address';
  end if;
  if _inv.trainer_id = _caller then
    raise exception 'trainers cannot accept their own invitations';
  end if;

  update invitations
    set status = 'accepted', accepted_at = now()
    where id = _inv.id;

  -- Authorize invited→active for the transition trigger.
  perform set_config('training_hub.invitation_acceptance', 'on', true);

  insert into trainer_clients (trainer_id, client_id, status, started_at)
  values (_inv.trainer_id, _caller, 'active', now())
  on conflict (trainer_id, client_id)
  do update set status = 'active', started_at = coalesce(trainer_clients.started_at, now()), ended_at = null
  returning id into _link_id;

  insert into message_threads (trainer_id, client_id)
  values (_inv.trainer_id, _caller)
  on conflict (trainer_id, client_id) do nothing;

  insert into notifications (user_id, kind, title, body, link_path)
  values (
    _inv.trainer_id,
    'system',
    'Invitation accepted',
    (select full_name from profiles where id = _caller) || ' joined your roster.',
    '/coach'
  );

  return _link_id;
end;
$$;

-- Lock down execution: definer functions are the only entry points.
revoke execute on function public.create_invitation(text) from public, anon;
revoke execute on function public.accept_invitation(text) from public, anon;
revoke execute on function public.get_invitation(text) from public;
grant execute on function public.create_invitation(text) to authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
grant execute on function public.get_invitation(text) to anon, authenticated;
