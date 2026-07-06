# Risk Log

| ID | Risk | Impact | Likelihood | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| RISK-001 | Scope is too large for v1. | High | High | Keep Phase 1 focused on core coaching loop and move payments/growth features later. | Open |
| RISK-002 | Native iOS, native Android, web, and backend require more build effort. | High | High | Go web-first for v1 (DEC-008): single Next.js codebase serves trainer dashboard and client PWA; native apps deferred until the coaching loop is proven. | Mitigated |
| RISK-003 | AI recommendations could feel unsafe or overconfident. | High | Medium | Keep trainer approval required and show source evidence for each recommendation. | Open |
| RISK-004 | Nutrition tracking can become too tedious for clients. | Medium | High | Support simple meal notes/photos first, with macros as optional detail. | Open |
| RISK-005 | Wearable integrations add complexity. | Medium | Medium | Make wearable data optional and launch with manual check-ins as the baseline. | Open |
| RISK-006 | Trainers may need business tools sooner than planned. | Medium | Medium | Design payment-ready objects early, but defer payment processing implementation. | Open |
| RISK-007 | Client PWA may feel less premium than a native app. | Medium | Medium | Mobile-first polish, PWA install prompts, add-to-home-screen flow, and native apps once the coaching loop is proven. | Open |
| RISK-008 | Platform stores sensitive health-adjacent data (pain, mood, injuries, progress photos). | High | Medium | Supabase RLS enforced per trainer-client relationship, private storage buckets for photos, privacy policy before real users, no health data in analytics. | Open |

## Blockers

No active blockers yet.

