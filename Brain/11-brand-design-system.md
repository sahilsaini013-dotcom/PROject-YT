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
| Logo concepts x12 (2 rounds) | Recraft V4.1, `model_type: vector`, 3:2, palette-constrained | Round 1: gym-literal metaphors (rejected). Round 2: minimal/premium. Winner: concept 9 "hexagon arrow" — white hexagon, negative-space upward arrow, one volt edge (job `9b21eb38`) | done — `assets/brand/concepts/` |
| Primary lockup (icon + "Training Hub" wordmark) | Vector master extracted from winning SVG (paths cropped to content bbox) | — | done — `lockup.svg`, `lockup-dark.svg`, `lockup-2048.png` |
| Icon-only mark | Hexagon+volt paths extracted from winning SVG, squared viewBox | — | done — `icon.svg` (transparent), `icon-maskable.svg` (ink bg, safe zone) |
| Favicon 32/64 | icon-512 render downscaled (Lanczos) | — | done — `favicon-32.png`, `favicon-64.png` |
| PWA icons 180/192/512 | Chromium raster of `icon-maskable.svg`, downscaled | — | done — `apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png` |
| Splash screen 1080x1920 | Chromium raster, lockup centered on ink | — | done — `splash-1080x1920.png` |
| OG image 1200x630 | Chromium raster, lockup centered on ink | — | done — `og-1200x630.png` |
| Email header 1200x300 | Chromium raster, lockup on ink | — | done — `email-header-1200x300.png` |
| Logo reveal ~4s | Hand-coded animated SVG (CSS keyframes on the real logo paths), plays once, ends still | Volt outline draws the hexagon, icon fills in, wordmark rises | done — `animations/logo-reveal.svg` (~8 KB) |
| Landing hero loop 8s | Hand-coded animated SVG, seamless infinite loop | Ink grid, breathing volt glow, slow-rotating hexagon outline, volt light streaks | done — `animations/hero-loop.svg` (~3 KB) |
| Workout-complete celebration 4s cycle | Hand-coded animated SVG | Volt ring bursts + rising particles around the popping mark, settles calm | done — `animations/celebration.svg` (~4 KB) |

Note: video generation via Seedance required interactive MCP approval, so the brand-moment animations were authored as animated SVGs instead. This is strictly better for the web surfaces (KB instead of MB, vector-crisp, loop perfectly); revisit generated video only if a filmed-footage hero is wanted later.
| Exercise-category illustrations x15 | Recraft V4.1, `utility_vector`, 1:1, palette-constrained | "Flat vector fitness illustration, consistent icon-style set: [movement], off-white geometric figure, one volt accent, ink background" — squat, hinge, lunge, horizontal push, vertical push, horizontal pull, vertical pull, carry, core, cardio, mobility, plyometric, olympic, isolation, stretching | generated — `assets/brand/exercises/` |
| Empty-state illustrations x3 | Recraft V4.1, `utility_vector`, 1:1 | No clients (clipboard + silhouettes), no program (blueprint + barbell), no logs (empty chart + rising trendline) | generated — `assets/brand/empty-states/` |
