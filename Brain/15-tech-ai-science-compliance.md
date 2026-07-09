# Technology, AI, Behavioral Science & Compliance

_Compiled 2026-07-09. Companion to `Brain/12–14`. This doc covers the **build layer**: what the AI actually is, how the integration/nutrition/wearable plumbing works, the behavioral-science that makes retention real, and the legal floor. It is deliberately opinionated on **build-vs-buy** so we don't waste a solo founder's time reinventing infrastructure._

## 1. AI in this space — a taxonomy (and where the whitespace is)

AI is a catch-all; the useful question is *which kind, doing what job, with what trust model.*

| AI type | What it does | How it's built | Who ships it | Trust risk |
|---|---|---|---|---|
| **Workout generation** | Goal/equipment → a program | LLM prompt or template engine | Everyone (Trainerize, Everfit, HevyGPT, ChatGPT, Dr. Muscle) | Low stakes, **commoditized to free** |
| **Algorithmic autoregulation** | Adjust load/volume from performance | Deterministic algorithm (not LLM) | Juggernaut, RP, Dr. Muscle, Fitbod | Medium; explainable by design |
| **Real-time in-workout coaching** | Voice cues, rep counting, live adaptation | On-device CV/audio + LLM | Ray, Planfit | UX-heavy; consumer-facing |
| **Food-photo → macros** | Photo/voice → nutrition estimate | Vision model + food DB | SnapCalorie, PlateLens, Welling, Aumaï, Everfit MacroSnap | Accuracy-sensitive; "optional human verify" emerging |
| **Trainer decision-support** ⭐ | "Who needs attention, who's at risk, who's ready" | LLM + rules over behavioral data | **Almost nobody** | **The whitespace** — and the hardest to fake |
| **Conversational client chatbot** | Answers client questions | LLM + retrieval | A few; risky | Can overstep into "interpreting" — users resist (ACM DIS 2026) |

**The strategic point:** the first four are **table stakes or commodities** (buy/wrap them). The differentiated, defensible AI is **trainer decision-support** — and it aligns exactly with the market's stated preference (77% say AI can't replace a coach; they want AI that makes the *coach* better). Training Hub already specced this (`ai_recommendations`, 12 recommendation types, always-show-the-reason, approval gates; `Brain/04-ai-coaching-brain.md`). **This is the single highest-leverage unbuilt asset.**

### Build-vs-buy for AI

- **Buy/wrap** (LLM API): workout generation, weekly summaries, natural-language rationale. Use a capable general model; don't train anything.
- **Build** (cheap, deterministic): the **churn-risk scoring** (rules over `workout_sessions`/`check_ins`: <3 sessions/14 days, logging drop-off, missed check-ins). This is arithmetic, not ML, and it's the flagship — see §3.
- **Buy** (vision API or a food-scan vendor): nutrition photo→macros, when we get to backlog #8. Don't build a food model.

**Cost caveat (ties to `Brain/14 §4`):** LLM inference is a per-active-client variable cost. Batch summaries weekly, use cheap models for routine scoring, reserve premium models for the trainer-facing narrative. Validate margin before flat pricing locks.

## 2. Integrations & data plumbing — buy the boring parts

### Wearables / health data — **buy an aggregator, don't build device SDKs**

One integration → 500+ devices. The 2026 aggregator landscape:

| Aggregator | Pricing (2026, as-published) | Notes |
|---|---|---|
| **Terra** | ~**$399/mo (annual) / $499 (monthly)**, 100k credits (~200 credits/active user/mo → ~$4,800/yr @500 users); overage $0.005/credit | 500+ devices, HIPAA/SOC2, free WHOOP tier, real-time HR/HRV streaming. Most-documented. |
| **Rook** | **$0.50/user/mo, $300 min** (~$3,600/yr floor); volume discounts >1k users | Transparent per-user; cheapest-to-model. |
| **Spike** | **$99–189/mo up to 1,000 users**, then $0.10/user | Aggressively cheap (~75% under Terra for comparable use). |
| **Vital → Junction** | Enterprise/opaque; rebranded, added lab-ordering | Repositioned toward clinical infra. |

**Verdict: start with Terra** (best docs, free WHOOP tier, HIPAA/SOC2, real-time), but **Spike/Rook are materially cheaper** and worth revisiting when active-user volume makes Terra's floor bite. Feed one aggregator → `wearable_summaries` → `readiness_scores` → the copilot. This is backlog #7; recovery/readiness is table-stakes for a credible coaching-intelligence story and cheap to reach.

### Nutrition data — the food-database question

Nutrition depth needs a food DB + (optionally) photo recognition:
- **Food DBs:** MyFitnessPal (20M+ items, largest, but closed/licensing), USDA FoodData Central (free, authoritative, smaller), Open Food Facts (open, barcode-rich), Nutritionix/Edamam (commercial APIs). → For our "simple-first" default, a barcode + a solid open/commercial DB covers the 80%.
- **Photo→macro:** buy a vision API or a scan vendor (backlog #8); don't build. The bar is set by SnapCalorie/PlateLens/Everfit MacroSnap.
- **Adaptive targets:** MacroFactor/Carbon (Layne Norton) set the expectation that macro targets **auto-adjust from real weight/intake trends** — this is an *algorithm*, not ML, and is a strong, cheap differentiator vs. static targets.

### The rest of the stack (already decided — `CLAUDE.md`)

Next.js 15 + Supabase (Postgres/Auth/Realtime/Storage/RLS) + Vercel is the right, cheap, integrated choice for a solo founder. Realtime (messaging) and Storage (private photo buckets, signed URLs) are already in use. No change recommended.

## 3. The behavioral science — why retention features work (not vibes)

Retention *is* the business, and the mechanisms are well-established. The copilot and client-app features map to real science:

- **The habit-formation window is ~90 days**, and **the first two weeks predict everything.** <3 workouts in 14 days → **3–4× churn**; 12+ check-ins/mo → ~2% churn. → *Mechanism:* habit loops (cue→routine→reward) must fire enough times early to become automatic. **This is why the churn radar targets the 14-day/90-day window specifically** — it's intervening exactly where the habit is or isn't forming.
- **Structured onboarding: 87% vs 60%** six-month retention. → *Mechanism:* early structure reduces the cognitive load that causes early drop-off. Our onboarding profile + first-program assignment is this lever.
- **Social/accountability cuts churn 20–35%.** → *Mechanism:* accountability + identity/belonging (Self-Determination Theory: relatedness). Streaks and PR celebration hit *competence*; a coach relationship hits *relatedness*; client choice hits *autonomy* — SDT's three needs, all buildable.
- **Loss aversion & streaks:** people work harder to *not break* a streak than to start one. → Streaks + "12 check-ins = habit locked" cues (backlog #4) are cheap and evidence-backed.

**Design implication:** retention features aren't gamification garnish — they're the operationalization of habit-formation + SDT, and each maps to a measurable churn delta. The copilot's job is to **detect when the mechanism is failing for a specific client and route the human coach to intervene in time.** That's the ROI story, grounded in science, not a gimmick.

### The AI-trust science (the guardrail)

ACM DIS 2026 (*"Who Gets to Interpret the Workout?"*) documents that users **resist AI that interprets for them** — they want to keep interpretive authority. → Reinforces our non-negotiables: AI **informs the coach, never overrules the human**; **always show the reason**; **trainer approves before any client sees it**. This is both an ethics stance and a product-differentiation stance (RISK-003, DEC-003).

## 4. Compliance — the legal floor (know it, don't over-build it)

Fitness/health data has a layered legal regime. The key nuance: **most direct-to-consumer coaching apps are *not* HIPAA-covered** — but that doesn't mean "no obligations."

- **HIPAA:** applies **only** when handling PHI for a Covered Entity as a Business Associate, or inside clinical workflows (e.g. a telehealth/doctor integration). **A trainer↔client coaching app, by itself, is generally outside HIPAA.** → We don't need full HIPAA machinery for v1, but we *should* design as if we might (encryption in transit/at rest, access controls, audit logging) so a future clinical integration isn't a rebuild. [accountablehq.com; sportfitnessapps.com]
- **GDPR (EU users):** health data is **Article 9 "special category"** → requires **explicit consent** (freely given, specific, informed, unambiguous, documented, withdrawable) plus access/rectification/erasure rights. → Consent must be explicit and granular for any health/wearable/mental-health data; build the consent + data-export/delete flows. [themomentum.ai]
- **US state laws:** California/Colorado/Connecticut/Utah/Virginia privacy laws + **"consumer health data" laws (Washington My Health My Data, etc.)** regulate health-adjacent data *outside* HIPAA. → These increasingly bite D2C fitness apps; treat health data as regulated even when HIPAA doesn't apply.
- **FTC Health Breach Notification Rule:** applies to **non-HIPAA** apps holding personal health records — distinct breach-notification duty. → Have an incident-response plan.
- **FTC health-claims substantiation:** calling AI coaching "clinically proven / doctor-recommended / medically effective" triggers the **same evidence bar as any health claim** — the "AI" framing does **not** lower it. → Marketing must avoid unsubstantiated medical claims. This also reinforces the "assist, don't diagnose" product stance.
- **App-store rules:** Apple/Google health-data policies (purpose limitation, no selling health data, HealthKit restrictions) apply on top.

**Our existing invariants already align:** private Storage buckets + signed URLs for photos, no health data in analytics, RLS so clients see only their own data and trainers only their linked clients (`CLAUDE.md`). The gaps to close before scale: **explicit granular consent, data export/delete (GDPR/CCPA), and an incident-response/breach plan.** None are v1 blockers for a small beta, but all are pre-scale requirements — record as an open item.

## 5. Build-vs-buy summary (the one-glance table)

| Capability | Decision | Why |
|---|---|---|
| Wearables/device data | **Buy** (Terra → later Spike/Rook) | 500+ devices, 1 integration, HIPAA/SOC2 |
| Food photo→macros | **Buy** (vision API / scan vendor) | Mature vendors; don't train a food model |
| Food database | **Buy/open** (Nutritionix/Edamam or USDA+OFF) | Licensed/authoritative data |
| Workout generation | **Buy/wrap** (LLM API) | Commoditized |
| Weekly summaries / rationale | **Buy/wrap** (LLM API) | Language task |
| **Churn-risk scoring** | **Build** (deterministic rules) | It's arithmetic; it's the flagship; must be explainable |
| **Copilot orchestration + approval UX** | **Build** (our differentiator) | The moat; already specced |
| Backend infra | **Buy** (Supabase/Vercel) | Already decided; right for solo founder |

## Sources

- AI feature landscape: [welling.ai best AI fitness apps](https://www.welling.ai/articles/best-ai-fitness-apps) · [yourappland.com AI food scanning](https://yourappland.com/best-ai-food-scanning-apps/) · [hevyapp.com HevyGPT](https://www.hevyapp.com/features/hevy-gpt/) · [dr-muscle.com AI generators](https://dr-muscle.com/ai-workout-plan-generator/)
- Wearable aggregators: [tryterra.co pricing](https://tryterra.co/pricing) · [tryrook.io competitors](https://www.tryrook.io/competitors) · [themomentum.ai build-vs-buy](https://www.themomentum.ai/blog/the-real-cost-of-wearables-integration-in-2025-build-vs-buy-analysis) · [openwearables.io compare](https://openwearables.io/compare)
- Behavioral science / retention: see `Brain/12 §5` sources ([retentioncheck.com](https://retentioncheck.com/churn-benchmarks/fitness-apps), [fitdegree.com](https://www.fitdegree.com/post/how-to-build-a-90-day-member-retention-system-for-your-boutique-studio), [wodify.com](https://www.wodify.com/blog/behind-the-numbers-90-day-client-retention)) · AI-trust: [ACM DIS 2026](https://dl.acm.org/doi/10.1145/3800645.3812922)
- Compliance: [accountablehq.com HIPAA for fitness apps](https://www.accountablehq.com/post/do-fitness-apps-need-to-be-hipaa-compliant-when-it-applies-and-when-it-doesn-t) · [themomentum.ai GDPR health consent](https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data) · [newagesysit.com FTC & app-store rules](https://newagesysit.com/blog/ftc-guidelines-app-store-health-data-rules-for-fitness-platforms-in-the-united-states/) · [sportfitnessapps.com HIPAA for fitness/wellness](https://www.sportfitnessapps.com/blog/hipaa-compliance-for-fitness-and-wellness-applications)
