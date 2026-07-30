# 4. Design System

Every contrast ratio in this document was computed against the WCAG 2.1 relative-luminance
formula, not estimated. Values are stated so they can be re-verified.

## Design principles

1. **Warmth carries the brand; restraint carries the credibility.** Cream, rounded corners and
   soft shadows do the "playful". Typography, spacing and alignment do the "serious". If a
   surface is both loud *and* colourful, it reads as a toy catalogue.
2. **Whitespace is the primary layout tool.** Section rhythm is generous (`--space-section`
   = 96–160px fluid). Crowding is the fastest way to look like a template.
3. **One accent per section.** Pillar colours identify content; they never compete inside a
   single viewport.
4. **Motion explains, never decorates.** Every animation answers "what changed and why".
5. **No pure black, no pure grey.** Neutrals are warm-tinted so they sit on cream without
   looking like a Bootstrap page dropped on a beige background.

---

## Colour system

### Foundation

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#FDFBF6` | Page background — the warm cream from the brochure |
| `--surface` | `#FFFFFF` | Cards, sheets, elevated surfaces |
| `--surface-sunken` | `#F7F3EA` | Wells, code blocks, inset panels |
| `--ink` | `#161A2B` | Primary text — **16.69:1** on paper |
| `--ink-muted` | `#565D75` | Secondary text — **6.31:1** on paper |
| `--ink-subtle` | `#666D87` | Tertiary/meta text — **4.95:1** on paper |
| `--border` | `#E2DDD1` | Decorative dividers (non-semantic, contrast not required) |
| `--border-strong` | `#8A8674` | Input borders, focus-adjacent UI — **3.54:1** ✓ non-text AA |

### Brand

| Token | Hex | Contrast | Use |
|---|---|---|---|
| `--blue-600` | `#1F5FD1` | 5.62:1 on paper · white on it **5.81:1** | Primary. Buttons, links, logo |
| `--blue-700` | `#17489F` | 8.24:1 on paper · white on it **8.52:1** | Hover, dense text links |
| `--blue-100` | `#E7F0FD` | ink on it **15.02:1** | Tint backgrounds |
| `--yellow-500` | `#F5C518` | ink on it **10.59:1** | Highlights, underlines, badges. **Never white text.** |
| `--green-600` | `#177552` | 5.48:1 on paper · white **5.67:1** | Success, outcomes, confirmation |
| `--orange-600` | `#C24F0B` | white on it **4.75:1** | Energy accents, fills |
| `--orange-700` | `#A8430A` | 5.85:1 on paper | Orange used as *text* |
| `--magenta-600` | `#A81D57` | white on it **7.05:1** | Pill badges (matches brochure) |

> **Rule:** `--yellow-500` and `--orange-600` never carry text below 18px. Yellow is a
> background/underline colour only. This is the single easiest way to fail an audit.

### Pillar identity

Each pillar owns a tint + an accent. Tints are backgrounds only; accents are for icons, rules
and small solid fills. Ink on every tint clears **14.6:1**.

| Pillar | Tint | Accent | Ink on tint |
|---|---|---|---|
| Foundational Learning (FLN) | `#E7F0FD` sky | `#1F5FD1` | 15.02:1 |
| Health & Nutrition | `#FDECEF` blush | `#A81D57` | 15.14:1 |
| Climate Education | `#E2F3EB` mint | `#177552` | 15.00:1 |
| Future Readiness | `#FDEEE2` peach | `#C24F0B` | 15.21:1 |
| Life Skills | `#EEEAFB` lavender | `#5B4BC4` | 14.63:1 |

### Dark mode

The site commits to its cream identity in light mode, but respects `prefers-color-scheme` and
an explicit toggle. Dark is a warm near-black, not blue-black.

| Token | Hex | Contrast |
|---|---|---|
| `--paper` | `#12131A` | — |
| `--surface` | `#1B1D27` | — |
| `--ink` | `#F2EFE8` | **16.13:1** on paper, 14.61:1 on surface |
| `--ink-muted` | `#A5AAC0` | **8.04:1** |
| `--blue-300` | `#8DB4F7` | **8.82:1** (and paper on it, 8.82:1, for filled buttons) |
| `--yellow-500` | `#F5C518` | **11.36:1** |
| `--green-400` | `#5FD3A0` | **9.98:1** |
| `--orange-400` | `#FF9552` | **8.53:1** |

Implementation: `@media (prefers-color-scheme: dark)` for the default, plus
`:root[data-theme="dark"]` / `[data-theme="light"]` overrides so an explicit toggle wins in
both directions.

---

## Typography

### Families

| Role | Family | Why |
|---|---|---|
| UI / body | **Plus Jakarta Sans** (variable, 400–800) | Friendly geometric sans with generous x-height. Warm without being childish. Excellent at 16px on Android. |
| Display accent | **Fraunces** (variable, `SOFT`/`WONK` axes, italic) | Delivers the brochure's italic-serif emphasis (*"Learning by Doing."*). Used **only** for emphasised phrases inside headings — never full paragraphs. |
| Gujarati (if D3 = yes) | **Baloo Bhai 2** | Rounded Gujarati that pairs tonally with Jakarta. Reserved now so a later `gu` locale isn't a redesign. |
| Mono | `ui-monospace` stack | Code in blog posts. No webfont cost. |

All self-hosted via `next/font/google` → zero layout shift, no third-party request, and it
satisfies the Artifact/CSP constraint if any of this is ever published as a static page.

### Scale (fluid, `clamp()`, 320 → 1440px viewport)

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| `display-1` | `clamp(2.75rem, 1.6rem + 5.6vw, 5.5rem)` | 0.98 | −0.03em | Homepage hero only |
| `display-2` | `clamp(2.25rem, 1.5rem + 3.7vw, 4rem)` | 1.03 | −0.025em | Page heroes |
| `h1` | `clamp(2rem, 1.5rem + 2.5vw, 3rem)` | 1.1 | −0.02em | |
| `h2` | `clamp(1.625rem, 1.3rem + 1.6vw, 2.25rem)` | 1.15 | −0.015em | Section titles |
| `h3` | `clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)` | 1.25 | −0.01em | Card titles |
| `body-lg` | `1.125rem` | 1.65 | 0 | Intros, hub lede |
| `body` | `1rem` | 1.7 | 0 | Default. **Never below 16px on mobile.** |
| `body-sm` | `0.9375rem` | 1.6 | 0 | Captions, meta |
| `label` | `0.8125rem` | 1.4 | 0.06em, uppercase | Eyebrows, tags |

**Measure:** prose is capped at `68ch`. Long-form blog body at `72ch`.
**Mobile typography:** `body` stays 16px (prevents iOS zoom-on-focus); `display-1` bottoms out
at 44px so the hero never wraps to five lines on a 360px screen.

### The italic-accent pattern

The signature typographic move, taken directly from the brochure:

```html
<h2 class="font-display-2">
  Shifting from rote memorization to
  <em class="font-accent">Learning by Doing.</em>
</h2>
```

`<em class="font-accent">` = Fraunces italic, same size, `--blue-600`. Used at most **once per
section**. Overuse turns a signature into a tic.

---

## Space, radius, elevation

**Space** — 4px base, geometric: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160`.
Section vertical rhythm: `--space-section: clamp(4rem, 2rem + 8vw, 10rem)`.

**Radius** — the rounding is a brand signal; it is generous.

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 8px | Tags, inputs, small chips |
| `--r-md` | 14px | Buttons |
| `--r-lg` | 20px | Cards |
| `--r-xl` | 28px | Feature panels, media |
| `--r-2xl` | 40px | Hero blocks, section containers |
| `--r-full` | 9999px | Pills, avatars |

**Elevation** — soft, warm-tinted, low-opacity. Never a hard grey drop shadow.

```css
--shadow-sm: 0 1px 2px rgba(46, 38, 20, .05), 0 1px 3px rgba(46, 38, 20, .04);
--shadow-md: 0 4px 12px rgba(46, 38, 20, .06), 0 2px 4px rgba(46, 38, 20, .04);
--shadow-lg: 0 12px 32px rgba(46, 38, 20, .09), 0 4px 8px rgba(46, 38, 20, .04);
--shadow-xl: 0 24px 64px rgba(46, 38, 20, .12);
```

**Glass** — used sparingly: the sticky header on scroll, and the ⌘K palette. Nothing else.

```css
--glass: rgba(253, 251, 246, .72);
backdrop-filter: blur(16px) saturate(1.6);
```
With an opaque `@supports not (backdrop-filter: blur(1px))` fallback.

---

## Shape language

Two brand shapes, both from the brochure. Both are decorative and therefore
`aria-hidden="true"`.

**Organic blobs** — pale pink/peach/blue background forms, inline SVG, absolutely positioned,
never above `z-index: 0`. Max **two per viewport**.

**Scalloped edges** — the wavy card edge from the print piece, as a reusable CSS mask on
section dividers. One per page maximum; it is a punctuation mark, not a pattern.

---

## Iconography

**Lucide React**, 1.75px stroke (slightly heavier than default 2px-at-24 to match the rounded
type), `stroke-linecap: round`. 20px inline, 24px standalone, 32px in feature cards.

Decorative icons: `aria-hidden="true"`. Icon-only buttons: always `aria-label`.

**Pillar icons need custom illustration.** Lucide has no honest glyph for "Foundational
Literacy & Numeracy". Five bespoke line icons in the same stroke language — a small
illustration commission, flagged in the roadmap.

---

## Focus & interaction states

Focus is non-negotiable and must be visible on **every** background, including the pillar tints.

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid var(--blue-600);
  outline-offset: 3px;
  border-radius: var(--r-sm);
}
```

3px at 5.62:1 against paper clears the 3:1 non-text requirement with margin. On a `--blue-600`
filled button, focus switches to `--ink` via `.on-brand:focus-visible`.

| State | Treatment |
|---|---|
| Hover (card) | `translateY(-4px)`, `--shadow-md` → `--shadow-lg`, 200ms `ease-out` |
| Hover (button) | Background → 700 step, `scale(1.02)`, 150ms |
| Active | `scale(0.98)`, 80ms |
| Disabled | `opacity: .45`, `cursor: not-allowed`, `aria-disabled` (never removed from tab order without a reason) |
| Loading | Skeleton with `--surface-sunken`, `aria-busy="true"` |

---

## Density & breakpoints

| Name | Min width | Notes |
|---|---|---|
| `sm` | 640 | Large phone |
| `md` | 768 | Tablet portrait — nav collapses below this |
| `lg` | 1024 | Tablet landscape / small laptop |
| `xl` | 1280 | Desktop — **primary design target** |
| `2xl` | 1536 | Large desktop; content maxes at 1280 + wider gutters |

Container: `max-width: 1280px`, gutters `clamp(1.25rem, 4vw, 4rem)`.
Grid: 12-column at `lg`+, 6-column at `md`, 4-column below.

---

## Tailwind v4 wiring

Tokens are declared once as CSS custom properties inside `@theme`, so they are simultaneously
CSS variables (available to Framer Motion and inline styles) and Tailwind utilities. No
`tailwind.config.ts` colour duplication.

```css
/* styles/theme.css */
@import "tailwindcss";

@theme {
  --color-paper:        #FDFBF6;
  --color-surface:      #FFFFFF;
  --color-ink:          #161A2B;
  --color-ink-muted:    #565D75;
  --color-ink-subtle:   #666D87;
  --color-brand-600:    #1F5FD1;
  --color-brand-700:    #17489F;
  --color-accent-500:   #F5C518;
  --color-success-600:  #177552;
  --color-energy-600:   #C24F0B;

  --radius-lg:  20px;
  --radius-xl:  28px;
  --radius-2xl: 40px;

  --font-sans:    "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", ui-serif, Georgia, serif;

  --ease-out-quint: cubic-bezier(.22, 1, .36, 1);
}
```

Dark-mode values are re-declared under `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`, so every utility follows automatically.
