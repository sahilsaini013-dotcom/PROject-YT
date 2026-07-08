# Screen Inventory

Derived from the core user flows (Brain/02) and the feature map (Brain/03), scoped to v1 (Brain/08). One Next.js app: `/coach/*` is the trainer dashboard (desktop-first), `/app/*` is the client PWA (mobile-first), `/` is the public landing page.

## Landing

### Landing Page — `/`

Public one-page marketing site with sign-up entry point.

- Hero with brand animation (dark/athletic, volt-green accent)
- Product pillars overview
- Sign-up CTA

## Auth

### Sign In — `/auth/sign-in`

Existing trainer or client signs in.

- Email/password form
- Link to sign up

### Sign Up — `/auth/sign-up`

Trainer creates an account.

- Email/password form
- Trainer profile basics

### Accept Invite — `/auth/invite/[token]`

Client redeems a trainer invite and creates an account.

- Invite validation
- Account creation form
- Handoff to client onboarding

## Trainer Dashboard (desktop-first)

### Roster — `/coach`

Home screen: all clients at a glance.

- Client list with status indicators (on track, needs review, missed sessions)
- Adherence summary per client
- Invite-client action

### Client Profile — `/coach/clients/[id]`

Everything about one client, tabbed.

- Overview tab: goals, injuries, recent activity
- Workouts tab: assigned programs, session logs
- Check-ins tab: recovery history
- Nutrition tab: targets vs. logged meals and water
- Progress tab: strength trends, body metrics, PRs
- Notes tab: trainer notes

### Program List — `/coach/programs`

All programs the trainer has built.

- Program cards with client assignments
- Create-program action

### Program Builder — `/coach/programs/[id]`

Build and edit a program.

- Program → weeks → days structure
- Exercise picker from library
- Sets, reps, target RPE, rest, notes per exercise

### Exercise Library — `/coach/exercises`

Browse and search the seeded exercise library.

- Search and category filters
- Exercise detail with generated category media
- Add custom exercise

### Assign Program — `/coach/clients/[id]/assign`

Assign a program to a client.

- Program selector
- Start date picker
- Assignment notes; triggers client notification

### Nutrition Targets — `/coach/clients/[id]/nutrition/targets`

Set a client's nutrition targets.

- Calories, protein, water inputs
- Effective-date and notes

### Messages — `/coach/messages`

1:1 conversations with clients.

- Thread list
- Realtime chat view

### Notifications — `/coach/notifications`

In-app notification feed.

- Completed workouts, submitted check-ins, new messages

### Settings — `/coach/settings`

Trainer account and profile.

- Business profile, specialties
- Account and email preferences

## Client PWA (mobile-first)

### Today — `/app`

Client home: what's due today.

- Today's workout card (coach-assigned session takes precedence; a solo session appears as a self-guided card)
- Entry point to self-guided training when nothing is assigned
- Check-in prompt
- Nutrition targets and water progress
- Unread messages indicator

### Train — `/app/train`

Self-training home (DEC-014). Available to every client.

- Quick-start CTA → creates a solo session and opens the player
- Saved routines list with start / edit / delete
- New-routine form

### Routine Editor — `/app/train/routines/[id]`

Build and edit a personal routine.

- Rename
- Ordered exercise rows (sets, reps target) via the shared exercise picker
- Start this routine

### Workout Player — `/app/workout/[sessionId]`

Complete an assigned or solo workout.

- Exercise list with instructions and media (assigned) or routine/ad-hoc exercises (solo)
- "Add exercise" and "Add set" for solo sessions
- Set logging: weight (in the client's unit), reps, RPE
- Rest timer
- Exercise / substitution note (coach-facing only when a trainer is linked)

### Session Summary — `/app/workout/[sessionId]/summary`

Wrap-up after a workout.

- Volume and PR highlights
- Session notes
- Completion confirmation

### Check-In — `/app/check-in`

Daily recovery check-in.

- Sleep, soreness, energy, mood, motivation inputs
- Optional pain note

### Nutrition Log — `/app/nutrition`

Log meals and water against trainer targets.

- Meal entries with notes and photos
- Optional macros
- Water tracker vs. daily goal

### Progress — `/app/progress`

Client's own progress over time.

- Strength trend charts
- Adherence/consistency view
- Body metrics and PRs

### Messages — `/app/messages`

Chat with the trainer.

- Realtime 1:1 thread

### Onboarding — `/app/onboarding`

First-run setup after accepting an invite.

- Profile: goal, height, weight, injuries, experience, schedule, equipment
- Baseline check-in

### Settings — `/app/settings`

Client account preferences.

- Profile edits
- Notification preferences

## Deferred Screens

Do not build these in v1:

- AI review inbox
- Calendar / scheduling
- Billing / packages / invoices
- Meal plans / grocery lists
