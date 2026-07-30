# 13. Performance Strategy

## The device that defines the budget

Not a MacBook on office wifi. **A ₹12,000 Android phone on Gujarat 4G.** That is what a teacher
and most parents are holding. Every budget below is set against that device, throttled.

| Metric | Target | Hard fail |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 95 | < 90 |
| Lighthouse Accessibility | **100** | < 100 |
| Lighthouse Best Practices | **100** | < 95 |
| Lighthouse SEO | ≥ 95 | < 90 |
| LCP | < 1.8s | > 2.5s |
| INP | < 150ms | > 200ms |
| CLS | < 0.05 | > 0.1 |
| TTFB | < 400ms | > 800ms |
| JS (first load, homepage) | < 110KB gz | > 150KB |
| JS (product detail) | < 130KB gz | > 170KB |
| Total page weight | < 900KB | > 1.5MB |

Accessibility and Best Practices are set at 100 because unlike Performance they are
deterministic — there is no reason to score less, so anything below is a defect.

**These budgets are enforced in CI.** Lighthouse CI runs on every PR against the homepage,
`/products`, `/products/[slug]`, `/schools`, and `/blog/[slug]`. A regression blocks merge.
A budget that is only aspirational is not a budget.

---

## Rendering strategy per route

The single largest performance lever. Chosen per route, not globally.

| Route | Strategy | Reason |
|---|---|---|
| `/` | ISR, `revalidate: 3600` | CMS-driven, changes rarely, must be instant |
| Audience hubs | ISR, 3600 | Same |
| `/products` | ISR + client-side filtering | The full catalogue is ~10 items — ship it all and filter in the browser. No round trip per filter change. |
| `/products/[slug]` | SSG via `generateStaticParams` + ISR | Small, known set. Pre-render everything. |
| `/blog/[slug]` | SSG + ISR 3600 | |
| `/blog`, `/resources` | ISR 1800 | |
| `/impact/gallery` | ISR + streamed pagination | Image-heavy; first 12 render, rest stream |
| `/search` | Dynamic | User-specific by definition |
| `/contact`, forms | Static shell + client island | The form is the only dynamic part |
| `/studio` | Client-only, `noindex` | Editors only; not in the public bundle |

**Webhook-driven revalidation** means "ISR 3600" is a ceiling, not a latency. A Sanity publish
fires `revalidateTag()` and content is live in seconds.

---

## JavaScript budget

The default is zero client JS. Each `"use client"` is a spend that must be justified.

**What is allowed to be a client component**

| Component | Cost | Why it is worth it |
|---|---|---|
| `SiteHeader` | ~3KB | Scroll state + mega-menu keyboard nav |
| `Reveal` | (shared FM) | The one scroll-reveal primitive |
| `Counter` | ~1KB | Renders final value server-side; JS only animates |
| `ProductFilterBar` + `ProductGrid` | ~8KB | Instant filtering — a genuine UX win |
| `CommandPalette` | ~6KB, **lazy** | Loaded on first ⌘K, not on page load |
| Forms | ~9KB (RHF + zod) | Inline validation; works without JS as a fallback |
| `VideoEmbed` | ~1KB | Facade; the real player loads on click |

**Framer Motion (~34KB gz)** is the largest single dependency. It earns its place through
`Reveal`, `Counter`, and the product-grid FLIP — but it is imported *only* in components whose
purpose is motion. A block component never imports it directly; it wraps children in `<Reveal>`
and stays a Server Component. This one discipline is what keeps the homepage under 110KB.

**Dynamically imported, never in the initial bundle:**

```ts
const CommandPalette = dynamic(() => import('@/components/blocks/command-palette'))
const ImpactMap      = dynamic(() => import('@/features/impact/impact-map'), { ssr: false })
const GalleryLightbox= dynamic(() => import('@/components/blocks/gallery-lightbox'))
const gsap           = () => import('gsap')   // desktop only, inside an effect, after paint
```

`optimizePackageImports: ['lucide-react', 'framer-motion']` in `next.config.ts` — without it,
importing three Lucide icons can pull in the barrel file.

---

## Images

Images are 60–70% of page weight on a site like this. They get the most attention.

1. **Everything goes through `MediaFrame` → `next/image`.** No raw `<img>` anywhere. Enforced
   by an ESLint rule.
2. **Explicit dimensions always** → zero CLS from images.
3. **`priority` on exactly one image per page** (the LCP candidate) — and on the homepage that
   is deliberately *not* the hero illustration, because the LCP element there is the headline
   text.
4. **AVIF → WebP → JPEG**, served by the Sanity CDN with a `?w=&q=&auto=format` chain.
5. **`sizes` is set correctly on every responsive image.** A wrong `sizes` is the most common
   cause of a phone downloading a 2000px image for a 375px slot — it silently doubles page
   weight and nobody notices.
6. **Blur placeholders** from Sanity's LQIP metadata (already in the asset document — free).
7. **Lazy below the fold**, eager above. Default `loading="lazy"` except where `priority`.

Quality settings: hero 80, cards 75, thumbnails 70, logos SVG. Above 80 the file grows
noticeably with no perceptible gain.

---

## Fonts

Two families, both variable, both self-hosted via `next/font/google`.

```ts
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'], display: 'swap',
  variable: '--font-sans', weight: ['400','500','600','700','800'],
})
const display = Fraunces({
  subsets: ['latin'], display: 'swap', style: ['italic'],
  variable: '--font-display', axes: ['SOFT','WONK'],
})
```

- Self-hosted → **zero third-party requests**, no `fonts.googleapis.com` round trip, no privacy
  question.
- `next/font` auto-generates a size-adjusted fallback → **near-zero CLS on font swap**.
- Subset to `latin` only (plus `gujarati` if D3 resolves yes — and if it does, that font loads
  only on `gu` routes).
- Fraunces is **italic-only**, loaded only because the accent pattern needs it. Roman weights
  are never requested.
- Preload only the primary sans. Fraunces is `display: swap` and non-critical.

Combined font payload target: **< 90KB**.

---

## Third-party scripts — the usual killer

Three analytics tools were requested. Loaded naively, they cost ~120KB and 400ms of main-thread
time, and they would put Lighthouse Performance out of reach on their own.

| Script | Strategy |
|---|---|
| GA4 | `next/script` `strategy="afterInteractive"`, consent-gated |
| Microsoft Clarity | `strategy="lazyOnload"` — session recording is never urgent |
| PostHog | `strategy="lazyOnload"`, EU/India host, autocapture **off** (explicit events only) |

All three are gated behind a consent banner and **none load before user interaction or 3s
idle, whichever comes first.** Autocapture is disabled deliberately: it is the single largest
contributor to PostHog's payload and event volume, and we get better data from ~15 named events.

**No YouTube iframe on first paint, ever.** `VideoEmbed` renders a poster image plus a play
button; the iframe is injected on click. A single YouTube embed is ~900KB and ~1.5s of main
thread — more than our entire page budget.

---

## Caching

| Layer | Policy |
|---|---|
| Vercel Edge CDN | Static assets `immutable, max-age=31536000` (content-hashed) |
| ISR | Per-route `revalidate` + tag-based webhook invalidation |
| Sanity CDN | `useCdn: true` in production; `false` for preview/draft |
| React `cache()` | Request-level dedup — the same GROQ query in three components fetches once |
| Prisma | Connection pooling via PgBouncer/Neon; `directUrl` for migrations |
| Anthropic | Prompt caching, 1h TTL on the catalogue prefix (see [API design](09-api-design.md)) |
| Browser | `stale-while-revalidate` on HTML |

---

## Streaming & Suspense

The page shell renders immediately; slow sections stream in.

```tsx
export default async function ImpactPage() {
  return (
    <>
      <HeroPage {...hero} />               {/* instant — static */}
      <Suspense fallback={<StatBandSkeleton />}>
        <ImpactStats />                     {/* streams */}
      </Suspense>
      <Suspense fallback={<GridSkeleton count={6} />}>
        <CaseStudyGrid />                   {/* streams */}
      </Suspense>
    </>
  )
}
```

**Skeletons must match final dimensions exactly** — a skeleton of the wrong height is a CLS
generator wearing a loading-state costume.

---

## Database & API

- Indexes on every column used in a `WHERE` or `ORDER BY` (see
  [schema](06-database-schema.md) — they are already declared).
- No N+1: Prisma `include` over loops.
- Writes (form submissions) never block a render — they are Server Actions on a user gesture.
- Email sending is fire-and-forget with `void … .catch(report)`, so a Resend outage cannot
  fail a lead submission.
- AI routes have `maxDuration = 60` and stream from the first token, so perceived latency is
  ~600ms even when the full response takes 20s.

---

## Monitoring

| Tool | Watches |
|---|---|
| Vercel Speed Insights | Real-user CWV, by route and device |
| Vercel Analytics | Traffic, no cookie |
| Lighthouse CI | Per-PR budget enforcement — **the gate** |
| Sentry | Errors + performance traces, 10% sample |
| Search Console | Field CWV as Google sees them |
| Custom | `AiConversation.latencyMs`, token spend per feature |

**Weekly review** of the five budgeted routes' field data. Any route whose p75 LCP crosses 2.0s
gets an investigation ticket that week — not at the next audit.

---

## The failure modes to guard against

Every one of these has sunk a site with a good architecture doc.

1. **A single `"use client"` too high in the tree.** Marking a layout as a client component
   drags every child into the bundle. Check `next build` output on every PR — the route-size
   table tells you immediately.
2. **A wrong `sizes` prop.** Silent, invisible in dev on a fast connection, and doubles mobile
   page weight.
3. **An un-lazied YouTube embed** added later by someone who did not read this document. The
   `VideoEmbed` component exists so nobody has to.
4. **Analytics added directly to `layout.tsx`** instead of through the consent-gated loader.
5. **Framer Motion imported into a content component** for one small effect, pulling the whole
   section client-side.
6. **A skeleton with the wrong height**, silently generating CLS.

Items 1, 3, 4 and 5 are catchable by lint rules and the CI budget. Those rules are part of
Phase 1 setup, not a later hardening pass — they are cheap now and expensive to retrofit once
the violations exist.
