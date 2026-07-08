# Opportunity Backlog (research-driven)

_2026-07-08. Ranked feature opportunities from the competitive scan (`Brain/12-competitive-landscape.md`) and strategy brief (`Work Tracking/13-strategy-brief.md`). Effort is rough (S/M/L for a solo founder + Claude Code). "Attach point" maps each to the existing schema, especially the deferred-objects list in `Brain/10-database-schema.md:515-533`, so nothing here is a rebuild._

## Ranking method

Scored on **differentiation × retention/revenue impact × fit-to-existing-stack**. Top items are where the market is weak *and* we're already partly built.

---

### P0 — the differentiators (do these next)

**1. At-risk client flags (churn radar)** — _Effort: M_
Surface clients whose behavior matches known churn signals (<3 sessions in first 14 days, logging drop-off, missed check-ins). The single highest-ROI copilot feature: ties AI to trainer revenue.
- _Why:_ <3 workouts/14 days → 3–4× churn; nobody ships this in-product.
- _Attach point:_ `client_risk_flags` (starts as an `escalate` `ai_recommendation`); data already in `workout_sessions`, `check_ins`, `set_logs`.

**2. AI trainer review inbox (the copilot core)** — _Effort: L_
The specced `ai_recommendations` inbox: attention/readiness/progress/nutrition triage, **always with reasoning**, **trainer-approved before any client sees it**. This *is* the brand.
- _Why:_ "AI writes workouts" is commoditized; "AI helps the coach decide" is open whitespace + matches the 77%-can't-replace-a-coach sentiment.
- _Attach point:_ `ai_recommendations` table already exists (`Brain/10:364-382`); needs a backend job + trainer UI. Board item **P2-001**.

**3. Weekly client summaries** — _Effort: M_
Auto-generated per-client weekly digest (training done, adherence, nutrition, recovery, "what to do next") for the trainer's Monday review.
- _Why:_ turns scattered data into a coaching action; huge time-saver for a solo PT with 25+ clients.
- _Attach point:_ `weekly_summaries` (deferred object); reads existing tables.

### P1 — client-app love (feeds the data moat)

**4. Streaks + PR celebration + consistency nudges** — _Effort: S–M_
Make the client app *want*-to-open. Streaks, PR moments, "12 check-ins = habit locked" cues.
- _Why:_ 12+ check-ins/mo → ~2% churn; structured habit loops are proven retention.
- _Attach point:_ `personal_records` + `workout_sessions` already logged; mostly client-side UX.

**5. Light social / accountability layer** — _Effort: M_
Opt-in accountability: shared progress with coach, optional peer/group visibility (Hevy-lite, privacy-first — no health data exposed).
- _Why:_ social/accountability features cut monthly churn **20–35%**.
- _Attach point:_ new, but small; respect the privacy invariant (progress/meal photos stay private/ signed-URL).

**6. Solo → coach upgrade funnel** — _Effort: S_
One-tap "Connect a coach" in the Train tab; convert free solo lifters into trainer-billable clients.
- _Why:_ cheapest acquisition channel; operationalizes DEC-014.
- _Attach point:_ reuse existing invite/`trainer_clients` link flow from the solo `client_routines` context.

### P2 — table-stakes catch-up

**7. Wearables via Terra API → readiness scores** — _Effort: M_
One Terra integration (Apple Health / Google Fit / Garmin / Oura / WHOOP) → `wearable_summaries` → `readiness_scores` feeding the copilot.
- _Why:_ recovery/readiness is table stakes for a credible "coaching intelligence" story; Terra makes it cheap (free WHOOP tier, HIPAA/SOC2).
- _Attach point:_ `wearable_summaries`, `readiness_scores` (deferred objects).

**8. Nutrition depth — AI food scan + macro DB** — _Effort: L_
Close the gap to Everfit's MacroSnap: photo/barcode → macros; optional food DB; keep "simple-first" default.
- _Why:_ nutrition is where TrueCoach is weak and where we can bundle (vs their add-ons).
- _Attach point:_ `food_entries` + food DB (deferred); `meal_logs` already has macro columns.

**9. In-app payments with a *no-skim* promise** — _Effort: L (Phase 3)_
Packages/subscriptions/invoices — the differentiator is **we don't take 5%** (vs TrueCoach).
- _Attach point:_ package/subscription/invoice objects (Phase 3, DEC-004); "bolt on cleanly, nothing in v1 references them."

### P3 — later / growth

**10. Template & meal-plan marketplace** — _Effort: L_ — creator-economy angle; `is_template` flag exists. Phase 4.
**11. Group coaching / challenges / leaderboards** — _Effort: L_ — retention + referral engine; overlaps with #5. Phase 4.
**12. Branded/white-label client app** — _Effort: M_ — matches Trainerize's edge; matters for premium trainers.

---

## Sequencing recommendation

**Phase 2 (now):** #1 → #2 → #3 (the copilot) in parallel with #4 (client-app love). This is the whole differentiated story and it's mostly *assembling already-modeled pieces*, not net-new architecture.
**Then:** #7 (Terra) + #6 (funnel) + honest pricing launch. **Phase 3:** #8–#9. **Phase 4:** #10–#12.
