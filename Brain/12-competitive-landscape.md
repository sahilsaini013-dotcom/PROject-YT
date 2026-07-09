# Competitive Landscape & Market Research

_Compiled 2026-07-08, expanded 2026-07-09. First formal competitive scan for Training Hub (the Research Log was previously empty). All prices are US, as advertised on the dates cited, and drift over time — re-verify before quoting externally. Review/forum claims are labeled as **sentiment**, not fact._

> **This is the competitor doc.** It sits in a four-part landscape set: **`Brain/13`** (market size & segments), **`Brain/14`** (business models & GTM / unit economics), **`Brain/15`** (tech, AI, behavioral science, compliance), and **`Brain/16`** (whole-space synthesis + master source index). Strategy in `Work Tracking/13-strategy-brief.md`; ranked features in `Work Tracking/14-opportunity-backlog.md`._

## 1. Market context — big, growing, AI-anxious

- **Fitness training software** is valued at **~$12.45B in 2026**, projected to **~$46.46B by 2035 (15.8% CAGR)**. The broader **online/virtual fitness** market is projected to reach **~$120B by 2031** (~27% CAGR). North America holds >40% share. [businessresearchinsights.com; researchnester.com]
- **Hybrid coaching is now the default:** ~48% of coaches run both in-person and online as their main model. [Everfit / trainerize industry reports]
- **AI is the #1 named trend but trust is the constraint:** ~67% of trainers name AI/automation the top trend; a FitBudd 2026 report found **91% of coaches now use AI** (59% daily) — yet **77% agree AI can never replace a human coach**, the survey's strongest consensus. Clients value "guidance during workouts, immediate adaptation, and consistent accountability" plus *empathy* — the parts generic AI can't fake. [fitbudd.com; azbigmedia.com]

**Implication:** the market rewards AI that makes a *human* coach better, and penalizes AI that feels like it's replacing them. That is precisely Training Hub's founding stance (DEC-003; `Brain/04-ai-coaching-brain.md`).

## 2. The competitive set

### Tier 1 — trainer coaching platforms (our direct market)

| Platform | Who it's for | Strengths | Soft spots (our openings) |
|---|---|---|---|
| **ABC Trainerize** | The incumbent; solo → studio → enterprise | Huge ecosystem, branded app, integrated payments, "AI Workout Builder," habits | Nutrition is a **+$45/mo add-on**; gets pricey fully-loaded; can feel heavy for a solo PT |
| **TrueCoach** | 1:1 remote coaches | Fast free-form programming, 3,000+ video library, **client video feedback** (loved) | **New 5% payment fee**; **weak nutrition** (docs + MyFitnessPal); steep 20→50 client price jump; English-only; no true white-label |
| **Everfit** | Value/feature leader, 200k+ coaches | AI Workout Builder, **MacroSnap AI food scan**, wearables, community, habits; best-rated client app | **Add-on stacking** (meals $33–39, automation $24, payments $8 ≈ +$65/mo); free tier caps at 5; weaker branding than Trainerize; **no dark mode**, can't take client notes on phone (sentiment) |
| **PT Distinction / My PT Hub / CoachRx / Kahunas / FitBudd** | Various niches (habit-first, powerlifting, white-label) | Each competent in a lane | Fragmented; none owns the "AI copilot + great client app + honest price" combination |

### Tier 2 — AI-forward training (sets the "AI bar")

- **ABC Trainerize / Everfit AI Workout Builder** — generate & auto-progress programs from goals/equipment. **This is now table stakes.**
- **Ray** — real-time **voice** coaching, auto rep-counting, live adaptation. Consumer-facing, but resets expectations for "AI that's actually present."
- **Juggernaut AI, RP Hypertrophy, Dr. Muscle** — algorithmic autoregulation (adjust load/volume from performance). Strong for solo lifters; not trainer-team tools.
- **Academic signal:** ACM DIS 2026, *"Who Gets to Interpret the Workout? User Tensions With AI-Generated Fitness Feedback"* — documents that users resist AI that *interprets* for them. Reinforces: AI should inform the coach, not overrule the human.

**The AI whitespace:** everyone generates *workouts*; almost nobody ships **trainer decision-support** — "who needs attention, who's ready to progress, who's at risk," explainable and trainer-approved. Training Hub already specced exactly this (12 recommendation types + "always show the reason" + approval gates; `ai_recommendations` table live in the schema). This is the differentiated lane.

### Tier 3 — consumer trackers (set the client-app UX & engagement bar)

- **Hevy** — turned logging into a **social network** (follow lifters, like PRs, share workouts), free unlimited; shipped **HevyGPT + an algorithmic AI trainer in Feb 2026**. This is the engagement bar.
- **Strong** — simple, fast, beloved logger; deliberately minimal.
- **Fitbod** — AI-driven solo programming.
- **MyFitnessPal / Cronometer** — the nutrition-logging habit clients already have (integration targets, not competitors).

**Why they matter:** a trainer platform's **client app is its weakest surface** vs these. Whoever gives trainers a Hevy-grade client experience wins the data that feeds everything else (progress, AI, retention).

### Tier 4 — hybrid human+AI D2C coaching (the "coaching is worth $150–300" anchor)

Not direct competitors (they sell to *consumers*, not trainers) — but they matter two ways: they set the **price anchor for what coaching is worth**, and they are **who our trainers' clients defect to** if a trainer's tooling is weak.

- **Caliber** — matches a client to a certified coach in-app; ~$50/mo program-only up to **~$200/mo Premium** (dedicated coach, frequent comms). Athletech has openly floated that in the AI age **human coaching becomes a luxury tier** — Caliber leans into that.
- **Future** — **$149/mo** standard, **$199/mo** elite coach; premium 1:1 human coaching via app.
- **Trainwell** (formerly CoPilot) — real human trainer matched to the client; positioned squarely on "a real human, not AI."

**Read:** consumers pay **$150–300/mo for a coach delivered through good software.** That is the value a great trainer platform indirectly unlocks for *our* customers — and the reason "help the trainer keep clients" is worth building.

### Comprehensive competitor matrix

| Platform | Layer | Headline price | Nutrition | AI posture | Client-app strength | Standout gap |
|---|---|---|---|---|---|---|
| **Trainerize** | Coach SaaS | ~$135/mo Pro-50 + $45 nutrition | Add-on (+$45) | AI Workout Builder | Strong, branded | Price when fully-loaded |
| **TrueCoach** | Coach SaaS | ~$137/mo @50 **+5% skim** | Weak (docs+MFP) | Minimal | Good (video feedback loved) | Payment skim; nutrition |
| **Everfit** | Coach SaaS | ~$79 base **+~$65 add-ons** | MacroSnap add-on | AI builder + food scan | Best-rated client app | Add-on stacking; no dark mode |
| **Kahunas** | Coach SaaS | **$35–99/mo** (Essentials→Ultimate) | Basic; weak meal-planning (sentiment) | Branded-app focus | Branded app, voice notes | Meal planning; AI depth |
| **FitBudd** | Coach SaaS | Pro/Super Pro/Elite (branded app) | Bundled | Publishes AI research; branding-led | Custom-branded app + website | AI copilot depth |
| **My PT Hub** | Coach SaaS | **Unlimited clients** flat-ish | Integrated | Standard | Solid all-in-one | Chat glitches (sentiment) |
| **PT Distinction** | Coach SaaS | Tiered (Capterra-listed) | Integrated | Standard | Customizable | Fragmented niche |
| **Caliber / Future / Trainwell** | Human D2C | **$149–300/mo** | Coach-set | Human-first (anti-AI framing) | Premium 1:1 feel | Not for trainers |
| **Hevy** | Consumer | Free / prosumer | — | HevyGPT + AI trainer (Feb 2026) | **The engagement bar** | No coach side |
| **MacroFactor / Carbon** | Consumer nutrition | Prosumer sub | **Adaptive targets** (the bar) | Algorithmic | Great nutrition UX | Nutrition-only |
| **Training Hub** | Coach SaaS | TBD (flat, all-in proposed) | Simple, **included** | **Decision-support copilot (specced)** | Shipped, dark/native | Copilot not built yet |

_The market splits into "cheap-but-shallow" (Kahunas, some FitBudd tiers) and "capable-but-nickel-and-dimed" (Trainerize, Everfit, TrueCoach). **Nobody occupies "capable + all-inclusive + copilot."**_

## 3. Pricing teardown (fully-loaded, not headline)

Headline prices hide the real bill. At **50 clients with nutrition + automation + payments**:

| Platform | ~All-in monthly @50 clients | Notable extras |
|---|---|---|
| **Everfit** | **~$134–148** | base ~$79 + ~$65 add-ons (meals/automation/payments) |
| **TrueCoach** | **~$137 + 5% of every payment** | 5% processing skim on top; on $6k/mo revenue that's **+$300/mo** |
| **Trainerize** | **~$175–200** | Pro 50 $135 + nutrition $45 + branding setup |

Everyone either **stacks add-ons** or **skims payments**. **Pricing whitespace = one honest, flat price with nutrition + AI *included* and no revenue skim.** [assistantcoach.fit hidden-fees + real-cost breakdowns; trainerize.com/pricing; blog.everfit.io]

## 4. Trainer pain points (why they churn) — sentiment

From G2 / Capterra / comparison reviews:
- **Add-on fatigue & fees** — nutrition/automation/payment surcharges; TrueCoach's new 5% fee is a fresh irritant.
- **Weak nutrition** where it's a bolt-on (TrueCoach docs + MFP).
- **Client-app friction** — the surface clients actually touch is often the weakest (no dark mode, thin mobile note-taking on Everfit; sentiment).
- **Branding/white-label gaps** — Everfit weaker than Trainerize; TrueCoach Starter has none.
- **Price cliffs** — TrueCoach's 20→50 jump punishes the growing solo PT exactly when margins are thin.

## 5. Client retention — the data that makes the copilot valuable

Retention *is* the trainer's business, and the signals are measurable:
- Fitness apps average **~9.2% monthly churn**; boutique studios lose **7–10%/mo** (aim 3–5%); ~66–80% annual retention benchmark. [retentioncheck.com]
- **The first 90 days decide it** — nearly half of new clients drop before forming a habit. [fitdegree.com; wodify.com]
- **Most predictive churn signal = session frequency in the first two weeks.** Clients doing **<3 workouts in 14 days churn at 3–4×** the rate. A client who checks in **12+ times has only ~2% churn** the next month. [retentioncheck.com; PushPress]
- **Structured onboarding: 87% vs 60%** six-month retention. [Dr. Paul Bedford research, via industry write-ups]
- **Social/accountability features cut monthly churn 20–35%** vs solo-only experiences. [retentioncheck.com]

**Implication:** a copilot that flags at-risk clients inside the 90-day window (the `escalate` / `client_risk_flags` path) is directly tied to trainer revenue — this is the ROI story, not a gimmick.

## 6. Wearables — build vs buy

- **Terra API** normalizes **500+ devices** (Apple Health, Google Fit, Garmin, Fitbit, Oura, WHOOP, Strava, CGM) behind **one integration**, HIPAA-compliant + SOC 2, with a **free WHOOP tier** to start; real-time HR/HRV streaming available. [tryterra.co]
- **Verdict: buy, don't build.** One Terra integration → `wearable_summaries` + `readiness_scores` → feeds the copilot. Recovery/readiness is table stakes for a credible "coaching intelligence" story and is cheap to reach via Terra.

## 7. Where Training Hub already stands

Built & live today (`training-hub-lyart.vercel.app`): programming, workout player w/ PR detection, recovery check-ins, simple nutrition + water, realtime messaging, progress + trainer review, notifications, and a solo **Train tab**. Dark/athletic brand is a small native edge (Everfit lacks dark mode). The **`ai_recommendations` brain is specced and modeled but not built** — it's the single highest-leverage unbuilt asset.

## Sources

- Market size/trends: [businessresearchinsights.com](https://www.businessresearchinsights.com/market-reports/fitness-training-software-market-107349) · [researchnester.com](https://www.researchnester.com/reports/personal-training-software-market/3779) · [Everfit 2026 trends](https://blog.everfit.io/personal-training-trend)
- AI adoption/attitudes: [FitBudd AI Coaching Report](https://www.fitbudd.com/fitness-industry-trends/ai-fitness-coaching-report) · [azbigmedia.com](https://azbigmedia.com/lifestyle/fitbudd-report-finds-91-of-fitness-coaches-now-use-ai/) · [ACM DIS 2026](https://dl.acm.org/doi/10.1145/3800645.3812922)
- Pricing: [assistantcoach.fit hidden fees](https://assistantcoach.fit/blog/hidden-fees-fitness-coaching-software/) · [assistantcoach.fit real cost](https://assistantcoach.fit/blog/real-cost-fitness-coaching-software/) · [trainerize.com/pricing](https://www.trainerize.com/pricing/) · [blog.everfit.io comparison](https://blog.everfit.io/everfit-vs-trainerize-vs-truecoach)
- TrueCoach reviews: [coachway.io](https://coachway.io/articles/truecoach-review/) · [promealplan.com](https://www.promealplan.com/en/blog/truecoach-review-2026) · [exercise.com](https://www.exercise.com/grow/truecoach-review/)
- Everfit reviews: [promealplan.com](https://www.promealplan.com/en/blog/everfit-review-2026) · [quickcoach.fit alternatives](https://www.quickcoach.fit/everfit-alternatives-2026.html) · [Capterra](https://www.capterra.com/p/202837/Everfit/reviews/)
- Consumer bar: [Hevy features](https://www.hevyapp.com/features/) · [prpath.app Hevy vs Strong](https://prpath.app/blog/strong-vs-hevy-2026.html) · [Ray](https://www.rayfit.com/blog/2026/02/best-ai-personal-trainer-app/)
- Retention/churn: [retentioncheck.com](https://retentioncheck.com/churn-benchmarks/fitness-apps) · [fitdegree.com 90-day](https://www.fitdegree.com/post/how-to-build-a-90-day-member-retention-system-for-your-boutique-studio) · [wodify.com](https://www.wodify.com/blog/behind-the-numbers-90-day-client-retention)
- Wearables: [tryterra.co](https://tryterra.co/) · [Terra integrations](https://tryterra.co/integrations)
