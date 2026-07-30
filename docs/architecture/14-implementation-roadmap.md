# 15. Implementation Roadmap

## Sequencing principle

Ship a **complete, excellent, narrow** site before a broad, half-finished one. Phase 1 ends
with a live site that converts — not a scaffold waiting for content.

The ordering is driven by conversion value, not by technical convenience:

> Home + `/schools` + `/products` capture roughly 80% of the commercial value. They are built
> first, to final quality, before anything else starts.

Estimates assume **one full-time engineer**, with design and content in parallel. A second
engineer compresses phases 2–3 by roughly 40%, not 50% — some work is inherently serial.

---

## Phase 0 — Foundation (Week 1)

*Nothing user-visible. Everything downstream depends on it.*

- Next.js 15 + TypeScript strict + Tailwind v4 + ESLint/Prettier/Husky/lint-staged
- **Design tokens in `theme.css`** — the palette from [03](03-design-system.md), verified ratios
- Fonts via `next/font` (Plus Jakarta Sans + Fraunces), CLS-checked
- shadcn/ui initialised and re-themed to our tokens
- Sanity project + schemas + Studio at `/studio` + typegen
- Postgres (Neon) + Prisma + initial migration
- `lib/env.ts` — build fails on a missing key
- Vercel project, preview deploys, Neon branch-per-PR
- CI: typecheck, lint, Vitest, axe, **Lighthouse budget**
- ESLint import-boundary rules (`app → features → components → lib`)

**Exit criteria:** `main` deploys green; a Sanity edit appears on a preview URL; CI fails a
deliberately-introduced budget regression. Do not proceed until that last one is proven — a
budget nobody has seen fail is not enforced.

---

## Phase 1 — Core conversion site (Weeks 2–6)

*The goal: a site that could be the real site.*

**Week 2 — primitives & chrome**
Tier-2 components · `SiteHeader` + `MegaMenu` + `MobileNavSheet` · `SiteFooter` ·
`Breadcrumbs` · `SkipToContent` · `Reveal` · dark-mode toggle · 404/500 pages

**Week 3 — homepage**
`HeroHome` (entrance + parallax) · trust bar · audience split · `PillarGrid` · `FeatureGrid` ·
`StatBand` + `Counter` · `PartnerLogoStrip` · `TestimonialCarousel` · `CTABand` ·
`VideoEmbed` facade

**Week 4 — audience hubs**
`HeroAudience` + the shared hub template · `/schools` complete (timeline, alignment strip, FAQ,
inline form) · `/teachers`, `/parents`, `/government` at v1

**Week 5 — products & lead capture**
`/products` index with 9-facet filtering + URL state · `/products/[slug]` full detail ·
`ProductCard`/`Grid`/`FilterBar`/`SpecTable` · **all Server Actions** (lead, demo, newsletter) ·
Resend notifications · rate limiting · honeypot

**Week 6 — content types, polish, launch**
`/approach` + 5 pillar pages · `/about` · `/contact` · `/privacy` · `/terms` ·
full SEO layer (metadata, JSON-LD, sitemap, robots, OG) · accessibility manual pass ·
performance tuning to budget · **content load** · launch

**Phase 1 exit criteria — all must be true:**
- [ ] Lighthouse mobile: Perf ≥ 95, **A11y 100**, BP 100, SEO ≥ 95 on all five budgeted routes
- [ ] Journeys J1 (school demo) and J3 (parent enquiry) complete end-to-end on a real Android
- [ ] Keyboard-only pass of J1 with no mouse
- [ ] Zero axe violations
- [ ] Every page has real content — no lorem ipsum, no placeholder images
- [ ] Forms deliver to the team inbox and write to Postgres
- [ ] Search Console verified, sitemap submitted

---

## Phase 2 — Content engine & trust (Weeks 7–11)

*Turns a brochure site into a compounding asset.*

| Week | Deliverable |
|---|---|
| 7 | Blog: index, post, categories, author, TOC, reading progress, related posts, `Article` JSON-LD |
| 8 | Resource library + `DownloadGate` + signed URLs + `ResourceDownload` tracking + double-opt-in newsletter. **This closes journey J2 — the highest-leverage remaining work.** |
| 9 | Case studies (index + detail) · `/impact` with counters and district map · `/impact/gallery` with lightbox |
| 10 | Global search: prebuilt index, ⌘K palette, `/search` page, `SearchQuery` telemetry (tiers 1–2 of [D3](00-overview.md#d3--search-is-three-tiers-behind-one-interface)) |
| 11 | `/government/pm-shri` deep case study · `/schools/{implementation,teacher-training,outcomes}` · `/careers` · **print stylesheet for `/government`** (journey J4) · scroll story (GSAP) · analytics + consent |

**Exit criteria:** 8+ blog posts and 10+ resources live · a teacher can find, download, and be
tracked · zero-result search report producing real data · budgets still green.

---

## Phase 3 — Intelligence (Weeks 12–16)

*Only after the fundamentals are proven. AI on a slow site is a slow site with AI.*

| Week | Deliverable |
|---|---|
| 12 | AI foundation: `services/ai/` ports, client, prompt versioning, catalogue context builder (cached prefix), telemetry, rate limiting, `AIDisclosure` |
| 13 | **Product Advisor** — streaming route handler, tool-grounded catalogue search, `AdvisorChat` UI, non-AI fallback to the guided finder |
| 14 | **Search intent parsing** (tier 3) — slots behind the existing `SearchService` with no UI change |
| 15 | **Lesson Planner** + **Activity Generator** — authenticated teacher features. Auth.js v5 lands here, driven by real need rather than speculation. |
| 16 | **Parent Guide** + site **Chatbot** · AI quality review · cost review against `AiConversation` telemetry |

**Exit criteria:** every AI feature streams first token < 1s · every AI feature has a working
non-AI path · **the entire site works with the AI service switched off** · token spend per
feature is measured, not estimated · zero hallucinated product names in a 50-query manual review.

---

## Phase 4 — Scale & optimise (Ongoing)

- School portal: implementation tracking, training records, outcome dashboards (the point at
  which [D2](00-overview.md#d2--authjs-v5-with-the-prisma-adapter-not-clerk) should be
  re-examined — multi-tenant orgs are where Clerk starts earning its cost)
- Gujarati localisation, if D3 resolves yes
- A/B testing on hub CTAs via PostHog
- Third-party accessibility audit
- Conversion-rate work driven by real funnel data

---

## Critical path & blockers

```
Phase 0 ──▶ Phase 1 ──▶ Phase 2 ──▶ Phase 3
   │            │            │
   │            │            └── needs: content team producing posts
   │            └── needs: FULL PRODUCT CATALOGUE, partner logos, photography
   └── needs: Sanity org, Neon project, Vercel project, Anthropic key
```

**Hard blockers on Phase 1 — these stop work, and they are not engineering tasks:**

| # | Blocker | Needed by | Impact if late |
|---|---|---|---|
| 1 | **Complete product catalogue** — all kits with age, subject, skill, duration, group size | Week 5 | The filter taxonomy cannot be finalised. Products ship with placeholder facets or slip. |
| 2 | **Clean partner logos + written permission** (UNICEF, PM SHRI, GUJCOST, GEDA, BAPS…) | Week 3 | The trust bar is the homepage's most valuable element. It ships empty or it ships with logos we lack rights to — the second is not an option. |
| 3 | **Real classroom photography** from PM SHRI deployments | Week 4 | Falls back to rendered illustrations, which materially weakens credibility for journeys J1 and J4. |
| 4 | **Pricing decision (D5)** | Week 5 | Determines whether `/products` is a catalogue or a portfolio, and whether `Product` JSON-LD can carry `offers`. |
| 5 | **Gujarati decision (D3)** | Week 1 | Cheap to plan for now; a week to retrofit later. Needed before Sanity schemas are frozen. |

Blockers 1–3 are content, not code. **They are the real project risk.** Engineering can build
every component in week 3 and still have nothing shippable in week 6 without them.

---

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content not ready at launch | **High** | High | Start content collection in week 1, in parallel with Phase 0. Seed Sanity with real data from day one, never lorem ipsum — placeholder content hides layout problems until it is too late to fix them. |
| Performance budget slips as features land | Medium | High | CI enforcement from week 1. A budget added later is a budget that gets waived. |
| AI cost overrun | Medium | Medium | Prompt caching, per-session rate limits, token telemetry from day one of Phase 3, weekly cost review. |
| Scope creep into a full e-commerce build | Medium | High | D5 is a decision, not a drift. If public pricing is chosen, cart/checkout is a separate project with its own phase. |
| Design-system drift | Medium | Medium | No hex values outside `theme.css`; `colorKey` enums in Sanity instead of colour pickers; lint rule on raw colour literals. |
| Single-engineer bus factor | Medium | High | These fifteen documents are the mitigation. They are why the design phase exists. |

---

## What "done" means

Phase 1 is complete when a principal in Mehsana can, on her phone, in under four minutes:

1. Understand what Khel Shiksha does,
2. See that the government and UNICEF already trust it,
3. Understand what a rollout costs her in staff time, and
4. Book a demo —

without encountering a single loading spinner, a single unlabelled form field, or a single
piece of placeholder text.

Everything in these fifteen documents exists to make that specific four minutes work.
