# 3. Wireframes

Low-fidelity structure for the pages that carry conversion load. Visual detail lives in the
[design system](03-design-system.md); these define **section order and hierarchy**, which is
the part that must be agreed before code.

Notation: `[▓]` image/video · `[▸]` CTA button · `{…}` dynamic/CMS · `※` animated on scroll.

---

## Home — desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ⌂ KhelShiksha®   Schools  Teachers  Parents  Government  What We Do ▾      │
│                  Impact  Resources ▾                     [▸ Book a Demo]   │  sticky, glass on scroll
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ╭─ HERO ────────────────────────────────────┬──────────────────────────╮ │
│   │  ▪ Build • Play • Learn                   │                          │ │
│   │                                           │      [▓ interactive]     │ │
│   │  Learning Through Play.                   │      3D kit / children   │ │
│   │  Every classroom a hub                    │      parallax on cursor  │ │
│   │  of *discovery.*        ← Fraunces italic │      ※                   │ │
│   │                                           │                          │ │
│   │  Gamified experiential kits for            │   ╭──── blob (pale) ──╮  │ │
│   │  Vidyalayas, aligned to NEP 2020.         │   ╰────────────────────╯  │ │
│   │                                           │                          │ │
│   │  [▸ Book a Demo]  [ Explore the Approach ]│                          │ │
│   ╰───────────────────────────────────────────┴──────────────────────────╯ │
│                                                                            │
│   ── TRUST BAR (immediately below fold line, no scroll needed) ──────────  │
│    12,000+ kits · PM SHRI schools · UNICEF modules · NCF 2023 compliant    │
│    {partner logos, greyscale → colour on hover}                       ※    │
├────────────────────────────────────────────────────────────────────────────┤
│   ── AUDIENCE SPLIT — the most important section on the page ──────────    │
│   "Who are you here for?"                                                  │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│   │ Schools │ │Teachers │ │ Parents │ │  Govt   │   4 cards, tinted,       │
│   │ ▸ hub   │ │ ▸ hub   │ │ ▸ hub   │ │ & NGO   │   lift on hover      ※   │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
├────────────────────────────────────────────────────────────────────────────┤
│   ── WHY EXPERIENTIAL — scroll-told, 5 benefits ────────────────────────    │
│   "Shifting from rote memorization to *Learning by Doing.*"                │
│   ┌────────────────────┬─────────────────────────────────────────────┐     │
│   │ sticky illustration │ 1 Understand concepts faster               │     │
│   │ swaps per step  ※   │ 2 Build confidence through participation   │     │
│   │                     │ 3 Improve teamwork & communication         │     │
│   │                     │ 4 Strengthen problem-solving               │     │
│   │                     │ 5 Connect learning with real life          │     │
│   └────────────────────┴─────────────────────────────────────────────┘     │
├────────────────────────────────────────────────────────────────────────────┤
│   ── THE 5 PILLARS ─── "A complete ecosystem for *holistic development*"   │
│   ┌────────┬────────┬────────┬────────┬────────┐  each in its pillar tint  │
│   │  FLN   │ Health │Climate │ Future │  Life  │  icon + 1-line + →        │
│   │ sky    │ blush  │ mint   │ peach  │lavender│                       ※   │
│   └────────┴────────┴────────┴────────┴────────┘                           │
├────────────────────────────────────────────────────────────────────────────┤
│   ── FEATURED KITS ── {4 products from CMS `featured: true`}               │
│   [▓ card] [▓ card] [▓ card] [▓ card]        [ See all kits → ]            │
│   image zooms on hover; age + pillar chips visible without hover           │
├────────────────────────────────────────────────────────────────────────────┤
│   ── GAME CORNER ── full-bleed, dark-tinted band, breaks the cream rhythm  │
│   [▓ photo of the shelf unit]  │  "Where learning feels like play,         │
│   6 compartment labels annotated│   and play builds life."   [▸ See it ]   │
├────────────────────────────────────────────────────────────────────────────┤
│   ── IMPACT ── animated counters, count on enter, once            ※        │
│      12,000+        150+          6            1                           │
│      kits delivered  schools   pillars    UNICEF partnership              │
│                                    [ Read the PM SHRI story → ]           │
├────────────────────────────────────────────────────────────────────────────┤
│   ── TESTIMONIALS ── {3} principal / teacher / parent, one each            │
│   ── VIDEO ── [▓ poster, click-to-load facade — no iframe until clicked]   │
│   ── GALLERY ── masonry strip, 6 tiles, → /impact/gallery                  │
├────────────────────────────────────────────────────────────────────────────┤
│   ── CTA BAND ── blue-600, white text                                      │
│   "Let's transform *Vidyalayas* into a model for future-ready education."  │
│   [▸ Book a Demo]   [ Download the brochure ]                              │
├────────────────────────────────────────────────────────────────────────────┤
│   FOOTER — 4 cols: Explore · For You · Resources · Contact                 │
│   +91 97798 73333 · adminkhelshiksha@gmail.com · @khelshiksha             │
│   newsletter inline form · legal row                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

**Home — mobile (375px):** identical order, single column. Hero illustration drops **below**
the headline and CTAs (text first — it is what search engines and hurried users need). The
5-benefit scroll story degrades to a plain stacked list with no sticky panel. Pillars become a
horizontal snap-scroll carousel. Counters still animate; blobs are removed entirely (they cost
paint time and add nothing at 375px).

---

## Audience hub — `/schools`

The template all four hubs share. Only content and CTA change.

```
┌──────────────────────────────────────────────────────────────────┐
│ breadcrumb: Home / For Schools                                   │
│ ╭─ HERO (compact, tinted sky) ──────────────────────────────────╮│
│ │ ▪ FOR SCHOOLS                                                 ││
│ │ A complete learning ecosystem for your Vidyalaya.             ││
│ │ {1-sentence lede}          [▸ Book a Demo] [ Brochure PDF ]   ││
│ ╰───────────────────────────────────────────────────────────────╯│
├──────────────────────────────────────────────────────────────────┤
│ PROBLEM → OUTCOME    two columns: "Today" vs "With Khel Shiksha" │
├──────────────────────────────────────────────────────────────────┤
│ HOW IT WORKS — horizontal timeline, 4 steps, line draws on scroll│
│  ①Audit ──── ②Install ──── ③Train ──── ④Measure              ※ │
├──────────────────────────────────────────────────────────────────┤
│ WHAT'S INCLUDED — {kits · Game Corner · training · guides}       │
├──────────────────────────────────────────────────────────────────┤
│ ALIGNMENT — NEP 2020 · NCF 2023 · Fit India · Mission LiFE       │
│ logo + one line each. Explicit, named, above the case studies.   │
├──────────────────────────────────────────────────────────────────┤
│ PROOF — {2 case studies} + {1 principal testimonial}             │
├──────────────────────────────────────────────────────────────────┤
│ FAQ — accordion, 6–8 items, FAQPage structured data              │
├──────────────────────────────────────────────────────────────────┤
│ INLINE ENQUIRY FORM — 5 fields, on-page, no navigation away      │
│  Name · School · District · Phone · Preferred time  [▸ Submit]   │
└──────────────────────────────────────────────────────────────────┘
```

Putting the form **on the page** rather than behind a modal or a `/contact` link is worth
several points of conversion for J1. She should never have to navigate to convert.

---

## Product detail — `/products/aryabhata`

```
┌────────────────────────────────────────────────────────────────────┐
│ Home / Products / Aryabhata                                        │
│ ┌──────────────────────────┬───────────────────────────────────┐   │
│ │                          │ ▪ MATH & THINKING  (pillar chip)   │   │
│ │   [▓ gallery, 4:3]       │ Aryabhata                          │   │
│ │   thumbs ▪▪▪▪            │ Fast-paced mathematics game that   │   │
│ │   video tab if present   │ strengthens arithmetic, logic and  │   │
│ │   zoom on hover          │ problem-solving.                   │   │
│ │                          │                                    │   │
│ │                          │ ┌ Age ─┬ Players ┬ Time ┬ Setting┐ │   │
│ │                          │ │ 8–12 │  2–6    │ 20m  │ Indoor │ │   │
│ │                          │ └──────┴─────────┴──────┴────────┘ │   │
│ │                          │ [▸ Enquire]  [ Teacher guide PDF ] │   │
│ └──────────────────────────┴───────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────────┤
│ LEARNING OUTCOMES  — ✓ list, green accent. The most important      │
│ block on the page. Sits above "what's in the box", deliberately.   │
├────────────────────────────────────────────────────────────────────┤
│ SKILLS DEVELOPED — chips  │  CURRICULUM LINK — NCF/NEP mapping     │
├────────────────────────────────────────────────────────────────────┤
│ HOW TO PLAY — numbered, illustrated  │ WHAT'S IN THE BOX — list    │
├────────────────────────────────────────────────────────────────────┤
│ FOR TEACHERS — lesson plan + assessment rubric (gated download)    │
├────────────────────────────────────────────────────────────────────┤
│ IN THE CLASSROOM — {photos from real deployments}                  │
├────────────────────────────────────────────────────────────────────┤
│ RELATED KITS — {3, same pillar or adjacent age band}               │
├────────────────────────────────────────────────────────────────────┤
│ INLINE ENQUIRY — pre-filled with this product                      │
└────────────────────────────────────────────────────────────────────┘
```

Sticky right rail on `xl`+: the spec table and both CTAs follow the scroll. On mobile the two
CTAs become a fixed bottom bar (appears after the fold, hides on scroll-up).

---

## Product index — `/products`

```
┌──────────────────────────────────────────────────────────────────┐
│ Learning Kits          {n} kits          [ ⌕ Try "games for      │
│                                            teamwork" ]           │
├───────────────┬──────────────────────────────────────────────────┤
│ FILTERS       │  [ Age 8–12 ×] [ Indoor ×]      Clear all        │
│ (sticky rail) │  ┌────────┐ ┌────────┐ ┌────────┐                │
│ ▾ Age         │  │[▓]     │ │[▓]     │ │[▓]     │  3-up @ xl     │
│ ▾ Subject     │  │ name   │ │        │ │        │  2-up @ md     │
│ ▾ Skill       │  │ chips  │ │        │ │        │  1-up @ sm     │
│ ▾ Pillar      │  └────────┘ └────────┘ └────────┘                │
│ ▾ Duration    │  cards re-layout with FLIP on filter change  ※   │
│ ▾ Indoor/Out  │                                                  │
│ ▾ Group size  │  ── empty state ──                               │
│               │  "No kits match. Try removing a filter."         │
│               │  + 3 nearest alternatives (never a bare zero)    │
└───────────────┴──────────────────────────────────────────────────┘
```

Mobile: filters collapse into a bottom sheet triggered by a `Filters (2)` button showing the
active count. Filter state is URL-encoded (`?age=8-12&setting=indoor`) so results are
shareable, back-button-safe, and server-renderable.

---

## Global search palette (⌘K)

```
        ┌──────────────────────────────────────────────┐
        │ ⌕  my child likes maths_                     │
        ├──────────────────────────────────────────────┤
        │ KITS                                         │
        │  ▪ Aryabhata          Maths · 8–12           │
        │  ▪ Brainy Bee         Language · 5–8         │
        │ RESOURCES                                    │
        │  ▪ Grade 4 number-sense activity pack        │
        │ PAGES                                        │
        │  ▪ Foundational Learning pillar              │
        ├──────────────────────────────────────────────┤
        │ ↑↓ navigate · ↵ open · esc close             │
        └──────────────────────────────────────────────┘
```

Phase 1–2 this is fuzzy keyword matching over a prebuilt index. Phase 3 the same input box
routes ambiguous natural-language queries through the intent parser — **the UI does not
change**, which is the point of the tiered design.

---

## Responsive rules (all pages)

| Breakpoint  | Behaviour                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `< 768`     | Single column · full-screen nav sheet · filters in bottom sheet · carousels replace grids · blobs removed · scroll-story degrades to a list |
| `768–1023`  | 2-up grids · nav still collapsed · sticky rails disabled                                                                                    |
| `1024–1279` | 3-up grids · full nav · sticky rails enabled                                                                                                |
| `≥ 1280`    | Design target. 4-up where specified, max-width 1280 with wide gutters                                                                       |

Every section is designed at 375 and 1440 explicitly. The middle breakpoints are interpolated,
but any section whose 768px rendering looks accidental gets its own treatment — "handcrafted at
every size" was the brief, and that means checking, not hoping.
