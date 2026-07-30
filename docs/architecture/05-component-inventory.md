# 5. Component Inventory

Four tiers. A component may only import from its own tier or below — this is the rule that
keeps the system from collapsing into mutual dependency.

```
tier 4  features/*        domain-aware, may fetch, may be async
tier 3  components/blocks section-level page furniture
tier 2  components/ui     composed primitives (our design language)
tier 1  shadcn/ui         unstyled/headless primitives (Radix)
```

`RSC` = React Server Component (default) · `CC` = `"use client"` (justify each one).

---

## Tier 1 — shadcn/ui primitives

Installed via CLI, then restyled once against our tokens. We do **not** fork these; we theme
them. Only what we actually use:

`button` · `input` · `textarea` · `select` · `checkbox` · `radio-group` · `label` ·
`form` (react-hook-form + zod) · `dialog` · `sheet` · `popover` · `dropdown-menu` ·
`accordion` · `tabs` · `tooltip` · `command` (⌘K) · `toast` · `skeleton` · `avatar` ·
`badge` · `separator` · `scroll-area`

**Deliberately excluded:** `carousel` (Embla adds ~12KB for something CSS scroll-snap does
natively), `table` (no data grids on a marketing site), `calendar` (the demo booker needs a
custom time-slot UI, not a date picker).

---

## Tier 2 — `components/ui/` (design-language primitives)

| Component | Type | Props (abridged) | Notes |
|---|---|---|---|
| `Button` | RSC | `variant: primary\|secondary\|ghost\|link` · `size: sm\|md\|lg` · `icon` · `iconPosition` · `loading` | Wraps shadcn. `asChild` for link-as-button. Never renders a `<div onClick>`. |
| `Card` | RSC | `as` · `tint?: PillarTint` · `interactive?` · `elevation` | `interactive` adds lift + focus-within ring. |
| `Chip` | RSC | `variant: pillar\|meta\|filter` · `pillar?` · `onDismiss?` | Filter chips are CC (dismissible); others RSC. |
| `SectionTitle` | RSC | `eyebrow?` · `title` · `accent?` · `lede?` · `align` | Owns the Fraunces italic-accent pattern. `accent` is the phrase to italicise. |
| `Prose` | RSC | `size` | Typography wrapper for Portable Text output. `68ch` measure. |
| `Container` | RSC | `size: default\|narrow\|wide\|bleed` | Sole owner of max-width + gutters. |
| `Stack` / `Grid` | RSC | `gap` · `cols` responsive | Layout primitives; stops one-off flex utilities proliferating. |
| `MediaFrame` | RSC | `ratio` · `radius` · `zoomOnHover?` | Wraps `next/image` with our radius + object-fit. Every image on the site goes through this. |
| `Reveal` | **CC** | `direction` · `delay` · `once` | The **only** scroll-reveal wrapper. Reads `prefers-reduced-motion`. Framer Motion is imported here and almost nowhere else. |
| `Counter` | **CC** | `to` · `suffix` · `duration` | Animated number. Renders final value in SSR HTML so it is correct without JS. |
| `Icon` | RSC | `name` · `size` · `decorative` | Lucide wrapper; enforces `aria-hidden` vs `aria-label`. |
| `Blob` | RSC | `variant` · `color` · `position` | Inline SVG, `aria-hidden`, `z-index: 0`. |
| `ScallopDivider` | RSC | `flip?` · `color` | CSS-mask section edge. |
| `Skeleton` | RSC | `variant` | Loading placeholders for Suspense boundaries. |

---

## Tier 3 — `components/blocks/` (page sections)

The vocabulary a page is assembled from. Each maps 1:1 to a CMS section type where the page is
CMS-composed.

### Heroes
| Component | Type | Used on |
|---|---|---|
| `HeroHome` | CC (parallax) | `/` only. Cursor-parallax illustration; static below `md`. |
| `HeroPage` | RSC | Standard page header: eyebrow, title, lede, optional CTAs. |
| `HeroAudience` | RSC | The four hubs. Tinted background, dual CTA. |
| `HeroProduct` | RSC | Product detail split layout. |

### Content
`FeatureGrid` · `PillarGrid` · `BenefitList` · `ScrollStory` (CC, sticky panel) ·
`TimelineSteps` (CC, line-draw) · `ComparisonSplit` (Today vs With Khel Shiksha) ·
`AlignmentStrip` (NEP/NCF/Fit India badges) · `RichTextSection` (Portable Text) ·
`StatBand` (counters) · `QuoteBlock`

### Proof
`TestimonialCarousel` (CC, scroll-snap, no Embla) · `TestimonialGrid` ·
`PartnerLogoStrip` (greyscale→colour) · `CaseStudyGrid` · `ImpactMap` (Gujarat district map,
CC, lazy) · `PressStrip`

### Product & resource
`ProductCard` · `ProductGrid` (CC — FLIP layout on filter) · `ProductFilterBar` (CC) ·
`ProductSpecTable` · `OutcomeList` · `RelatedProducts` · `ResourceCard` ·
`ResourceLibrary` (CC — filter + gate) · `BlogCard` · `BlogGrid` · `CategoryFilter` (CC)

### Conversion
| Component | Type | Notes |
|---|---|---|
| `CTABand` | RSC | Full-width blue closing band. Every page ends in one. |
| `InlineEnquiryForm` | CC | Audience-scaled. Server Action + zod. Honeypot + rate limit. |
| `DemoBookingForm` | CC | 5-field school demo. |
| `NewsletterForm` | CC | Footer + inline. Single field. |
| `DownloadGate` | CC | Email-for-resource. Preview always renders **before** the gate. |
| `ContactRouter` | CC | Picks the right form by audience selection. |

### Navigation
`SiteHeader` (CC — scroll state, mega-menu) · `MegaMenu` (CC, Radix, full keyboard nav) ·
`MobileNavSheet` (CC, focus trap) · `SiteFooter` (RSC) · `Breadcrumbs` (RSC + JSON-LD) ·
`CommandPalette` (CC, ⌘K) · `TableOfContents` (CC, scroll-spy — blog/long pages) ·
`SkipToContent` (RSC, first focusable element in the DOM)

### Utility
`FAQAccordion` (RSC shell + CC accordion; emits `FAQPage` JSON-LD) ·
`VideoEmbed` (CC — click-to-load facade, **never** an iframe on first paint) ·
`GalleryMasonry` (CC, lightbox) · `ShareRow` · `ReadingProgress` (CC) · `EmptyState`

---

## Tier 4 — `features/*/components/`

Domain components that know about data. Colocated with their feature slice.

| Feature | Components |
|---|---|
| `products` | `ProductDetailView` · `ProductFilterProvider` (CC context) · `useProductFilters` |
| `schools` | `ImplementationTimeline` · `TrainingModuleList` · `OutcomeFramework` |
| `teachers` | `LessonPlanLibrary` · `LessonPlanCard` · `GatedDownloadFlow` |
| `blog` | `PostView` · `PostMeta` · `AuthorCard` · `RelatedPosts` |
| `search` | `SearchProvider` · `SearchResults` · `SearchInput` |
| `ai` | `AdvisorChat` · `LessonPlannerForm` · `StreamingMessage` · `AIDisclosure` (phase 3) |

---

## Cross-cutting contracts

**Every interactive component must:**
1. Be reachable and operable by keyboard alone.
2. Have a visible `:focus-visible` state on every background it can appear on.
3. Respect `prefers-reduced-motion` (via `Reveal`, or directly).
4. Render meaningful content in SSR HTML — no component may be blank until hydration.
5. Accept `className` and forward `ref` where it wraps a DOM node.

**Client-boundary discipline.** Framer Motion is imported in `Reveal`, `Counter`, and the
handful of components whose entire purpose is motion. It is never imported into a component
that also renders content — that would pull the content into the client bundle. When a section
needs animation, it stays RSC and wraps its children in `<Reveal>`.

**Anti-patterns explicitly banned:**
- `<div onClick>` where a `<button>` or `<a>` belongs
- A section component that fetches its own data (fetching happens in the page/feature layer and
  is passed down — otherwise caching and Suspense boundaries become unreasonable)
- `useEffect` to set state that could be derived during render
- A component with more than ~8 props (that is two components)
- Colour hex values anywhere outside `theme.css`

---

## Build order

Components are built in dependency order so nothing is ever blocked.

1. **Foundation** — `Container`, `Stack`, `Grid`, `Prose`, `Button`, `Card`, `Chip`,
   `SectionTitle`, `MediaFrame`, `Icon`, `Reveal`
2. **Chrome** — `SiteHeader`, `MegaMenu`, `MobileNavSheet`, `SiteFooter`, `Breadcrumbs`,
   `SkipToContent`
3. **Home blocks** — `HeroHome`, `PillarGrid`, `FeatureGrid`, `StatBand`, `Counter`,
   `PartnerLogoStrip`, `CTABand`
4. **Conversion** — `InlineEnquiryForm`, `DemoBookingForm`, `NewsletterForm`, `DownloadGate`
5. **Product** — `ProductCard`, `ProductGrid`, `ProductFilterBar`, `ProductSpecTable`
6. **Content** — blog, resources, case studies
7. **Advanced** — `ScrollStory`, `CommandPalette`, `ImpactMap`, `GalleryMasonry`
8. **AI** (phase 3) — `AdvisorChat`, `StreamingMessage`

Each component ships with: a Storybook-less usage example in its own file header, a Vitest test
where it has logic, and an axe assertion where it is interactive.
