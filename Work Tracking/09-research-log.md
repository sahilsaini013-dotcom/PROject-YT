# Research Log

Use this file to capture market notes, user interviews, trainer feedback, client feedback, and product evidence.

## Research Questions

- What do trainers currently use to manage clients?
- What parts of coaching are most painful for trainers?
- How much nutrition detail do clients tolerate before logging drops?
- What makes a trainer trust an AI recommendation?
- Which screens should be mobile-first vs desktop-first?

## Notes

### 2026-07-08 — First competitive & market scan

Full analysis in `Brain/12-competitive-landscape.md`; strategy in `Work Tracking/13-strategy-brief.md`; opportunities in `Work Tracking/14-opportunity-backlog.md`. Headlines:

- **Market:** fitness training software ~$12.45B (2026) → ~$46B (2035), 15.8% CAGR; online fitness → ~$120B by 2031. ~48% of coaches run hybrid. [businessresearchinsights.com; researchnester.com]
- **AI attitudes:** 91% of coaches use AI (59% daily) but **77% say AI can't replace a human coach** — the market rewards AI that assists the coach, not replaces them. [FitBudd AI Coaching Report]
- **Incumbents:** Trainerize (incumbent, nutrition +$45/mo), TrueCoach (loved 1:1, but new **5% payment fee**, weak nutrition), Everfit (value/feature leader, but **add-on stacking** ~+$65/mo, no dark mode). Fully-loaded @50 clients: Everfit ~$134–148, TrueCoach ~$137 +5%, Trainerize ~$175–200.
- **Consumer bar:** Hevy = social logging + HevyGPT (Feb 2026); Ray = voice coaching. Trainer platforms' **client apps are their weakest surface.**
- **Retention (the copilot's ROI):** <3 workouts in first 14 days → **3–4× churn**; 12+ check-ins/mo → ~2% churn; social/accountability → **20–35% less churn**; structured onboarding 87% vs 60% at 6 months. [retentioncheck.com; fitdegree.com]
- **Wearables:** Terra API = 500+ devices, one integration, HIPAA/SOC2, free WHOOP tier → **buy, don't build**. [tryterra.co]

**Answers to standing research questions:**
- _What do trainers use / what's painful?_ → Trainerize/TrueCoach/Everfit; pain = add-on fees, weak nutrition, clunky client apps, price cliffs.
- _What makes a trainer trust AI?_ → explainability + approval gates + it must protect *their revenue* (retention) — validates `Brain/04` and RISK-003.
- _Whitespace:_ **trainer decision-support AI** (not workout generation) + a lovable client app + honest all-in pricing.

**Sources:** see the full citation list in `Brain/12-competitive-landscape.md`.

### 2026-07-09 — Comprehensive four-thread landscape (cost-aware deep scan)

Expanded the single competitive scan into a **whole-space landscape** across four threads, done cost-efficiently (reuse-first, batched searches, verify only load-bearing numbers). Five docs:

- **`Brain/12` (expanded)** — competitor teardowns now cover the minor coaching apps (Kahunas $35–99, FitBudd, My PT Hub "unlimited clients", PT Distinction), a new **hybrid human-coaching tier** (Caliber ~$200, Future $149–199, Trainwell — consumers pay **$150–300/mo for a coach in an app**), and a full comparison matrix. Core finding holds: nobody occupies "capable + all-inclusive + copilot."
- **`Brain/13` — Market & segments.** Concentric markets (coaching software ~$12–16B/16% CAGR is our TAM; wrapped by online-fitness →$120B, wearables ~$100B, nutrition apps, creator economy ~$250B — **not additive**). Supply: **~740k trainers worldwide**, overwhelmingly solo/micro-businesses; online = 45% of delivery. Two-sided segmentation (trainer types × client types); wedge = full-time solo + creator-coach.
- **`Brain/14` — Business models & GTM.** Nine monetization models; the incumbent pattern is "per-seat + extract via add-ons/skim." Unit economics: B2B SaaS CAC ~$1,680 (SMB $200–700, PLG ~$420), LTV:CAC ≥3:1 (only 44% hit it), payback ~6.8mo → at ~$49 ACV **only PLG/referral/free-funnel math closes**, making the Solo→Coach funnel a unit-economics requirement. Coaching ROI: online coaches charge $75–200/hr, cap at $6–11k/mo → a tool that prevents one churned client pays for itself 3×.
- **`Brain/15` — Tech, AI, science, compliance.** AI taxonomy → workout-generation is commoditized to free; **trainer decision-support is the whitespace** (and mostly deterministic arithmetic + LLM narrative, cheap to build). Build-vs-buy table (buy wearables via Terra $399–499/mo / Rook / Spike; buy food-scan; **build** churn scoring + copilot). Behavioral science grounds retention features in habit loops + SDT + loss aversion. Compliance floor: mostly **outside HIPAA** as D2C, but GDPR Art. 9 explicit consent, US state consumer-health-data laws, FTC breach + health-claims rules apply — consent/export/delete/breach-plan are pre-scale, not v1, requirements.
- **`Brain/16` — Synthesis.** The space as a 5-layer stack (data/device → consumer → human-D2C → **coaching platform (us)** → creator/marketplace); the true whitespace is the **intersection** of lovable client app + decision-support AI + honest all-in price; master source index lives here.

Method note: ~12 targeted web searches total (reused the 2026-07-08 scan's pricing/AI/churn/Terra data rather than re-pulling), no multi-agent harness — deliberate cost discipline per founder direction.

## Interview Template

Date:

Participant:

Role: Trainer / Client / Gym Owner / Other

Key quotes:

- TBD

Pain points:

- TBD

Feature requests:

- TBD

Implications:

- TBD

