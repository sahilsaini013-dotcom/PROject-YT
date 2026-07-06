# Build Ledger

Append-only session continuity log. Newest entries at the bottom. Format per entry:
date · sprint · completed (with SHAs) · in flight · exact next action · blockers.

---

## 2026-07-06 — Session 2 (Sprint 0)

**Sprint:** 0 — monorepo scaffold, initial migration, brand theme, PWA, CI, landing.

**Completed:**
- Merged PR #1 (docs + brand assets) into main (`e25c4fe`).
- Monorepo: npm workspaces — `apps/web` (Next.js 15.5, TS, Tailwind v4), `packages/shared` (zod enums mirroring DB + category→illustration map), root scripts (dev/build/lint/typecheck/e2e).
- `supabase/migrations/20260706000001_init.sql`: all 26 tables from Brain/10, 13 enums, updated_at triggers, hot-path indexes, `handle_new_user` signup trigger, security-definer RLS helpers, RLS enabled on every table with the full per-table access matrix, storage buckets (`progress-photos`, `meal-photos` private; `exercise-media` public) + storage policies.
- `supabase/seed.sql`: 100 public exercises across all 15 categories.
- Brand: assets copied to `apps/web/public/brand/`; Tailwind theme tokens from Brain/11 in `globals.css`; Archivo/Inter self-hosted via `next/font/local` (woff2 in `apps/web/src/fonts/`); PWA manifest (`manifest.ts`) wired to brand icons, installable shape verified by e2e.
- Landing page at `/` with `hero-loop.svg` background + `logo-reveal.svg` + feature cards using exercise illustrations; placeholder shells at `/coach` and `/app`.
- Playwright: config (chromium + mobile projects; sandbox uses preinstalled `/opt/pw-browsers/chromium`, CI installs its own), 3 passing e2e specs (landing brand, manifest installable, shells).
- CI: `.github/workflows/ci.yml` — typecheck, lint, supabase start + db reset (proves migrations replay), build, Playwright e2e.

**Environment mode (per GOAL.md secrets protocol):** local Supabase stack via Docker IS working in this sandbox — daemon must be started manually (`sudo dockerd &`) and `supabase start -x edge-runtime` (edge-runtime container cannot set rlimits in this sandbox; not needed for v1). `db reset` verified clean: 26 tables, 65 policies, 100 seeded exercises. Local keys in gitignored `apps/web/.env.local` (standard local-dev defaults, not secrets).

**Verification:** typecheck ✓, lint ✓ (0 errors), build ✓, e2e 3/3 ✓, db reset ✓, landing screenshot captured for PR.

**In flight:** Sprint 0 PR about to be opened from `claude/training-hub-setup-7f9wdy`.

**Exact next action:** open Sprint 0 PR → run /code-review (medium) → CI green → merge → start Sprint 1 (auth + invites) on a fresh branch off main.

**Blockers:** none. No cloud Supabase/Vercel credentials provided yet — not blocking; app stays deployable, deploy steps documented in README. DEFERRED: cloud deploy until credentials exist (ask outstanding in Sprint 0 PR description).

### Addendum — code review round (same session)

/code-review (medium, multi-agent) on PR #3 found and fixed before merge:
- **RLS escalation (critical):** `trainer_clients` insert now restricted to `status='invited'` + trainer role; a transition trigger makes participants immutable and blocks invited→active outside the invitation-acceptance RPC (RPC will set local flag `training_hub.invitation_acceptance` — to be built in Sprint 1).
- **Message forgery (critical):** trigger makes messages immutable except `read_at`, settable only by the recipient.
- **Signup bricking:** `handle_new_user` no longer casts raw metadata; unknown roles default to client.
- **Storage policy crash:** `storage_path_owner()` returns null for non-uuid first path segments instead of erroring the query.
- **Missing GRANTs (critical, found by new tests):** this Supabase image's default ACLs give API roles no DML on new tables and no EXECUTE on functions — the whole API would have 42501'd in prod. Explicit grants added to the migration (authenticated + service_role only; anon gets nothing).
- Playwright chromium path now applies only when the sandbox binary exists; `apps/web/.gitignore` keeps `.env.example` trackable; brand tokens defined once in `@theme`.
- **New: `supabase/tests/rls_test.sql`** — 38 pgTAP assertions: per-table stranger-read denial for all 26 tables, write denial, self-activation/repoint/forgery escalation attempts, positive control. Wired into CI (`npx supabase test db`). All pass locally.

Deferred to Sprint 1 (noted from review): invitation-acceptance security-definer RPC (`accept_invitation`) — the redemption path is intentionally absent in Sprint 0.

## 2026-07-06 — Session 2 (Sprint 1)

**Sprint:** 1 — auth, roles, invites, onboarding.

**Completed (branch `claude/sprint-1-auth-invites`, stacked on Sprint 0 branch):**
- Migration `20260707000001_invitation_flow.sql`: `create_invitation` (server-side token via pgcrypto — needs `extensions` in search_path), `get_invitation` (public accept-page lookup, marks overdue invites expired), `accept_invitation` (validates token + caller email, activates link via the transition-trigger flag, opens message thread, notifies trainer). Executes locked to the right roles; anon can only `get_invitation`.
- Generated DB types (`supabase gen types`) into `packages/shared/src/database.types.ts`; both Supabase clients are typed. NOTE: CLI appends a PostHog error line to stdout — strip it when regenerating.
- Auth UI: `/auth/sign-in` (password + magic link modes), `/auth/sign-up` (trainer), `/auth/invite/[token]` (validated accept + client signup), middleware (session refresh + role routing from user_metadata.role; RLS remains the data guard).
- Coach roster `/coach`: real client list, pending invites, invite form (server action returns shareable link built from request origin — NEXT_PUBLIC_SITE_URL host mismatch cost an hour: cookies don't cross localhost/127.0.0.1), sign-out.
- Client `/app`: personalized Today shell + onboarding CTA; `/app/onboarding`: full client_profiles form.
- e2e `auth.spec.ts` (all passing): full trainer→invite→accept→onboard→Today loop across two browser contexts, role-routing denials, anonymous redirects, expired-token rejection (DB-level expiry).

**Verification:** pgTAP 38/38 ✓, typecheck ✓, lint ✓, build ✓, e2e 6/6 ✓.

**In flight:** waiting on PR #3 (Sprint 0) CI after the playwright-install fix; Sprint 1 PR opens after #3 merges (branch will be rebased onto main).

**Exact next action:** check PR #3 CI → merge → rebase this branch → open Sprint 1 PR → /code-review + /security-review (auth sprint) → merge → Sprint 2 (exercise library + program builder).

**Blockers:** GitHub MCP flapping (needs re-auth periodically); webhook events still arrive. DEFERRED (unchanged): cloud deploy pending credentials.

### Addendum — Sprint 1 review + fixes (same session)

Ran /code-review (medium, multi-agent: 3 finder angles) + /security-review on the Sprint 1 diff. Fixed before finishing:
- **Security:** open-redirect via `next` param constrained to same-origin; latent self-promotion closed (profiles.role now immutable via trigger + pgTAP test — RLS suite 39 assertions).
- **Correctness (real bugs):** middleware dropped refreshed-session cookies on redirect (silent logout) — now carried; middleware reads role from profiles (immutable) not user-mutable metadata; sign-out redirected off the authed route (was crashing on null user); added `/auth/callback` PKCE exchange (magic link had no callback); OTP sign-in sets shouldCreateUser:false; invite-accept falls back to sign-in for existing emails; enable_confirmations pinned false.
- **Cleanup:** shared field/button classes + ButtonLink in ui.tsx (killed 3 CTA copies); homePathForRole + signUpMetadata helpers; null-safe roster name + tabular-nums.
- e2e now 8 specs (added sign-out-no-crash + callback regression). All pass.

**DEFERRED:** GitHub MCP is disconnected in this session, so the **Sprint 1 PR could not be opened** — branch `claude/sprint-1-auth-invites` is pushed and green locally. Open the draft PR (base main) as soon as the GitHub connector reconnects. Not blocking Sprint 2 work.

**Next action:** open Sprint 1 PR when MCP returns; meanwhile build Sprint 2 (exercise library + program builder + assignment) on a new branch off main.

## 2026-07-06 — Session 2 (Sprint 2)

**Sprint:** 2 — exercise library, program builder, assignment. Branch `claude/sprint-2-programs`, stacked on Sprint 1 (main doesn't have Sprint 1 yet — PR deferred on GitHub MCP outage).

**Completed:**
- Coach shell: `coach/layout.tsx` with nav (Roster/Programs/Exercises) + sign-out; roster rows now link to client detail.
- Exercise library `/coach/exercises`: search + category filter chips over the 100 seeded exercises, brand category illustrations (client-filtered from a server fetch).
- Program builder `/coach/programs` (list + create) and `/coach/programs/[id]` (full tree editor): program→weeks→days→exercises, exercise picker modal, per-slot sets/reps/RPE/rest/notes with autosave-on-blur via server actions; weeks_count kept in sync. All mutations RLS-guarded (trainer owns the tree).
- Assignment (`assign.ts`): materializes one workout_session per program day on a weekly calendar (day D wk W → start+((W-1)*7+(D-1))), inserts a workout_assigned notification.
- Minimal client detail `/coach/clients/[id]` (profile + assigned programs) so roster links aren't dead (full tabbed review is Sprint 5).
- e2e `programs.spec.ts`: trainer builds a 2-week program from seeded exercises + assigns (asserts sessions land in DB); second unlinked trainer cannot see it via the app. Authoritative program-tree RLS added to pgTAP (now 46 assertions: trainer2 can't read trainer1's program/weeks/days/exercises/assignments/sessions).
- playwright.config loads apps/web/.env.local into the runner; pgTAP profile-count assertion scoped to fixture ids (robust when e2e leaves data).

**Verification:** typecheck ✓, lint ✓, build ✓ (14 routes), pgTAP 46/46 ✓, e2e 9/9 ✓, builder+library screenshots captured.

**Exact next action:** open Sprint 1 + Sprint 2 PRs when GitHub MCP returns (both branches pushed, green). Then Sprint 3 (client Today + workout player + set logging + celebration).

**Blockers:** GitHub MCP still disconnected → PRs deferred (send_later reminder armed). Cloud deploy still deferred pending creds.

## 2026-07-06 — Session 2 (Sprint 3)

**Sprint:** 3 — client Today, workout player, session summary. Branch `claude/sprint-3-workout-player` (stacked on Sprint 2).

**Completed:**
- Migrations: `complete_workout_session` RPC (security definer — recomputes weight + Epley e1rm PRs from set_logs, writes personal_records which clients can't insert directly, flags one PR set/exercise, marks session done); `set_logs_slot_uniq` index for upsert; `assign_program` RPC (atomic assignment — validates ownership+roster link, blocks duplicate active assignment, materializes sessions + notification in one txn — fixes two Sprint 2 review findings: duplicate assign + orphan rows).
- Client Today `/app`: real — today's due session (volt CTA) + "coming up" list, timezone-aware "today".
- Workout player `/app/workout/[sessionId]`: per-exercise set logging (weight/reps/RPE, upsert-on-blur), rest timer bar, substitution/note field, session RPE + notes; marks in_progress on mount; Complete → summary.
- Session summary `/app/workout/[sessionId]/summary`: celebration.svg, sets/volume/PR stat tiles (tabular), PR list, client notes.
- Sprint 2 review fixes applied: assignment via atomic RPC; exercise-picker "showing N of M" hint.
- e2e `workout.spec.ts`: client completes assigned workout, logs 3 sets (asserts 3 rows in set_logs), PR detected (personal_records > 0), session drops off Today. RLS suite still 46/46.

**Design note:** the client-side "Workout complete" overlay was removed — completeSession's revalidation re-ran the workout server component which redirects completed sessions to /summary, so the summary page (which already has the celebration) is the single post-workout screen.

**Verification:** typecheck ✓, lint ✓, build ✓, pgTAP 46/46 ✓, e2e 10/10 ✓.

**Exact next action:** open Sprints 1–3 PRs when GitHub MCP returns. Then Sprint 4 (check-ins, nutrition targets, meal log w/ photo, water).

**Blockers:** GitHub MCP still down → PRs deferred. Cloud deploy deferred.

## 2026-07-06 — Session 2 (Sprint 4)

**Sprint:** 4 — check-ins, nutrition targets, meal log, water. Branch `claude/sprint-4-recovery-nutrition` (stacked on Sprint 3).

**Completed:**
- Client PWA bottom nav via `app/(tabs)/` route group (Today/Check-in/Nutrition/Progress); Today, workout, onboarding restructured accordingly.
- Daily check-in `/app/check-in`: 1–5 pill scales (sleep/soreness/energy/mood/motivation/stress) + hours + pain/comment; upsert on (client_id, checked_in_on) → one per day enforced (DB unique + UI "already checked in, updating").
- Nutrition `/app/nutrition`: trainer targets vs consumed (calories/protein bars), water tracker with ±250ml upsert on (client_id, logged_on) and progress bar vs target, meal logging (title/notes/optional macros/photo). Meal photos upload client-side to the private `meal-photos` bucket ({client_id}/{yyyy-mm}/{meal_id}.ext); displayed via server-signed URLs.
- Coach targets `/coach/clients/[id]/nutrition/targets`: sets calories/protein/carbs/fat/water (+guidance), inserts a new row keeping history; linked from client detail.
- Progress `/app/progress`: PR list (full trends are Sprint 6).
- Today nudges to the daily check-in when not yet done.
- next.config: Supabase host added to image remotePatterns for signed photo URLs.
- e2e `nutrition.spec.ts`: check-in (asserts one row), meal+photo (asserts meal_photos row, asserts the private bucket rejects public access), water vs target (polls DB for the async upsert).

**Verification:** typecheck ✓, lint ✓, build ✓ (17 routes), pgTAP 46/46 ✓, e2e 11/11 ✓.

**Exact next action:** open Sprints 1–4 PRs when GitHub MCP returns. Then Sprint 5 (trainer review tabs + Realtime messaging; /security-review after).

**Blockers:** GitHub MCP still down → PRs deferred. Cloud deploy deferred.

## 2026-07-06 — Session 2 (Sprint 5)

**Sprint:** 5 — trainer review tabs + Realtime messaging. Branch `claude/sprint-5-review-messaging` (stacked on Sprint 4).

**Completed:**
- Migration `20260709000001`: messages added to supabase_realtime publication; unread index; `notify_on_message` security-definer trigger (inserts a message_received notification for the other participant — clients can't self-insert notifications under RLS).
- Realtime chat: shared `components/chat.tsx` — loads initial messages, subscribes to postgres_changes INSERTs filtered by thread (RLS scopes delivery), sends via insert, marks incoming read. Used by `/coach/messages/[clientId]` and `/app/messages` (+ `/coach/messages` thread list, Messages added to coach nav and client tab bar as "Coach").
- Trainer review: `/coach/clients/[id]` restructured into a tabbed layout (Overview/Workouts/Check-ins/Nutrition/Progress). Overview shows adherence % (completed/scheduled-to-date) + profile + assigned programs. Workouts = per-session logged sets + volume + PR flags. Check-ins = recovery table with pain-flag highlight. Nutrition = current targets + recent meals. Progress = PRs + body metrics.
- e2e `messaging.spec.ts`: trainer sees the client's real completed workout (120kg×5) + 100% adherence, then two live browser contexts exchange messages over Realtime (asserts cross-context delivery + 2 persisted rows).

**Verification:** typecheck ✓, lint ✓, build ✓ (19 routes), pgTAP 46/46 ✓, e2e 12/12 ✓. /security-review pending (running next).

**Exact next action:** run /security-review (messaging + storage); open Sprints 1–5 PRs when GitHub MCP returns; then Sprint 6 (progress trends, notifications, landing final, polish).

**Blockers:** GitHub MCP still down → PRs deferred. Cloud deploy deferred.
