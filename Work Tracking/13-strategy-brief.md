# CEO Strategy Brief — Training Hub

_2026-07-08. Decision-oriented. Evidence lives in `Brain/12-competitive-landscape.md`; this is the "so what." Recommendations are drafts for founder sign-off — the pricing and positioning calls imply DEC-014/015 (see `Work Tracking/04-decision-log.md`)._

## 1. The one-sentence thesis

> **Training Hub is the AI *coaching copilot* for independent trainers — not another workout generator.** We win by pairing a **client app clients actually love** with **decision-support AI that tells the trainer who needs them today**, sold at **one honest price with nutrition + AI included**.

## 2. Why this is the right wedge (from the research)

Three facts, three openings:

1. **"AI writes workouts" is commoditized** (Trainerize, Everfit, even Hevy all ship it), while **77% of coaches say AI can't replace them**. → Don't compete on generation. Compete on **AI that makes the human coach better** — triage, risk flags, weekly summaries — explainable and trainer-approved. Almost nobody ships this, and **we already specced and modeled it** (`ai_recommendations`, `Brain/04`).
2. **Retention is measurable and mostly ignored in-product.** <3 workouts in the first 14 days → **3–4× churn**; social/accountability features cut churn **20–35%**. → The copilot's flagship job is **flag at-risk clients in the 90-day danger window**. This ties AI directly to trainer *revenue*, which is the only ROI a solo PT cares about.
3. **Every incumbent nickel-and-dimes** (add-on stacks; TrueCoach's new 5% skim) and **their client apps are their weakest surface.** → Beat them on **price honesty** and **client-app quality** — two things that don't require out-innovating a 200k-coach incumbent, just out-caring.

## 3. Where to play / how to win

- **Where:** independent trainers & micro-studios (1–50 clients) running hybrid coaching — the segment punished by price cliffs and underserved by clunky client apps. Not enterprise gyms (yet).
- **How to win (3 moats, in build order):**
  1. **Client-app love → data moat.** A Hevy-grade client experience (fast logging, PRs, streaks, light social/accountability) that makes clients *want* to log. Data density is the fuel for everything downstream.
  2. **Decision-support AI → differentiation moat.** The `ai_recommendations` copilot: attention/readiness/risk triage, weekly client summaries, always-explained, trainer-approved. Wearables via **Terra API** feed readiness. This is the story no incumbent tells well.
  3. **Honest pricing → trust moat.** Nutrition + AI **included**, **no payment skim**. Positioning weapon against the entire field.

## 4. Recommended pricing (draft)

Reject per-add-on stacking. Propose **flat, roster-based, all-inclusive**:

| Tier | Clients | Target price | Included |
|---|---|---|---|
| **Solo** | Self-training, no coach | **Free** (paid ~$5–8/mo power tier later) | Train tab, logging, PRs, history — the acquisition funnel |
| **Coach** | up to ~25 | **~$49/mo flat** | Everything: programming, nutrition, messaging, **AI copilot**, branding |
| **Studio** | up to ~75 | **~$99/mo flat** | Coach + team seats + priority AI |

**Positioning line:** *"One price. Nutrition and AI included. We never take a cut of your payments."* Undercuts fully-loaded Everfit (~$134–148 @50) and Trainerize (~$175–200 @50) while reading as premium, not cheap. (Payments themselves are still Phase 3 per DEC-004 — the *no-skim promise* is the differentiator when they arrive.)

## 5. Ruling on the self-training tension (→ DEC-014)

DEC-001 says "trainer-first, **not** solo." We shipped a solo **Train tab** anyway. **Don't retreat — reframe it.** Adopt the **Hevy/Strong playbook**: free solo lifters are **top-of-funnel**, not the product.

- Solo users log workouts → build a habit and a data trail → get a **one-tap "Connect a coach"** upgrade → become trainer-billable clients (and trainers get pre-warmed, data-rich leads).
- This keeps the trainer-first *business model* intact while using solo as the **cheapest client-acquisition channel we have**. DEC-014 records the reframe (trainer-first remains the monetization core; solo is acquisition).

## 6. The top 3 bets (next two phases)

1. **Ship the AI copilot (Phase 2, the differentiator).** Build the `ai_recommendations` inbox: at-risk flags (churn-signal driven), readiness, weekly summaries — explainable, trainer-approved. *This is the whole brand.* Detailed items in `Work Tracking/14-opportunity-backlog.md`.
2. **Make the client app worth loving (feeds bet 1).** Streaks, PR celebration, light social/accountability, frictionless logging. Retention data says this alone cuts churn 20–35%.
3. **Wire wearables via Terra + launch honest pricing.** One Terra integration → readiness scores into the copilot; ship the flat all-in tiers + the solo→coach funnel.

## 7. Risks & how we hold the line

- **Incumbent scale** (Everfit 200k coaches). → We don't out-feature; we out-position (copilot + honesty + client-app love in one place).
- **AI trust** (RISK-003; ACM DIS 2026). → Never auto-send, always show the reason, trainer approves — already our spec. Lean into it as the brand.
- **Solo cannibalization.** → Solo is intentionally *thinner* (no coach, no programming-from-a-pro); the upgrade path is the point, mitigated by design.
- **Pricing math.** → Flat pricing must survive AI inference cost per client; validate unit economics before locking the numbers above.

## 8. Immediate next step

Found­er decision on **(a)** the pricing shape (§4) and **(b)** the solo-funnel reframe (§5, DEC-014). On sign-off, Phase 2 = **plan the AI copilot build** (already the sole queued board item, P2-001).
