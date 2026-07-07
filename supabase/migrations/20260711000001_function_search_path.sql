-- Pin search_path on the remaining trigger/helper functions so they cannot
-- be affected by search_path hijacking (Supabase linter 0011). All of them
-- reference only public objects or schema-qualified names, so this is a
-- no-op behaviorally.
alter function public.set_updated_at() set search_path = public;
alter function public.enforce_trainer_clients_transitions() set search_path = public;
alter function public.enforce_message_update() set search_path = public;
alter function public.enforce_profile_role_immutable() set search_path = public;
alter function public.storage_path_owner(text) set search_path = public;
