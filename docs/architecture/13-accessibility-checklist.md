# 14. Accessibility Checklist

**Target: WCAG 2.1 Level AA, Lighthouse Accessibility 100.**

For an education company this is not a compliance exercise. Teachers with low vision, parents
using screen magnification, and students with motor differences are the actual audience. A site
about inclusive learning that is not itself accessible fails on its own terms.

Note that Lighthouse's automated pass catches roughly **30%** of WCAG issues. The manual
sections below are where the other 70% lives.

---

## Built-in by design

These are already solved by decisions made elsewhere in this architecture. They are listed so
they are not re-litigated or accidentally undone.

| Guarantee                 | Where it comes from                                                              |
| ------------------------- | -------------------------------------------------------------------------------- |
| All text contrast ≥ 4.5:1 | [Design system](03-design-system.md) — every pair computed, not estimated        |
| Non-text contrast ≥ 3:1   | `--border-strong` 3.54:1, focus ring 5.62:1                                      |
| Alt text on every image   | `accessibleImage` in Sanity makes it **impossible to publish** without           |
| Reduced motion honoured   | [Animation plan](10-animation-plan.md) — per-effect, not just a global CSS reset |
| No CLS from animation     | Only `transform`/`opacity` animate                                               |
| 16px minimum body text    | Type scale; also prevents iOS zoom-on-focus                                      |
| Works without JS          | Server Components + Server Actions + progressive enhancement                     |

---

## 1. Perceivable

- [ ] Every `<img>` has `alt`; decorative images have `alt=""` + `aria-hidden="true"`
- [ ] Alt text describes function, not appearance ("Book a demo" not "blue button")
- [ ] Blobs, scallop dividers, and decorative icons are `aria-hidden="true"`
- [ ] Videos have captions; the `VideoEmbed` poster has a real `alt`
- [ ] Any audio-based product content (e.g. Naturebola sound game) has a text alternative
- [ ] Colour is **never the only signal** — form errors carry an icon + text; pillar chips carry
      a label, not just a tint; filter-active state has a border change, not only a fill
- [ ] Text over images passes contrast against the **darkest and lightest** part of the image,
      or sits on a scrim
- [ ] Page reflows to 320px with no horizontal scroll (400% zoom equivalent)
- [ ] Text can be resized to 200% without loss of content — spacing uses `rem`, containers use
      `max-width` not fixed `width`
- [ ] Content survives a user stylesheet overriding letter/word/line spacing
- [ ] Heading levels are sequential and describe structure — never chosen for visual size
- [ ] One `<h1>` per page
- [ ] Landmarks present: `<header>`, `<nav>`, `<main id="main">`, `<footer>`; multiple `<nav>`
      elements are distinguished with `aria-label`
- [ ] Lists are marked up as lists; tables (where used) have `<th scope>` and a `<caption>`

---

## 2. Operable

### Keyboard

- [ ] Every interactive element is reachable and operable by keyboard alone
- [ ] Tab order follows visual order — no positive `tabindex` anywhere
- [ ] **No keyboard traps.** Modals and the mobile nav sheet trap focus _intentionally_ and
      release on `Esc`
- [ ] Focus returns to the trigger element when a dialog, sheet, or palette closes
- [ ] `Skip to main content` is the first focusable element, visible on focus
- [ ] Mega-menu: `Enter`/`Space` opens, arrows navigate, `Esc` closes and returns focus. It
      does **not** open on hover alone
- [ ] ⌘K palette: `↑↓` navigate, `Enter` selects, `Esc` closes; `aria-activedescendant` tracks
      the highlighted option
- [ ] Accordion: `Enter`/`Space` toggles; arrows move between headers
- [ ] Carousels: keyboard-scrollable, with visible focus on each item, and never auto-advance
- [ ] Custom controls (filter chips, tabs) implement the correct ARIA pattern — or are replaced
      by native elements, which is usually the better answer

### Focus visibility

- [ ] `:focus-visible` on every interactive element, ≥ 2px, ≥ 3:1 against the adjacent colour
- [ ] Focus is visible on **every** background it can occur on — cream, white, the five pillar
      tints, the blue CTA band, and dark mode. This is the check most sites fail.
- [ ] `outline: none` appears nowhere without a replacement indicator in the same rule

### Targets & timing

- [ ] Touch targets ≥ 44×44px with ≥ 8px spacing (WCAG 2.1 asks 24×24; 44 is the usable figure)
- [ ] Mobile nav items, filter chips, and carousel controls specifically verified
- [ ] No time limits on any interaction
- [ ] Toasts persist ≥ 6s and are dismissible; errors do not auto-dismiss at all
- [ ] Nothing flashes more than 3× per second

---

## 3. Understandable

- [ ] `<html lang="en">`; `lang` set on any inline Gujarati or Sanskrit-derived term
      (_Vidyalaya_, _Khel_, _Shiksha_, _Aryabhata_, _Santulan_) so screen readers pronounce them
      correctly — a small detail that matters a great deal for this brand
- [ ] Navigation is in the same place and order on every page
- [ ] Components with the same function are labelled identically site-wide
- [ ] **Forms:**
  - [ ] Every input has a visible, associated `<label>`. Placeholder is never the label.
  - [ ] Required fields marked in text, not by colour or `*` alone
  - [ ] Errors identified in text, tied via `aria-describedby`, announced in a live region
  - [ ] Error messages say how to fix it: _"Enter a 10-digit mobile number"_, not _"Invalid"_
  - [ ] `autocomplete` on name, email, tel, organisation
  - [ ] `inputmode="tel"` / `type="email"` so mobile keyboards are correct
  - [ ] Success is announced, not only shown
  - [ ] Input is never lost on a validation error
- [ ] Link text is meaningful out of context — never a bare "read more" or "click here"
- [ ] Links that open a new tab or download a file say so, in text
- [ ] Reading level appropriate to audience: institutional language on `/schools` and
      `/government`, plain language on `/parents`. **NEP/NCF jargon never appears on parent
      pages** — this is simultaneously a UX, accessibility and conversion rule.

---

## 4. Robust

- [ ] Valid HTML; no duplicate `id` on a page
- [ ] ARIA used only where a native element cannot do the job. **A `<button>` beats
      `role="button"` every time.**
- [ ] No `aria-label` that contradicts visible text (breaks voice control — a user saying
      "click Book a Demo" must match the accessible name)
- [ ] Dynamic content announced via `aria-live`: filter result counts, form status, search results
- [ ] Loading states carry `aria-busy="true"`
- [ ] Icon-only buttons have `aria-label`; icon+text buttons do not (that would double-announce)
- [ ] `aria-expanded`, `aria-controls`, `aria-current="page"` maintained correctly
- [ ] Custom components tested against the correct WAI-ARIA Authoring Practices pattern

---

## AI-specific accessibility

Streaming interfaces are a genuinely new accessibility problem and most implementations get
them wrong.

- [ ] Streaming responses use `aria-live="polite"` on a **container** that is not re-announced
      on every token — otherwise a screen-reader user hears an unusable stutter
- [ ] Announce state transitions ("Generating response", "Response complete"), not the token stream
- [ ] A "Stop generating" control is keyboard-reachable at all times
- [ ] Every AI surface carries the visible `AIDisclosure` notice — programmatically associated
      with the output, not just placed near it
- [ ] Every AI feature has a non-AI equivalent path (guided finder, keyword search, contact form)
- [ ] Loading is a real status, not a spinner with no accessible name

---

## Testing

### Automated (every PR)

- `axe-core` via `@axe-core/playwright` on all key routes — **zero violations required**
- `eslint-plugin-jsx-a11y` at error level
- Lighthouse CI accessibility budget = 100
- HTML validation

### Manual (before each phase ships)

Automated tools cannot catch these. Each is a person doing a task.

- [ ] **Keyboard-only pass** of every journey in
      [02-user-journeys.md](02-user-journeys.md) — unplug the mouse and complete a demo booking
- [ ] **NVDA + Firefox** (Windows) — the most common real-world screen-reader pairing
- [ ] **VoiceOver + Safari** (macOS and iOS)
- [ ] **TalkBack + Chrome** (Android) — matches our actual mobile audience
- [ ] **400% browser zoom** on the homepage and product detail
- [ ] **Windows High Contrast Mode** — verify borders and focus survive (forced-colors media
      query where needed)
- [ ] **Reduced motion on**, full site walk
- [ ] **Greyscale filter** — confirms no information is carried by colour alone
- [ ] **Slow 4G + mid-range Android**, real device, complete journey J2 end to end

### Ongoing

- Every new component ships with an axe assertion
- Accessibility review is a required PR checklist item, not a phase
- Annual third-party audit once the site is live

---

## Definition of done for any component

A component is not finished until:

1. It is fully keyboard operable.
2. It has a visible focus state on every background it can appear on.
3. Its accessible name matches its visible label.
4. It respects `prefers-reduced-motion`.
5. It renders meaningful content in SSR HTML.
6. It passes axe with zero violations.
7. It has been used once with a screen reader by the person who built it.

Item 7 is the one that actually catches problems. Everything else can pass while the component
remains genuinely unusable.
