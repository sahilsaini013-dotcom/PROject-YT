# Landscape Synthesis — The Whole Space on One Page

_Compiled 2026-07-09. This is the **map of the whole fitness/coaching-tech space** and where Training Hub sits in it. It stitches together the four research threads: competitors (`Brain/12`), market & segments (`Brain/13`), business models & GTM (`Brain/14`), and tech/AI/science/compliance (`Brain/15`). Read this first; drill into the others for evidence. Strategy recommendations are in `Work Tracking/13-strategy-brief.md`; ranked features in `Work Tracking/14-opportunity-backlog.md`._

## 1. The space in one taxonomy

The fitness/coaching-tech world sorts into **five layers**, each with its own buyer, model, and moat:

```
┌─────────────────────────────────────────────────────────────────┐
│ 5. CREATOR / MARKETPLACE LAYER                                   │
│    Challenges, communities, template/meal-plan sales             │
│    Buyer: audiences · Model: productized offers · $250B economy  │
├─────────────────────────────────────────────────────────────────┤
│ 4. COACHING-PLATFORM LAYER  ◄── TRAINING HUB PLAYS HERE          │
│    Trainerize, TrueCoach, Everfit, Kahunas, FitBudd, My PT Hub…  │
│    Buyer: trainers · Model: per-seat SaaS · ~$12–16B, ~16% CAGR  │
├─────────────────────────────────────────────────────────────────┤
│ 3. HUMAN-COACHING D2C LAYER                                      │
│    Caliber, Future, Trainwell · real coach in-app · $150–300/mo  │
│    (our customers would otherwise lose these clients to these)   │
├─────────────────────────────────────────────────────────────────┤
│ 2. CONSUMER APP LAYER (sets the UX & engagement bar)             │
│    Hevy, Strong, Fitbod (training) · MyFitnessPal, MacroFactor,  │
│    Cronometer, Carbon (nutrition) · freemium/prosumer            │
├─────────────────────────────────────────────────────────────────┤
│ 1. DATA / DEVICE LAYER (integration substrate)                   │
│    WHOOP, Oura, Garmin, Apple/Google Health · aggregated by      │
│    Terra / Rook / Spike · $90–100B+ wearables market             │
└─────────────────────────────────────────────────────────────────┘
```

Training Hub lives in **Layer 4** but must **borrow Layer 2's UX**, **integrate Layer 1** (via an aggregator), **beat Layer 3's economics for the trainer**, and can **extend into Layer 5** later. Nobody currently owns the seam between these layers — that seam is the opportunity.

## 2. The five things that are true across the whole space

1. **AI is universal but trust-constrained.** 91% of coaches use it; 77% say it can't replace them. Workout generation is commoditized to *free*. → Compete on **assist-the-coach AI**, not generation.
2. **The client app is every trainer platform's weakest surface.** Consumer apps (Hevy) out-love them on the surface clients actually touch. → **Client-app quality is an unguarded flank.**
3. **Retention is measurable, mechanistic, and mostly ignored in-product.** The 14-day/90-day window, 3–4× churn signals, 20–35% social lift — all known, almost none surfaced as a *coaching action*. → **Decision-support on retention is open whitespace.**
4. **Incumbents monetize by friction** (add-on stacks, 5% skims) on a segment (solo hybrid trainers) with thin margins and real price-cliff pain. → **Honest flat pricing is a positioning weapon**, not just a price.
5. **The economics force product-led growth.** At a ~$49 ACV, paid acquisition math doesn't close; only free-funnel + referral + client-app virality do. → **The Solo→Coach funnel is a unit-economics requirement, not a feature.**

## 3. Where value pools vs. where it's commoditized

| Commoditized (don't compete here) | Value pools (compete/build here) |
|---|---|
| Workout generation (free via ChatGPT/HevyGPT) | Recurring trainer subscription (protected by data gravity + AI reliance) |
| Basic logging (consumer apps give it away) | Trainer decision-support AI (nobody ships it well) |
| One-off program sales | Client-app engagement → data density → AI fuel |
| Device SDKs (aggregators solved this) | Retention outcomes (directly = trainer revenue) |
| Static macro targets | Adaptive nutrition + bundled (vs. add-on) |

## 4. The true whitespace (intersection, not any single feature)

No incumbent owns **all three** of these at once:

> **(a) a client app clients actually love** + **(b) decision-support AI that tells the trainer who needs them today** + **(c) one honest all-in price with no skim.**

Each individually exists somewhere; the **combination is unclaimed**, and Training Hub is already partly built for all three (client app shipped; `ai_recommendations` specced+modeled; pricing is a decision, not a build). That intersection *is* the strategy.

## 5. Where Training Hub sits today (honest scorecard)

| Dimension | State | vs. the space |
|---|---|---|
| Client app | Shipped (logger, player, PRs, check-ins, messaging, progress) | Competitive; needs streaks/social to reach Hevy-grade |
| Trainer dashboard | Shipped (roster, programming, review, messaging) | At parity |
| Decision-support AI | **Specced + modeled, not built** | **The gap = the differentiator** |
| Nutrition | Simple (targets, meal/water log) | Behind Everfit MacroSnap; bundling is the edge |
| Wearables | Not integrated | Behind; cheap to close via Terra |
| Pricing/positioning | Undecided | The honest-pricing wedge is unused |
| Brand | Dark/athletic, native | Small real edge (Everfit lacks dark mode) |

**The single highest-leverage move:** build the `ai_recommendations` copilot (churn radar → review inbox → weekly summaries), because it is (a) the whitespace, (b) mostly assembling already-modeled pieces, and (c) the thing that ties AI to trainer *revenue*.

## 6. Risks the whole-space view surfaces

- **Incumbent scale** (Everfit 200k coaches) — countered by position, not feature-count.
- **AI-inference cost inside flat pricing** — the one economic risk to validate before locking numbers (`Brain/14 §4`).
- **AI trust** — mitigated by the assist-not-replace spec (always-explain, approval gates).
- **Compliance creep** (GDPR Art. 9, state consumer-health-data laws, FTC) — not a v1 blocker, but explicit consent + data export/delete + breach plan are pre-scale requirements (`Brain/15 §4`).
- **Solo cannibalization** — mitigated by keeping Solo intentionally thinner + the upgrade path.

## 7. Master source index

All external evidence for the four-thread landscape, grouped. Prices/figures are as-published on cited dates and drift — re-verify before external use.

**Market sizing & trends** — [businessresearchinsights.com (software)](https://www.businessresearchinsights.com/market-reports/fitness-training-software-market-107349) · [researchnester.com](https://www.researchnester.com/reports/personal-training-software-market/3779) · [thebusinessresearchcompany.com (online/virtual)](https://www.thebusinessresearchcompany.com/report/online-virtual-fitness-global-market-report) · [futuremarketinsights.com (trainers)](https://www.futuremarketinsights.com/reports/personal-fitness-trainer-market) · [trainerize.com industry stats](https://www.trainerize.com/blog/personal-trainer-industry-statistics/) · [businessresearchinsights.com (nutrition apps)](https://www.businessresearchinsights.com/market-reports/nutrition-apps-market-113878) · [media.market.us (nutrition stats)](https://media.market.us/diet-and-nutrition-apps-statistics/) · [grandviewresearch.com (wearables)](https://www.grandviewresearch.com/industry-analysis/wearable-technology-market) · [towardshealthcare.com (fitness tracker)](https://www.towardshealthcare.com/insights/fitness-tracker-market-sizing) · [athletechnews.com (WHOOP/Oura)](https://athletechnews.com/wearables-fastest-growing-consumer-tech-products-search-data-oura-garmin/)

**Competitors & pricing** — [assistantcoach.fit hidden fees](https://assistantcoach.fit/blog/hidden-fees-fitness-coaching-software/) · [assistantcoach.fit real cost](https://assistantcoach.fit/blog/real-cost-fitness-coaching-software/) · [trainerize.com/pricing](https://www.trainerize.com/pricing/) · [blog.everfit.io comparison](https://blog.everfit.io/everfit-vs-trainerize-vs-truecoach) · [Kahunas @ GetApp](https://www.getapp.com/recreation-wellness-software/a/kahunas/) · [FitBudd pricing](https://www.fitbudd.com/pricing) · [My PT Hub vs Kahunas @ Software Advice](https://www.softwareadvice.com/compare/34714-my-pt-hub/vs/527646-Kahunas/) · [PT Distinction @ Capterra](https://www.capterra.com/p/141155/PT-Distinction/pricing/) · [promealplan.com Kahunas review](https://www.promealplan.com/en/blog/kahunas-review-2026) · [corahealth.app Caliber](https://www.corahealth.app/compare/caliber) · [corahealth.app Future](https://www.corahealth.app/compare/future) · [barbend.com Caliber](https://barbend.com/caliber-fitness-app-review/) · [hevyapp features](https://www.hevyapp.com/features/) · [rayfit.com](https://www.rayfit.com/blog/2026/02/best-ai-personal-trainer-app/)

**AI adoption & attitudes** — [FitBudd AI Coaching Report](https://www.fitbudd.com/fitness-industry-trends/ai-fitness-coaching-report) · [azbigmedia.com](https://azbigmedia.com/lifestyle/fitbudd-report-finds-91-of-fitness-coaches-now-use-ai/) · [ACM DIS 2026](https://dl.acm.org/doi/10.1145/3800645.3812922) · [welling.ai AI fitness apps](https://www.welling.ai/articles/best-ai-fitness-apps) · [yourappland.com AI food scan](https://yourappland.com/best-ai-food-scanning-apps/)

**Business model / unit economics / GTM** — [ltvcacbook.com CAC 2026](https://ltvcacbook.com/blog/cac-benchmarks-2026) · [userpilot.com CAC](https://userpilot.com/blog/average-customer-acquisition-cost/) · [saashero.net LTV:CAC](https://www.saashero.net/strategy/b2b-saas-ltv-cac-benchmarks/) · [saasbuyerguide.com unit economics](https://saasbuyerguide.com/saas-unit-economics-2026-cac-ltv-payback-period-benchmark-guide/) · [communipass.com creator monetization](https://communipass.com/blog/fitness-influencer-monetization-benchmarks-2026/) · [trainerize.com marketing](https://www.trainerize.com/blog/personal-trainer-marketing/) · [firstrep.fit get clients](https://firstrep.fit/blog/how-to-get-more-personal-training-clients)

**Retention / behavioral science** — [retentioncheck.com](https://retentioncheck.com/churn-benchmarks/fitness-apps) · [fitdegree.com 90-day](https://www.fitdegree.com/post/how-to-build-a-90-day-member-retention-system-for-your-boutique-studio) · [wodify.com](https://www.wodify.com/blog/behind-the-numbers-90-day-client-retention)

**Wearables / integration** — [tryterra.co pricing](https://tryterra.co/pricing) · [tryrook.io competitors](https://www.tryrook.io/competitors) · [openwearables.io compare](https://openwearables.io/compare) · [themomentum.ai build-vs-buy](https://www.themomentum.ai/blog/the-real-cost-of-wearables-integration-in-2025-build-vs-buy-analysis)

**Compliance** — [accountablehq.com HIPAA](https://www.accountablehq.com/post/do-fitness-apps-need-to-be-hipaa-compliant-when-it-applies-and-when-it-doesn-t) · [themomentum.ai GDPR health](https://www.themomentum.ai/blog/gdpr-consent-requirements-health-data) · [newagesysit.com FTC/app-store](https://newagesysit.com/blog/ftc-guidelines-app-store-health-data-rules-for-fitness-platforms-in-the-united-states/)
