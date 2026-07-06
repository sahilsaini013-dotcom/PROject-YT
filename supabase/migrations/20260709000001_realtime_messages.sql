-- Sprint 5: 1:1 messaging over Supabase Realtime. RLS still governs which
-- rows a subscriber receives, so only thread participants get the events.
alter publication supabase_realtime add table public.messages;

-- Index for the unread-message badge (recipient side).
create index if not exists idx_messages_unread
  on public.messages (thread_id)
  where read_at is null;

-- Notify the *other* participant on each new message. Runs as the table
-- owner so it can insert a notification the recipient couldn't insert
-- themselves under RLS.
create function public.notify_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _thread message_threads%rowtype;
  _recipient uuid;
  _sender_name text;
begin
  select * into _thread from message_threads where id = new.thread_id;
  _recipient := case
    when new.sender_id = _thread.trainer_id then _thread.client_id
    else _thread.trainer_id
  end;
  select full_name into _sender_name from profiles where id = new.sender_id;

  insert into notifications (user_id, kind, title, body, link_path)
  values (
    _recipient,
    'message_received',
    'New message from ' || coalesce(_sender_name, 'your coach'),
    left(new.body, 120),
    case when _recipient = _thread.trainer_id
      then '/coach/messages' else '/app/messages' end
  );
  return new;
end;
$$;

create trigger on_message_insert
  after insert on public.messages
  for each row execute function public.notify_on_message();
