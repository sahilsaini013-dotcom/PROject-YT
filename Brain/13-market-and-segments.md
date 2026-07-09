# Market Size & Segments — The Whole Space

_Compiled 2026-07-09. Companion to `Brain/12-competitive-landscape.md` (competitor teardowns) and `Work Tracking/13-strategy-brief.md` (the "so what"). This doc maps **how big the space is, how it segments, and who the humans are.** Figures are as-published on the cited dates and drift — treat ranges, not single numbers, as the truth. Where sources disagree (they do, a lot, because they define "the market" differently) the disagreement is shown, not hidden._

## 0. How to read market numbers in this space (a warning)

Every vendor-adjacent "market report" defines its market to flatter its own TAM. "Fitness app market," "online fitness market," "personal training software market," "personal fitness trainer market," and "wearables market" overlap heavily and are **not additive**. Use them for *order of magnitude and direction*, never for a precise sum. The honest read: **Training Hub's directly-addressable market is the coaching-software slice (~$12–16B and growing mid-teens %), sitting inside a much larger fitness-tech economy that is the pool of adjacent features and integrations.**

## 1. The concentric markets (smallest/most-relevant → largest/most-adjacent)

| Ring | What it is | Size (2026) | Growth | Relevance to us |
|---|---|---|---|---|
| **Coaching/PT software** (our ring) | Tools trainers buy to run clients | **~$12.45B**, → ~$46B by 2035 (**15.8% CAGR**) | High | **This is our TAM.** Direct competitors live here. |
| **Personal-training services** | The trainers' own businesses (what they sell) | **~$13.9B (2025) → ~$15.6B (2026)**; US alone ~$11.9B (IBISWorld) | Mid | Our customers' revenue pool — sizes their willingness to pay. |
| **Nutrition / calorie apps** | MyFitnessPal, Cronometer, MacroFactor, et al. | Definitions vary wildly: "nutrition apps" ~$0.49B (2026) → $1.23B by 2034 (10.9% CAGR); broader "calorie-counter" framing ~$4.14B (2026, 9.3%) | Mid | An **adjacent feature** we bundle, and integration targets. |
| **Online / virtual fitness** | All digitally-delivered fitness | → **~$120B by 2031** (~27% CAGR) | Very high | The tide we ride; sets consumer UX expectations. |
| **Wearables / trackers** | WHOOP, Oura, Garmin, Apple/Samsung | **~$92.9B (2025) → ~$103B (2026)**; "fitness tracker" slice ~$84.9B (2026, 18% CAGR) | High | **Integration layer** (via Terra), not a market we enter. |
| **Creator / influencer economy** | Content-led coaching businesses | Creator economy → **~$250B by mid-decade**; influencer-marketing spend **>$32B (2026)** | Very high | A **customer segment** (creator-coaches) and a Phase-4 marketplace angle. |

**Takeaway:** we compete in a ~$12–16B ring growing ~16%/yr, but every ring around it is a source of features to bundle (nutrition, wearables) or customers to win (creator-coaches). The strategic art is staying focused on the coaching ring while *borrowing UX and integrations* from the bigger rings.

## 2. The supply side — how many trainers, and who are they

- **~740k personal trainers worldwide** (up from 596k in 2016, ~4.4% CAGR), and **~728k PT businesses** — i.e. the market is overwhelmingly **sole proprietors and micro-businesses**, not gyms. [futuremarketinsights.com; trainerize.com]
- **~330k fitness trainers/instructors employed in the US** by official count — but this **undercounts** independents and online-only coaches, who fall outside employment stats. The true independent population is larger. [trainerize.com]
- **Delivery mix has permanently shifted:** online/virtual formats hold **~45% of global share (2026)**; **~48% of coaches run hybrid** (in-person + online) as their primary model vs ~32% online-only, ~14% in-person-only. [thebusinessresearchcompany.com; Everfit trends]

**Implication for us:** the customer is a **solo, hybrid, mobile-first trainer with 1–50 clients** — exactly the segment punished by incumbents' price cliffs and add-on stacking. The market is wide (hundreds of thousands of micro-businesses) and under-consolidated. There is no "Salesforce of coaching" yet.

## 3. Customer segmentation — the two-sided market

Training Hub is two-sided: we sell to **trainers** (payers) who serve **clients** (users). Both need mapping.

### 3a. Trainer segments (our buyers)

| Segment | Profile | Clients | Pain / need | Fit for us |
|---|---|---|---|---|
| **Side-hustle PT** | Newly certified, gym-floor + a few online | 1–10 | Cheap, simple, one app; hates per-add-on billing | **Free→Coach funnel entry** |
| **Full-time solo coach** | Coaching is the business; hybrid | 10–50 | Time leverage, retention, professional client app | **Core ICP** |
| **Creator-coach / influencer** | Audience-led; sells challenges + coaching | 50–500+ | Scale without quality collapse; branding; productized offers | **High-value; marketplace angle** |
| **Micro-studio / small team** | 2–5 coaches, shared roster | 50–150 | Team seats, consistency, oversight | **Studio tier** |
| **Enterprise gym chain** | Multi-location | 100s–1000s | Integrations, admin, SSO | **Not now** (out of scope) |

**The wedge is the middle two rows** (full-time solo + creator-coach): enough clients to feel retention pain and pay for leverage, too small to be served by enterprise sales. Creator-coaches are especially interesting because their income is shifting from ad revenue (60%→34% of earnings in two years) to **productized coaching, challenges, and digital products (now ~49%)** — they *need* coaching infrastructure and own their audience. [communipass.com]

### 3b. Client segments (our users — who trainers coach)

| Client type | What they want | Retention lever |
|---|---|---|
| **Habit-builder / beginner** | Structure, accountability, not to feel lost | 90-day danger window; streaks; check-ins |
| **Committed lifter** | Progress tracking, PRs, autonomy | Great logger (Hevy-grade), data density |
| **Body-comp / weight-loss** | Nutrition guidance + adherence | Simple macro/meal logging, adaptive targets |
| **Longevity / recovery-minded** | Readiness, sleep, "am I overdoing it" | Wearables/readiness (Terra) |

**The client app must serve all four with a single, un-cluttered surface** — this is the design tension the trainer platforms lose to consumer apps.

## 4. Trends shaping the next 3 years (with a "so-what" each)

1. **AI everywhere, trust nowhere.** 91% of coaches use AI, 77% say it can't replace them. → Assist-not-replace is the durable position (see `Brain/12` §1, `Brain/04`).
2. **Hybrid is permanent.** Online is 45% of delivery and rising. → The client app is now the *primary* touchpoint, not an add-on. Invest there.
3. **Longevity / recovery / readiness** is the fastest-rising consumer motivation, pulled by WHOOP ($10.1B valuation, 1.2M subs) and Oura ($500M ARR). → Wearable readiness is becoming table stakes for a credible "coaching intelligence" story.
4. **Creator economy eats coaching.** Income is shifting to productized coaching + challenges; completion rates for well-designed challenges run 60–85% (vs courses). → Group challenges / cohorts are a retention *and* acquisition engine (Phase 4 backlog #11).
5. **Nutrition goes AI-photo.** SnapCalorie/PlateLens/Welling-class photo→macro is now consumer-expected. → Nutrition depth (backlog #8) has a clear, buyable pattern.
6. **Wearable/health-data consolidation** via aggregators (Terra/Rook/Spike). → Integration is cheap and getting cheaper; no reason to build device SDKs.

## 5. Where the value pools (and where it doesn't)

- **Value pools** in: recurring coaching subscriptions (trainer→client), wearable subscriptions (WHOOP/Oura prove people pay monthly for insight), and productized creator offers (challenges/communities).
- **Value is thin** in: one-off program sales, generic workout generation (commoditized to free via ChatGPT/HevyGPT), and pure logging (consumer apps give it away free).
- **The defensible pool for a coaching platform** is the **recurring trainer subscription**, protected by (a) client-app switching cost / data gravity and (b) AI decision-support the trainer relies on weekly. That is precisely the moat stack in the strategy brief.

## Sources

- Coaching-software & online-fitness sizing: [businessresearchinsights.com](https://www.businessresearchinsights.com/market-reports/fitness-training-software-market-107349) · [researchnester.com](https://www.researchnester.com/reports/personal-training-software-market/3779) · [thebusinessresearchcompany.com — online/virtual](https://www.thebusinessresearchcompany.com/report/online-virtual-fitness-global-market-report)
- Trainer population & PT services: [futuremarketinsights.com](https://www.futuremarketinsights.com/reports/personal-fitness-trainer-market) · [trainerize.com industry stats](https://www.trainerize.com/blog/personal-trainer-industry-statistics/) · [trainerize.com 2026 state of PT](https://www.trainerize.com/blog/2026-state-of-personal-training-industry-report/)
- Nutrition-app sizing: [businessresearchinsights.com — nutrition apps](https://www.businessresearchinsights.com/market-reports/nutrition-apps-market-113878) · [media.market.us diet & nutrition stats](https://media.market.us/diet-and-nutrition-apps-statistics/)
- Wearables sizing & players: [grandviewresearch.com](https://www.grandviewresearch.com/industry-analysis/wearable-technology-market) · [gminsights.com](https://www.gminsights.com/industry-analysis/wearables-market) · [towardshealthcare.com fitness tracker](https://www.towardshealthcare.com/insights/fitness-tracker-market-sizing) · [athletechnews.com — WHOOP/Oura](https://athletechnews.com/wearables-fastest-growing-consumer-tech-products-search-data-oura-garmin/)
- Creator economy: [communipass.com monetization benchmarks 2026](https://communipass.com/blog/fitness-influencer-monetization-benchmarks-2026/) · [communipass.com digital products 2026](https://communipass.com/blog/fitness-influencer-digital-products-2026/)
