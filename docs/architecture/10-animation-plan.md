# 11. Animation Plan

## The test every animation must pass

> **What changed, and why does the user need to know?**

If there is no answer, the animation is decoration and does not ship. This is what separates a
premium site from a distracting one — and it is the constraint most "beautiful" sites fail.

Corollaries:
- Nothing animates purely because it entered the viewport. Reveals exist to establish reading
  order and pace, not to make scrolling feel busy.
- Nothing loops forever within the reading area. Ambient loops are visual noise, and for users
  with vestibular sensitivity they are actively harmful.
- If an animation delays content, it is a bug. Reveals fire at 15% visibility with a maximum
  400ms total — never a fade-in that makes a user wait to read.

---

## Motion tokens

```css
--dur-instant: 80ms;    /* active/press */
--dur-fast:    150ms;   /* hover, colour, small state */
--dur-base:    240ms;   /* card lift, accordion */
--dur-slow:    400ms;   /* reveals, layout shift */
--dur-slower:  700ms;   /* hero entrance, page transition */

--ease-out-quint: cubic-bezier(.22, 1, .36, 1);   /* default — decisive, no bounce */
--ease-in-out:    cubic-bezier(.65, 0, .35, 1);   /* two-way transitions */
--ease-spring:    cubic-bezier(.34, 1.56, .64, 1);/* icon bounce ONLY */
```

**Distance scales inversely with duration.** A card lifts 4px in 240ms. A section reveals 24px
in 400ms. A hero enters 40px in 700ms. Long distance + short duration reads as a glitch; short
distance + long duration reads as lag.

---

## Library allocation

| Tool | Used for | Budget |
|---|---|---|
| **CSS** (transition/animation) | Hover, focus, colour, accordion, skeletons, card lift, filter-grid fade | Free. **Default choice.** |
| **IntersectionObserver + CSS** | Scroll reveals, animated counters | < 1KB, hand-written. |
| **rAF + CSS transforms** | Hero parallax | < 1KB, hand-written. |
| ~~Framer Motion~~ | — | **Removed. See below.** |
| **GSAP + ScrollTrigger** | Reserved for the `/schools` timeline line-draw if it is ever built as a true scroll-scrubbed effect. | ~28KB gz. Not currently used. **If added: dynamically imported, desktop-only, non-blocking.** |

### Why Framer Motion was removed

The original plan budgeted ~34KB for Framer Motion, justified by `Reveal`, `Counter`, and the
product-grid FLIP. Measured on the production build it cost **~50KB gzipped on every page**,
because `Reveal` appears on all of them.

Re-examined against what it actually bought:

- **`Reveal`** — a fade-and-rise on scroll. An `IntersectionObserver` toggling one CSS class
  does this in under 1KB.
- **`Counter`** — counting 0→N. A `requestAnimationFrame` loop, ~20 lines.
- **Hero parallax** — three layers tracking the cursor. ~40 lines of rAF and `translate3d`.
- **Product-grid FLIP** — the only genuinely hard one. But the catalogue is **six kits**;
  paying 50KB on every page so that six cards reposition smoothly on one page is not a trade
  worth making. It is now a CSS fade.

Net effect: **~50KB removed from every route**, with no capability the site actually used
lost. The dependency is uninstalled, not just unimported.

**Revisit if** the catalogue grows past ~24 kits and reshuffling becomes disorienting, or a
genuinely physics-driven interaction (drag, spring-following drawer) is specified. At that
point, import it *on the one route that needs it*, dynamically — never in a shared component.

The general lesson, worth keeping: a library justified by one shared component is a library
paid for on every page.

---

## Inventory

### Micro-interactions (CSS)

| Element | Motion | Duration |
|---|---|---|
| Button hover | `bg` → 700 step, `scale(1.02)` | 150ms |
| Button press | `scale(0.98)` | 80ms |
| Card hover | `translateY(-4px)`, shadow md→lg | 240ms |
| Product image hover | inner `scale(1.05)`, frame clips | 400ms |
| Nav link | yellow underline scales `0→1` from left | 200ms |
| Icon in CTA | `translateX(3px)` on parent hover | 150ms |
| Chip select | `bg` fill + `scale(1.04)` settle | 150ms |
| Accordion | grid-template-rows `0fr→1fr` + chevron 180° | 240ms |
| Input focus | border colour + 3px ring | 150ms |
| Logo strip | greyscale→colour, opacity .6→1 | 300ms |

The accordion uses `grid-template-rows: 0fr → 1fr` rather than `max-height`. It animates to the
true content height with no magic number and no jump on close.

### Scroll reveals (Framer Motion, via `<Reveal>`)

One component, four directions. Everything scroll-triggered on the site goes through it.

```tsx
<Reveal direction="up" delay={0}>   {/* y: 24 → 0, opacity 0 → 1, 400ms */}
```

- `viewport={{ once: true, amount: 0.15 }}` — fires early, never re-fires.
- Staggered children: `delay = index * 60ms`, **capped at 240ms total**. A twelve-card grid
  does not stagger for 720ms; the last card would arrive after the user reached it.
- Text blocks reveal as a whole. Per-word or per-letter animation is banned — it destroys
  readability and screen-reader output.

### Signature moments

These four justify their cost. Everything else is CSS.

**1. Homepage hero (`HeroHome`)**
Sequence on load: eyebrow (0ms) → headline (80ms) → lede (160ms) → CTAs (240ms) →
illustration (120ms, scale 0.96→1). Total 700ms.
Then: cursor parallax on the illustration, layered ±12px / ±6px / ±3px, `damping: 30`,
`stiffness: 120`. **Desktop pointer only** — `@media (hover: hover) and (pointer: fine)`.
LCP is the headline text, not the illustration, so the entrance never delays it.

**2. Why-Experiential scroll story (GSAP ScrollTrigger, `lg`+ only)**
Left panel pins; the illustration cross-fades through 5 states as the right column scrolls.
Active benefit gets a yellow left rule that slides between items.
`< 1024px`: no pin, no GSAP — a plain stacked list. It reads fine, and mobile keeps its bytes.

**3. Impact counters (`Counter`)**
Count from 0 on first viewport entry, once, 1400ms, ease-out-quint, with the numerals
`font-variant-numeric: tabular-nums` so the width never jitters.
**The final value is in the SSR HTML.** With JS off, or before hydration, `12,000+` is simply
there. The animation is an enhancement over correct content, never a replacement for it.

**4. Product grid filtering (Framer Motion layout)**
`<motion.div layout>` + `AnimatePresence` gives FLIP repositioning as filters change — the eye
tracks which cards survived instead of the grid blinking to a new state.
Guard: above 24 visible cards, layout animation is disabled and the grid swaps instantly.
FLIP on 60 nodes is jank on a mid-range Android.

### Page transitions

Deliberately minimal: a 200ms opacity fade on route change via `template.tsx`. No slide, no
crossfade, no view transitions.

Elaborate page transitions on a content site delay the thing the user asked for and interfere
with the browser's scroll restoration. When the View Transitions API is stable across our
support matrix, a shared-element transition on product cards is worth revisiting — but as an
enhancement behind `@supports`, not a dependency.

---

## Reduced motion — the real implementation

`prefers-reduced-motion: reduce` must not mean "the site breaks". It means **content appears
instantly in its final state.**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Global CSS is the safety net, not the strategy. Each JS-driven effect handles it explicitly:

| Effect | Reduced-motion behaviour |
|---|---|
| `Reveal` | Renders at final opacity/position. No transition. |
| `Counter` | Renders the final number immediately. |
| Hero parallax | Not initialised at all. |
| GSAP scroll story | `ScrollTrigger` never created; static layout. |
| Product FLIP | `layout` prop omitted; instant reposition. |
| Page transition | No fade. |
| Carousels | `scroll-behavior: auto` instead of `smooth`. |

```tsx
const reduced = useReducedMotion()   // Framer Motion hook
return <motion.div {...(reduced ? {} : revealProps)}>{children}</motion.div>
```

`useReducedMotion` also listens for changes, so a user toggling the OS setting mid-session gets
the right behaviour without a reload.

---

## Performance rules

1. **Only `transform` and `opacity` animate.** Never `width`, `height`, `top`, `left`,
   `margin`, or `box-shadow` — each forces layout or paint on every frame. Shadow "changes" are
   done by cross-fading two stacked pseudo-elements.
2. **`will-change` is applied on hover-intent and removed on completion.** Leaving it on a
   dozen cards permanently creates a dozen compositor layers and costs more memory than it saves.
3. **Off-screen animations are not scheduled.** `IntersectionObserver` gates everything.
4. **Animation JS is never render-blocking.** GSAP is `await import()`ed inside an effect,
   after paint.
5. **60fps on a mid-range Android is the acceptance bar**, not 60fps on an M-series Mac. Profile
   the product grid and the scroll story on a real throttled device before either ships.
6. **No animation may cause CLS.** Reveals animate `transform`, which does not reflow. Any
   entrance that changes layout size is rejected in review.
