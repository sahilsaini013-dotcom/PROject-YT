# Training Hub: Product & Development Plan

## Summary

Training Hub is a premium coaching platform for personal trainers and their clients. It combines training, nutrition, recovery, progress tracking, live coaching, and AI-assisted decision support so trainers know exactly which clients need attention, who is ready to be pushed harder, and who needs recovery before performance drops.

The core promise: Training Hub helps trainers make smarter coaching decisions by connecting workout performance, nutrition behavior, recovery signals, check-ins, wearable data, and client adherence in one place.

## Product Pillars

### Training Hub

- Trainer program builder for routines, phases, exercises, sets, reps, tempo, rest, RPE, substitutions, and progression rules.
- Client workout player with set logging, rest timer, exercise instructions, substitutions, PR tracking, and completion summaries.
- Progress tracking for strength, consistency, workout adherence, body metrics, and milestones.

### Nutrition Hub

- Trainer-assigned nutrition targets for calories, macros, protein, water, and meal timing.
- Client food logging through quick entries, photos, meal notes, and optional macro tracking.
- Meal plans, grocery lists, supplement plans, and trainer-reviewed nutrition check-ins.
- AI connects nutrition patterns to training performance, soreness, recovery, and readiness to push harder.

### Recovery Hub

- Daily and weekly check-ins for sleep, soreness, energy, motivation, mood, pain, stress, and readiness.
- Wearable summaries from Apple Health and Google Fit where available.
- Recovery risk signals that help trainers avoid pushing clients at the wrong time.

### AI Trainer Assistant

- Studies routines, workout logs, check-ins, nutrition logs, trainer notes, wearable summaries, and adherence.
- Flags clients who need encouragement, deloading, a nutrition adjustment, a program change, or an extra push.
- Keeps the trainer in control: AI recommendations are approved, edited, or dismissed before client-facing nudges are sent.

## Version 1 Experience

### Trainer Dashboard

- Client roster with status indicators: on track, needs review, missed sessions, ready to push, nutrition concern, recovery risk.
- Client profile with goals, injuries, limitations, history, body metrics, photos, check-ins, food logs, workout logs, notes, and wearable summaries.
- Program builder and nutrition target builder.
- Calendar for workouts, sessions, check-ins, and follow-ups.
- Messaging, live coaching notes, and trainer task inbox.
- AI review inbox with suggested actions.

### Client Mobile App

- Today view with workout, check-in, nutrition targets, water goal, messages, and upcoming session.
- Workout player with set logging, timers, substitutions, and completion summary.
- Nutrition logging with meals, macros, water, supplements, photos, and notes.
- Recovery check-ins for mood, soreness, sleep, energy, pain, and motivation.
- Progress view for strength trends, consistency, body metrics, photos, and milestones.
- Trainer-approved nudges and reminders.

## Architecture

- Native iOS app: Swift and SwiftUI.
- Native Android app: Kotlin and Jetpack Compose.
- Trainer web dashboard: Next.js and TypeScript.
- Backend: typed API service such as Node.js/NestJS.
- Database: Postgres.
- Realtime: WebSockets or managed realtime service for messaging and live updates.
- Auth: email/password, magic link, Apple/Google sign-in, trainer/client role permissions.
- Notifications: APNs, FCM, and email.
- AI layer: server-side recommendation service with stored recommendation history, source data, trainer approval state, and audit trail.
- Wearables: Apple Health and Google Fit summaries where available.

## Core Data Model

- Users, roles, trainer profiles, client profiles.
- Trainer-client relationships and invitations.
- Exercises, exercise media, workout templates, programs, phases, assigned workouts.
- Workout sessions, set logs, RPE, completion status, skipped reasons.
- Nutrition targets, meals, food logs, water logs, supplements, meal plans, grocery lists.
- Check-ins, body metrics, progress photos, wearable summaries.
- Messages, session notes, calendar events, trainer tasks.
- AI recommendations with source data, confidence, status, trainer action, and timestamp.
- Payment-ready records for Phase 2: packages, invoices, subscriptions, payment status.

## Build Phases

### Phase 1: Coaching Foundation

- Auth, onboarding, trainer-client invites.
- Client profiles and trainer roster.
- Exercise library, program builder, and workout assignment.
- Client workout logging and manual check-ins.
- Nutrition targets, simple food logging, water tracking, and meal notes.
- Basic messaging, notifications, and progress dashboard.

### Phase 2: Intelligence and Live Coaching

- AI recommendation inbox.
- Weekly client summaries.
- Readiness scoring from workouts, nutrition, check-ins, and wearables.
- Scheduling, session notes, and live coaching workflow.
- Trainer task queue: review, message, adjust, push, deload, or nutrition follow-up.

### Phase 3: Business Layer

- Trainer packages, subscriptions, invoices, and payment links.
- Client billing status.
- Revenue and retention dashboard.
- Payment reminders and failed-payment handling.

### Phase 4: Growth

- Program and meal-plan template marketplace.
- Group coaching.
- Challenges and leaderboards.
- Gym/team accounts.
- Advanced AI trend detection.

## Test Plan

- Trainer can invite a client, create a program, assign workouts, and review completion.
- Trainer can set nutrition targets, review meal logs, and adjust guidance.
- Client can complete workouts, log sets, submit check-ins, track water, and log meals.
- Trainer can see readiness signals and AI recommendations based on workout, nutrition, recovery, and wearable data.
- AI recommendations remain trainer-controlled before client-facing nudges are sent.
- Access control prevents clients from seeing other clients and prevents trainers from seeing unassigned clients.
- App works without wearable data; wearable data improves recommendations but is optional.
- Notifications fire for assigned workouts, missed check-ins, nutrition reminders, messages, session reminders, and approved nudges.
- Payment data structures exist for Phase 2 but do not block Version 1 launch.

## Assumptions

- Training Hub is trainer-first, not just a solo fitness tracker.
- Native mobile apps are required for iOS and Android.
- Web dashboard is required for trainers because programming, nutrition review, and client management are easier on desktop.
- Nutrition is a core pillar, not an optional add-on.
- AI assists the trainer; it does not replace trainer judgment.
- Payments are planned in the architecture but built after the core coaching platform.
