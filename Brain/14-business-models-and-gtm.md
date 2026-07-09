# Business Models & Go-To-Market — How Money & Customers Move

_Compiled 2026-07-09. Companion to `Brain/12` (competitors) and `Brain/13` (market). This doc maps **every way players in this space make money, what the unit economics look like, and how customers are actually acquired.** Pricing recommendations live in `Work Tracking/13-strategy-brief.md §4`; this is the underlying model analysis._

## 1. The monetization models in this space

Nine distinct models are in play. Most players combine two or three.

| Model | How it works | Who uses it | Note for us |
|---|---|---|---|
| **Per-seat SaaS subscription** | Trainer pays monthly, tiered by client count | Trainerize, TrueCoach, Everfit, Kahunas, FitBudd | Our core. The question is *flat vs. per-client tiers*. |
| **Add-on stacking** | Base + paid modules (nutrition, automation, payments) | Trainerize (+$45 nutrition), Everfit (~+$65) | **The thing we position against.** |
| **Payment skim** | % of trainer↔client payments | TrueCoach (5%) | The other thing we position against. |
| **B2C prosumer subscription** | Consumer pays for the app directly | Strong, Hevy, Fitbod, MacroFactor | Adjacent; our "Solo" free tier is a funnel, not this. |
| **Human-coaching subscription** | App bundles a *real* assigned coach | Caliber ($200/mo premium), Future ($149–199/mo), Trainwell | Premium ceiling; shows what "coaching" can command. |
| **Wearable hardware + subscription** | Device (or free device) + monthly insight fee | WHOOP ($30/mo, no upfront HW), Oura (ring + sub) | Proves people pay monthly for *insight*, not just data. |
| **Freemium → premium** | Free logging, pay for AI/advanced | Hevy, Fitbod, most consumer apps | Our Solo→Coach funnel logic. |
| **Creator productized offers** | Challenges, communities, digital products | Creator-coaches (via CommuniPass-type stacks) | Phase-4 marketplace angle. |
| **Marketplace / template sales** | Sell programs/meal plans to other coaches or clients | Various; `is_template` flag exists in our schema | Phase-4 growth lever. |

**Structural read:** the incumbents monetize the *trainer* via per-seat SaaS but then **extract more through add-ons or skims** — which is exactly the resented surface. The premium human-coaching apps show coaching itself commands **$150–300/mo** from consumers, which sizes how much value a *great* trainer platform indirectly creates.

## 2. Pricing architecture — the strategic fork

Two viable shapes for a coaching platform:

- **(A) Per-client tiers** (incumbent norm): revenue scales with the trainer's roster. Pro: captures upside from big rosters. Con: **price cliffs** (TrueCoach's 20→50 jump) that punish growth exactly when the solo PT's margins are thinnest — the #1 pricing complaint.
- **(B) Flat, all-inclusive tiers** (our proposed wedge): one price, nutrition + AI included, no skim. Pro: **honesty as positioning**, no cliffs, predictable. Con: leaves some big-roster upside on the table; flat price must survive per-client AI inference cost.

**Recommendation** (see strategy brief §4): flat, roster-capped tiers (Free / ~$49 Coach / ~$99 Studio) with everything included and **no payment skim** — undercuts fully-loaded Everfit (~$134–148 @50) and Trainerize (~$175–200 @50) while reading premium. The one risk to validate: **unit economics of AI inference per active client** must fit inside the flat price (see §4).

## 3. Unit economics — the numbers that decide viability

From 2026 SaaS benchmarks (general B2B SaaS; coaching-specific data is scarce, so these are the reference frame):

- **CAC:** average B2B SaaS **~$1,680/customer** (up 12% YoY). But by motion: **self-serve / PLG ≈ $420**, SMB **$200–700**, mid-market ~$1,680, enterprise ~$9,400. → A solo-trainer product **must be PLG/self-serve** (target CAC in the low hundreds); we cannot afford a sales team at a ~$49/mo ACV. [ltvcacbook.com; userpilot.com]
- **LTV:CAC:** healthy is **≥3:1**; elite **4:1+**. Only **~44% of SaaS companies actually hit 3:1**. [saashero.net]
- **CAC payback:** median **~6.8 months**; under 12 is healthy. [saasbuyerguide.com]
- **What this means at ~$49/mo:** annual revenue/customer ≈ $588. To clear 3:1 LTV:CAC with, say, a 2-year lifetime (~$1,400 LTV), **CAC must stay under ~$470** — achievable *only* via low-cost channels (content, referrals, the free-solo funnel), not paid acquisition. This is why the **Solo→Coach funnel (backlog #6) is not a nice-to-have; it's the unit-economics linchpin.**

### The client-side ROI (why trainers will pay)

The trainer's own economics justify the tool: online coaches charge **$75–200/hr**, monthly packages **$400–$1,800**, and the median online coach caps at **$6,000–$11,000/mo** because they can't add clients without quality collapse. [communipass.com] → A tool that lets a coach hold more clients *without* quality collapse (via AI leverage + retention) directly raises their ceiling. **A ~$49/mo tool that saves one churned $150/mo client pays for itself 3×.** That is the ROI pitch, and it's why the churn-radar copilot (backlog #1) is the flagship.

## 4. The one economic risk to validate

Flat pricing + included AI means **AI inference cost is a per-active-client variable cost inside a fixed price.** If a Studio trainer with 75 active clients triggers weekly AI summaries + daily risk scoring, inference cost could erode margin. Mitigations: batch/schedule inference (weekly, not real-time), use cheaper models for routine scoring and reserve premium models for summaries, cap AI actions per tier ("priority AI" on Studio). **Validate this before locking the numbers** (flagged in strategy brief §7).

## 5. Go-to-market — how customers are actually acquired

Trainers are **not acquired by ads**; they're acquired by trust. The 2026 channel reality for reaching solo trainers: [trainerize.com; mypthub.net; firstrep.fit]

1. **Word of mouth / referral** — the single most trusted channel; a *structured* referral program turns it from luck into a system. → Build referral in from day one (trainer refers trainer; both get a perk).
2. **Content / educational social** — trainers follow trainers; useful content (programming, retention, business) earns trust and inbound.
3. **Local SEO / Google Business Profile / marketplaces** — how clients find trainers, indirectly how trainers evaluate tools.
4. **Email** — still highest-ROI for nurturing trials → paid.
5. **The product itself as the channel** — the **Solo→Coach funnel** and **client-side virality** (a client who loves the app asks *other* trainers about it, or becomes a lead). This is the cheapest channel and compounds.

**GTM synthesis:** at a ~$49 ACV the *only* sustainable acquisition is **product-led + community-led** — free solo funnel, in-product referral, client-app virality (Hevy's playbook), and founder-as-content. Paid acquisition math doesn't close. This reinforces every "make the client app lovable" and "build the funnel" item in the backlog.

## 6. Competitor business-model teardown (positioning map)

| Player | Primary model | Monetization pressure they create | Our counter |
|---|---|---|---|
| **Trainerize** | Per-seat + nutrition add-on | Nutrition +$45; fully-loaded ~$175–200 | All-in flat price |
| **TrueCoach** | Per-seat + 5% skim | Skim scales with *their* success | "We never take a cut" |
| **Everfit** | Per-seat + add-on stack | ~+$65 in add-ons | Everything included |
| **Kahunas / FitBudd** | Per-seat, branded-app focus | Cheaper base, branding upsell | Match branding, beat on AI copilot |
| **Caliber / Future** | B2C human-coaching sub | Not a direct competitor; sets the "coaching is worth $150–300" anchor | We power the coaches who'd otherwise lose to these |
| **Hevy** | B2C freemium | Free client-side logging | We match the logger, add the coach |

## Sources

- Unit economics / CAC / LTV: [ltvcacbook.com CAC benchmarks 2026](https://ltvcacbook.com/blog/cac-benchmarks-2026) · [userpilot.com average CAC](https://userpilot.com/blog/average-customer-acquisition-cost/) · [saashero.net LTV:CAC](https://www.saashero.net/strategy/b2b-saas-ltv-cac-benchmarks/) · [saasbuyerguide.com unit economics](https://saasbuyerguide.com/saas-unit-economics-2026-cac-ltv-payback-period-benchmark-guide/)
- Coaching income / creator economics: [communipass.com monetization benchmarks 2026](https://communipass.com/blog/fitness-influencer-monetization-benchmarks-2026/)
- Human-coaching pricing anchors: [corahealth.app Caliber](https://www.corahealth.app/compare/caliber) · [corahealth.app Future](https://www.corahealth.app/compare/future) · [barbend.com Caliber](https://barbend.com/caliber-fitness-app-review/)
- GTM / acquisition channels: [trainerize.com marketing](https://www.trainerize.com/blog/personal-trainer-marketing/) · [mypthub.net marketing](https://www.mypthub.net/blog/personal-training-marketing/) · [firstrep.fit get clients](https://firstrep.fit/blog/how-to-get-more-personal-training-clients)
- Pricing teardown detail: see `Brain/12-competitive-landscape.md §3` and its sources.
