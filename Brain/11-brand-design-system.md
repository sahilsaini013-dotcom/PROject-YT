# Brand & Design System

This document is the single source of truth for Training Hub's brand and visual design. UI code, generated assets, and marketing material all pull from here.

## Brand Direction

Dark, athletic, premium. Training Hub should feel elite and performance-focused: the tool a serious coach uses, not a casual fitness toy. High-trust, because it holds health-adjacent data.

Voice: direct, confident, coach-like. Short sentences. Never shaming — this mirrors the AI guardrails in `04-ai-coaching-brain.md`. The brand pushes people forward; it does not guilt them.

## Color Tokens

This palette is the single source of truth. These exact hex values are used as CSS custom properties / Tailwind theme tokens, and are passed to Recraft's `colors` parameter so generated assets match the CSS.

| Token | Hex | Use |
| --- | --- | --- |
| `--ink` | #0B0D10 | App background |
| `--surface` | #15181D | Cards |
| `--surface-raised` | #1D2127 | Elevated surfaces (modals, popovers) |
| `--border` | #2A2F37 | Borders, dividers |
| `--text` | #F5F7FA | Primary text |
| `--text-muted` | #8A94A3 | Secondary text, labels |
| `--accent` | #C6FF00 | Volt — primary actions, highlights, the brand color |
| `--accent-pressed` | #A8D400 | Pressed/active accent |
| `--success` | #34D399 | Positive states, PRs, adherence hits |
| `--warning` | #FBBF24 | Caution states, missed targets |
| `--danger` | #F87171 | Errors, destructive actions |
| `--info` | #60A5FA | Neutral informational accents |

### Usage Rules

- Volt is scarce. Reserve it for the primary CTA, active states, and key numbers. If everything is volt, nothing is.
- Never set volt body text on white. Volt lives on dark surfaces.
- Charts use info/success/warning against ink, not volt-everywhere.
- Light mode is deferred. Dark is the brand; do not build a light variant in v1.

## Typography

- **Archivo** (700/800, tight tracking) — headings and display numbers. The "athletic" voice.
- **Inter** (400/500/600) — body and UI text.
- Both are Google Fonts.
- Use tabular numerals for logged weights, reps, and any column of numbers so digits align.

## Spacing & Shape

- 4px base spacing scale (4, 8, 12, 16, 24, 32...).
- Radius: 12px for cards, 8px for controls (buttons, inputs).
- Prefer subtle borders over shadows — shadows read poorly on dark UI.

## Motion

- UI micro-interactions are CSS transitions or Framer Motion: 150-250ms, ease-out.
- Generated video is reserved for brand moments only: landing hero, splash logo reveal, workout-complete celebration.
- Brand video rules: muted, autoplay, loop, each file under 5 MB.

## Brand Asset Inventory & Generation Log

All assets are generated via the Higgsfield MCP: Recraft V4.1 (`model_type: vector`) for logos, icons, and illustrations; Seedance 2.0 for animations. Post-process with `remove_background` and `upscale_image` as needed. Pass the palette hexes above to Recraft's `colors` parameter.

Masters live in `assets/brand/` until the app scaffold exists, then move to `apps/web/public/brand/`.

Prompt cells are short summaries, filled in as generation happens.

| Asset | Model & settings | Prompt | Status |
| --- | --- | --- | --- |
| Logo concepts x6 | Recraft V4.1, `model_type: vector`, palette-constrained | Icon + wordmark explorations, volt on ink | pending generation |
| Primary lockup (icon + "Training Hub" wordmark) | Recraft V4.1, vector | Chosen concept, horizontal lockup | pending generation |
| Icon-only mark | Recraft V4.1, vector | Standalone icon from chosen concept | pending generation |
| Favicon 32x32 | From icon mark + downscale | — | pending generation |
| PWA maskable icons 192/512 | From icon mark, safe-zone padded | — | pending generation |
| Splash screen 1080x1920 | Recraft V4.1, vector | Icon centered on ink, subtle texture | pending generation |
| OG image 1200x630 | Recraft V4.1, 16:9 | Lockup + tagline for link previews | pending generation |
| Email header | Recraft V4.1, vector | Slim lockup banner on ink | pending generation |
| Logo reveal ~4s | Seedance 2.0, `generate_audio: false`, end frame = logo | Volt energy resolving into the mark | pending generation |
| Landing hero loop ~8s | Seedance 2.0, muted loop | Athletic dark-gym motion, brand-toned | pending generation |
| Workout-complete celebration ~3s | Seedance 2.0, muted loop | Volt burst / rep-counter flourish | pending generation |
| Exercise-category illustrations x15 | Recraft V4.1, `utility_vector` | One per category: squat, hinge, lunge, horizontal push, vertical push, horizontal pull, vertical pull, carry, core, cardio, mobility, plyometric, olympic, isolation, stretching | pending generation |
| Empty-state illustrations x3 | Recraft V4.1, `utility_vector` | No clients, no program, no logs | pending generation |
