-- Cloud-only, one-time: the training-hub project has auth accounts that
-- predate the v1 schema (created against the old empty 5-table schema), so
-- they have no public.profiles rows. handle_new_user only fires on INSERT,
-- so backfill them as clients (non-destructive; role can't change later by
-- design). Run AFTER the v1 migrations are applied.
insert into public.profiles (id, role, full_name, timezone)
select
  u.id,
  case when u.raw_user_meta_data ->> 'role' = 'trainer'
    then 'trainer'::user_role else 'client'::user_role end,
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data ->> 'timezone', 'UTC')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
