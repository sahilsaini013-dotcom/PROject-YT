-- Sprint 6: resolve a user's auth email for sending notification emails.
-- Guarded so a caller can only look up their own email or that of a client
-- actively linked to them — never arbitrary users.
create function public.email_for_user(_user uuid)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  _email text;
begin
  if _user <> auth.uid()
     and not public.is_linked_trainer(auth.uid(), _user)
     and not public.is_linked_trainer(_user, auth.uid()) then
    raise exception 'not authorized to resolve this email';
  end if;
  select email into _email from auth.users where id = _user;
  return _email;
end;
$$;

revoke execute on function public.email_for_user(uuid) from public, anon;
grant execute on function public.email_for_user(uuid) to authenticated;
