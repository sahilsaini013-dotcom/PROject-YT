-- Negative RLS tests: for every table, the wrong user must see nothing
-- and the core escalation paths must fail. Run with `npx supabase test db`.

begin;
create extension if not exists pgtap with schema extensions;

-- ============================================================
-- Fixtures (as postgres, bypassing RLS)
-- ============================================================

-- Four users: trainer1 coaches client1 (active). trainer2 and client2 are
-- strangers who must see none of pair 1's data.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'trainer1@test.local', crypt('pw', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"trainer","full_name":"Trainer One"}'),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'client1@test.local',  crypt('pw', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"client","full_name":"Client One"}'),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'trainer2@test.local', crypt('pw', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"trainer","full_name":"Trainer Two"}'),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'client2@test.local',  crypt('pw', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"client","full_name":"Client Two"}');

-- trainer/client sub-profiles
insert into public.trainer_profiles (id, business_name) values ('11111111-1111-1111-1111-111111111111', 'T1 Coaching');
insert into public.client_profiles (id, goal) values ('22222222-2222-2222-2222-222222222222', 'Get strong');

-- the active coaching link (pair 1)
insert into public.trainer_clients (id, trainer_id, client_id, status, started_at)
values ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'active', now());

-- an invited (not yet accepted) link trainer2 → client2 for transition tests
insert into public.trainer_clients (id, trainer_id, client_id, status)
values ('aaaaaaaa-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'invited');

insert into public.invitations (id, trainer_id, email, token, status, expires_at)
values ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'client1@test.local', 'tok_secret_1', 'accepted', now() + interval '7 days');

-- trainer1's private custom exercise + media
insert into public.exercises (id, name, category, is_public, owner_trainer_id)
values ('cccccccc-0000-0000-0000-000000000001', 'T1 Special Squat', 'squat', false, '11111111-1111-1111-1111-111111111111');
insert into public.exercise_media (id, exercise_id, kind, storage_path)
values ('cccccccc-0000-0000-0000-000000000002', 'cccccccc-0000-0000-0000-000000000001', 'image', 'lib/t1-squat.png');

-- program tree owned by trainer1
insert into public.programs (id, trainer_id, name) values ('dddddddd-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Strength Block');
insert into public.program_weeks (id, program_id, week_index) values ('dddddddd-0000-0000-0000-000000000002', 'dddddddd-0000-0000-0000-000000000001', 1);
insert into public.program_days (id, week_id, day_index, name) values ('dddddddd-0000-0000-0000-000000000003', 'dddddddd-0000-0000-0000-000000000002', 1, 'Lower A');
insert into public.program_day_exercises (id, day_id, exercise_id, position, sets, reps_target)
values ('dddddddd-0000-0000-0000-000000000004', 'dddddddd-0000-0000-0000-000000000003', 'cccccccc-0000-0000-0000-000000000001', 1, 3, '5');
insert into public.program_assignments (id, program_id, client_id, trainer_id, start_date)
values ('dddddddd-0000-0000-0000-000000000005', 'dddddddd-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', current_date);
insert into public.workout_sessions (id, assignment_id, client_id, program_day_id, scheduled_date)
values ('dddddddd-0000-0000-0000-000000000006', 'dddddddd-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'dddddddd-0000-0000-0000-000000000003', current_date);
insert into public.set_logs (id, session_id, exercise_id, set_index, weight_kg, reps)
values ('dddddddd-0000-0000-0000-000000000007', 'dddddddd-0000-0000-0000-000000000006', 'cccccccc-0000-0000-0000-000000000001', 1, 100, 5);
insert into public.personal_records (id, client_id, exercise_id, kind, value, set_log_id)
values ('dddddddd-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'cccccccc-0000-0000-0000-000000000001', 'weight', 100, 'dddddddd-0000-0000-0000-000000000007');

-- client1's nutrition / recovery / photos
insert into public.nutrition_targets (id, client_id, trainer_id, calories, protein_g, water_ml, effective_from)
values ('eeeeeeee-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2500, 180, 3000, current_date);
insert into public.meal_logs (id, client_id, title) values ('eeeeeeee-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Chicken and rice');
insert into public.meal_photos (id, meal_log_id, storage_path)
values ('eeeeeeee-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222/2026-07/meal.jpg');
insert into public.water_logs (id, client_id, logged_on, total_ml) values ('eeeeeeee-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', current_date, 1500);
insert into public.check_ins (id, client_id, checked_in_on, sleep_quality, energy) values ('eeeeeeee-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', current_date, 4, 3);
insert into public.body_metrics (id, client_id, measured_on, weight_kg) values ('eeeeeeee-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', current_date, 82.5);
insert into public.progress_photos (id, client_id, taken_on, storage_path, pose)
values ('eeeeeeee-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', current_date, '22222222-2222-2222-2222-222222222222/2026-07/front.jpg', 'front');

-- communication + AI
insert into public.message_threads (id, trainer_id, client_id)
values ('ffffffff-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
insert into public.messages (id, thread_id, sender_id, body)
values ('ffffffff-0000-0000-0000-000000000002', 'ffffffff-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Coach, felt strong today');
insert into public.notifications (id, user_id, kind, title)
values ('ffffffff-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'workout_assigned', 'New workout assigned');
insert into public.ai_recommendations (id, client_id, trainer_id, kind, summary, reasoning)
values ('ffffffff-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'push_harder', 'Client is cruising', 'Last 3 sessions under target RPE');

-- ============================================================
-- Tests
-- ============================================================

select plan(46);

-- Helper: run the rest of the transaction as an authenticated stranger.
-- (pgTAP runs inside one transaction; set_config(..., true) scopes to it.)
create or replace function test_as(_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', _uid::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
end;
$$;

-- ---- signup trigger created profiles with sane roles
select is(
  (select count(*) from public.profiles where id in (
    '11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')),
  4::bigint, 'signup trigger created all four fixture profiles');
select is((select role from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 'trainer'::user_role, 'trainer role honored from metadata');

-- ---- stranger CLIENT (client2) sees none of pair 1's data — one negative per table
select test_as('44444444-4444-4444-4444-444444444444');

select is((select count(*) from public.profiles where id in ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222')), 0::bigint, 'profiles: stranger client sees neither trainer1 nor client1');
select is((select count(*) from public.trainer_profiles where id = '11111111-1111-1111-1111-111111111111'), 0::bigint, 'trainer_profiles: stranger sees unlinked trainer nothing');
select is((select count(*) from public.client_profiles where id = '22222222-2222-2222-2222-222222222222'), 0::bigint, 'client_profiles: stranger cannot read another client');
select is((select count(*) from public.trainer_clients where id = 'aaaaaaaa-0000-0000-0000-000000000001'), 0::bigint, 'trainer_clients: stranger cannot see the pair-1 link');
select is((select count(*) from public.invitations), 0::bigint, 'invitations: client sees no invitations directly');
select is((select count(*) from public.exercises where id = 'cccccccc-0000-0000-0000-000000000001'), 0::bigint, 'exercises: another trainer''s custom exercise hidden');
select is((select count(*) from public.exercise_media), 0::bigint, 'exercise_media: media of hidden exercise hidden');
select is((select count(*) from public.programs), 0::bigint, 'programs: unassigned client sees no programs');
select is((select count(*) from public.program_weeks), 0::bigint, 'program_weeks: hidden');
select is((select count(*) from public.program_days), 0::bigint, 'program_days: hidden');
select is((select count(*) from public.program_day_exercises), 0::bigint, 'program_day_exercises: hidden');
select is((select count(*) from public.program_assignments), 0::bigint, 'program_assignments: another client''s assignment hidden');
select is((select count(*) from public.workout_sessions), 0::bigint, 'workout_sessions: another client''s sessions hidden');
select is((select count(*) from public.set_logs), 0::bigint, 'set_logs: another client''s sets hidden');
select is((select count(*) from public.personal_records), 0::bigint, 'personal_records: another client''s PRs hidden');
select is((select count(*) from public.nutrition_targets), 0::bigint, 'nutrition_targets: another client''s targets hidden');
select is((select count(*) from public.meal_logs), 0::bigint, 'meal_logs: another client''s meals hidden');
select is((select count(*) from public.meal_photos), 0::bigint, 'meal_photos: another client''s photos hidden');
select is((select count(*) from public.water_logs), 0::bigint, 'water_logs: another client''s water hidden');
select is((select count(*) from public.check_ins), 0::bigint, 'check_ins: another client''s check-ins hidden');
select is((select count(*) from public.body_metrics), 0::bigint, 'body_metrics: another client''s metrics hidden');
select is((select count(*) from public.progress_photos), 0::bigint, 'progress_photos: another client''s photos hidden');
select is((select count(*) from public.message_threads where id = 'ffffffff-0000-0000-0000-000000000001'), 0::bigint, 'message_threads: stranger sees no pair-1 thread');
select is((select count(*) from public.messages), 0::bigint, 'messages: stranger reads no pair-1 messages');
select is((select count(*) from public.notifications), 0::bigint, 'notifications: another user''s notifications hidden');
select is((select count(*) from public.ai_recommendations), 0::bigint, 'ai_recommendations: hidden from clients entirely');

-- client2 cannot write into client1's data: the update runs but matches
-- zero rows; verified from the postgres side afterwards.
select lives_ok(
  $$update public.check_ins set energy = 5 where id = 'eeeeeeee-0000-0000-0000-000000000005'$$,
  'check_ins: stranger update executes without matching rows');
reset role;
select is((select energy from public.check_ins where id = 'eeeeeeee-0000-0000-0000-000000000005'), 3::smallint, 'check_ins: stranger update changed nothing');
select test_as('44444444-4444-4444-4444-444444444444');
select throws_ok(
  $$insert into public.check_ins (client_id, checked_in_on) values ('22222222-2222-2222-2222-222222222222', current_date + 1)$$,
  '42501', null, 'check_ins: stranger cannot insert for another client');

-- client2 cannot self-activate their invited link (escalation via trigger)
select throws_ok(
  $$update public.trainer_clients set status = 'active' where id = 'aaaaaaaa-0000-0000-0000-000000000002'$$,
  'P0001', 'links are activated only by accepting an invitation',
  'trainer_clients: client cannot self-activate an invited link');

-- ---- stranger TRAINER (trainer2) escalation attempts
select test_as('33333333-3333-3333-3333-333333333333');

select is((select count(*) from public.check_ins), 0::bigint, 'check_ins: unlinked trainer sees nothing');
-- Sprint 2: another trainer cannot read trainer1's program tree or assignments
select is((select count(*) from public.programs where id = 'dddddddd-0000-0000-0000-000000000001'), 0::bigint, 'programs: another trainer cannot read a peer''s program');
select is((select count(*) from public.program_weeks where id = 'dddddddd-0000-0000-0000-000000000002'), 0::bigint, 'program_weeks: hidden from another trainer');
select is((select count(*) from public.program_days where id = 'dddddddd-0000-0000-0000-000000000003'), 0::bigint, 'program_days: hidden from another trainer');
select is((select count(*) from public.program_day_exercises where id = 'dddddddd-0000-0000-0000-000000000004'), 0::bigint, 'program_day_exercises: hidden from another trainer');
select is((select count(*) from public.program_assignments where id = 'dddddddd-0000-0000-0000-000000000005'), 0::bigint, 'program_assignments: hidden from another trainer');
select is((select count(*) from public.workout_sessions where id = 'dddddddd-0000-0000-0000-000000000006'), 0::bigint, 'workout_sessions: hidden from another trainer');
select is((select count(*) from public.exercises where id = 'cccccccc-0000-0000-0000-000000000001'), 0::bigint, 'exercises: another trainer''s custom exercise hidden');
select throws_ok(
  $$insert into public.trainer_clients (trainer_id, client_id, status) values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'active')$$,
  '42501', null, 'trainer_clients: trainer cannot insert an active link directly');
select throws_ok(
  $$update public.trainer_clients set client_id = '22222222-2222-2222-2222-222222222222' where id = 'aaaaaaaa-0000-0000-0000-000000000002'$$,
  'P0001', 'participants of a coaching link cannot be changed',
  'trainer_clients: cannot repoint a link at a victim client');

-- ---- role self-promotion is blocked
select test_as('44444444-4444-4444-4444-444444444444');
select throws_ok(
  $$update public.profiles set role = 'trainer' where id = '44444444-4444-4444-4444-444444444444'$$,
  'P0001', 'role cannot be changed after signup',
  'profiles: a client cannot promote themselves to trainer');

-- ---- message immutability: sender (client1) cannot edit their own sent body
select test_as('22222222-2222-2222-2222-222222222222');
select throws_ok(
  $$update public.messages set body = 'forged' where id = 'ffffffff-0000-0000-0000-000000000002'$$,
  'P0001', 'messages are immutable; only read_at may change',
  'messages: body cannot be rewritten');
select throws_ok(
  $$update public.messages set read_at = now() where id = 'ffffffff-0000-0000-0000-000000000002'$$,
  'P0001', 'only the recipient may set read_at',
  'messages: sender cannot mark their own message read');

-- linked trainer (trainer1) CAN mark it read — the positive control
select test_as('11111111-1111-1111-1111-111111111111');
select lives_ok(
  $$update public.messages set read_at = now() where id = 'ffffffff-0000-0000-0000-000000000002'$$,
  'messages: recipient can set read_at');

select * from finish();
rollback;
