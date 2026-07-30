# Khel Shiksha Platform — Architecture Overview

> **Status:** Design phase. Nothing is implemented. This directory is the complete pre-code
> deliverable set. Implementation begins only after sign-off.
>
> **Source of truth for content:** [`docs/brand-context.md`](../brand-context.md) — extracted
> from the print company profile. Do not re-analyze the PNGs.

## The thesis

Khel Shiksha is not a toy company with a website. It is an **experiential learning ecosystem**
that happens to ship physical kits. Every surface decision below flows from one sentence:

> A principal in Gandhinagar should land on this site and think *"these people understand
> what happens in my classroom"* — not *"these people want to sell me boxes."*

Concretely that means: **outcomes above catalogue**, **evidence above claims**, and **one
obvious next action per audience**. Products are proof, not merchandise. The 12,000 PM SHRI
kits, the UNICEF modules, and the NCF 2023 alignment are the load-bearing trust assets — they
appear above the fold, not buried in an "About" page.

## Deliverable index

| # | Deliverable | Document |
|---|---|---|
| 1, 2 | Information Architecture + Site Map | [01-information-architecture.md](01-information-architecture.md) |
| 10 | User Journeys | [02-user-journeys.md](02-user-journeys.md) |
| 4 | Design System | [03-design-system.md](03-design-system.md) |
| 3 | Wireframes | [04-wireframes.md](04-wireframes.md) |
| 5 | Component Inventory | [05-component-inventory.md](05-component-inventory.md) |
| 6 | Database Schema (Prisma) | [06-database-schema.md](06-database-schema.md) |
| 7 | CMS Schema (Sanity) | [07-cms-schema.md](07-cms-schema.md) |
| 8 | Folder Structure | [08-folder-structure.md](08-folder-structure.md) |
| 9 | API Design + AI service layer | [09-api-design.md](09-api-design.md) |
| 11 | Animation Plan | [10-animation-plan.md](10-animation-plan.md) |
| 12 | SEO Strategy | [11-seo-strategy.md](11-seo-strategy.md) |
| 13 | Performance Strategy | [12-performance-strategy.md](12-performance-strategy.md) |
| 14 | Accessibility Checklist | [13-accessibility-checklist.md](13-accessibility-checklist.md) |
| 15 | Implementation Roadmap | [14-implementation-roadmap.md](14-implementation-roadmap.md) |

## Architectural decisions (made, not surveyed)

These are the calls that everything else depends on. Each has a stated reason and a stated cost.

### D1 — Sanity owns editorial content; Postgres owns transactional data. Never both.

The single most important boundary in this system. Duplicating product data into Postgres to
"make joins easier" is the failure mode that kills CMS-driven sites.

| Sanity (editorial, versioned, non-technical editors) | Postgres (transactional, queryable, user-owned) |
|---|---|
| Products, pillars, pages, blog posts, case studies, testimonials, partners, gallery, team, FAQ | Leads/enquiries, demo bookings, newsletter subscribers, resource downloads, users & sessions, search analytics, AI conversation logs |

Cross-references are by **string ID only** — a `Lead` row stores `sanityProductId: String?`.
There is no `Product` table. Resolution happens at read time in the service layer.

**Cost:** analytics that join leads to product metadata require two fetches. Accepted — the
volume is low and Sanity's CDN read is ~20ms.

### D2 — Auth.js v5 with the Prisma adapter, not Clerk.

The auth surface here is small and late-stage: gated teacher-resource downloads and (phase 3) a
school implementation portal. The user profile carries domain data we own — school affiliation,
grades taught, district — which belongs in our Postgres, not a vendor's user object.

**Cost:** we build the sign-in UI ourselves (~2 days) that Clerk gives free. Accepted, because
Clerk's per-MAU pricing on a lead-gen site with a long-tail teacher audience is poor value and
the vendor lock on user data is real.

**Reconsider if:** the roadmap adds multi-tenant school orgs with role management in phase 3.
That is the point where Clerk's org primitives start earning their keep.

### D3 — Search is three tiers behind one interface.

"My child likes maths" is not a keyword query. But shipping a full semantic pipeline in week 3
is how projects die.

1. **Tier 1 — instant typeahead.** Prebuilt JSON index (~15KB gzipped) of product names, skills,
   subjects. Client-side fuzzy match. Ships week 5. Zero latency, zero cost.
2. **Tier 2 — structured filters.** Postgres-free; filtering happens over the Sanity-fetched
   product set, cached at the edge. Ships week 6.
3. **Tier 3 — intent parsing.** Natural-language query → structured filter object via Claude.
   `"my child likes maths"` → `{ subjects: ["mathematics"], audience: "parent" }`. Ships phase 3.

All three sit behind `SearchService.query(input): SearchResult[]`. Tier 3 slots in with no
call-site changes. See [09-api-design.md](09-api-design.md).

### D4 — AI is a port, not a dependency.

Every AI feature (Product Advisor, Lesson Planner, Activity Generator, Parent Guide, Chatbot)
implements a narrow interface in `services/ai/`. Route handlers and server actions never import
`@anthropic-ai/sdk` directly. Model choice, prompt text, and caching strategy live in one place.

Model: **`claude-opus-5`** (1M context, adaptive thinking). Product catalogue + pedagogy context
is a stable ~8K-token prefix — cached with a 1-hour TTL, so per-request cost is dominated by
the user's actual question. Full rationale, pricing, and the streaming pattern:
[09-api-design.md](09-api-design.md).

### D5 — Server Components by default. `"use client"` is a justified exception.

Every page is a Server Component that fetches from Sanity. Interactivity is pushed to the
smallest possible leaf (`<ProductFilterBar />`, not `<ProductsPage />`). Framer Motion imports
are the main source of accidental client boundaries — they get isolated into thin wrappers.

### D6 — Desktop-first design, mobile-first delivery.

The brief says desktop-first, and that is right for the *design* work: schools and government
buyers evaluate on desktop, and the layouts are richest there. But the **majority of Indian
teacher and parent traffic will be Android mobile on 4G**. So: design at 1440px, build the CSS
mobile-up, and set the performance budget against a mid-tier Android on Slow 4G.

## Resolved decisions

### D7 — Products are a **portfolio**, not a catalogue. No public pricing.

Kits are presented as capability and evidence. Every product CTA is **"Enquire"**, never
"Buy" or "Add to cart". Consequences that follow automatically:

- `Product` JSON-LD ships **without** an `offers` block. We never fabricate a price to win a
  rich result.
- The `budget` facet is dropped from the product filters — 8 facets, not 9.
- No cart, checkout, payment gateway, or inventory. If pricing becomes public later, that is a
  separate project with its own phase, not a flag flip.
- The product page's job is to make someone *enquire*, so the enquiry form is inline and
  pre-filled with the product, not a link to `/contact`.

### D8 — Gujarati (`gu`) is in scope. Build i18n-ready now, launch English.

Retrofitting locale support is the expensive path, so the structure goes in from day one and
the content follows when it is ready:

| Now (Phase 0–1) | Later (when content exists) |
|---|---|
| Sanity localised field types on translatable content | Gujarati copy entered by editors |
| `lib/i18n/` — locale config, dictionary loader, `t()` | `/gu/...` route segment activated |
| Baloo Bhai 2 reserved and wired, loaded only on `gu` routes | — |
| `hreflang` scaffolding in the metadata builder | `hreflang` pairs emitted |
| No hardcoded user-facing strings in components | — |

The last row is the one that actually matters. Every user-facing string lives in a dictionary
from the first commit; a component that hardcodes "Book a Demo" is the thing that makes
translation a rewrite instead of a data entry task.

### D9 — Content is authored in-house (by this project) until a writer is hired.

Phase 2's cadence assumption changes: rather than 2 posts/month from a content team, the
initial corpus is written as part of the build, seeded directly into Sanity. Practically:

- All page copy, product descriptions, outcomes, and FAQ content are drafted here and reviewed
  by you — never lorem ipsum, per the roadmap's own rule.
- Phase 2's blog target drops to a **launch set of 4–6 substantial posts** targeting the
  highest-value long-tail clusters, rather than an ongoing monthly cadence.
- Sanity roles and the editorial workflow are still built, so a hired writer is productive on
  day one without an engineering change.

---

## Open questions still outstanding

Neither blocks Phase 0 or Phase 1 component work.

1. **Full product catalogue.** The brochure describes 6 games and shows 4 more on the shelf
   (Santulan, Climato, Vasudhaiv Kutumbkam, one unreadable). Needed to finalise the filter
   taxonomy — required by week 5. Until then the build uses the 6 documented kits.
2. **Clean partner logos + written permission.** UNICEF, GUJCOST, PM SHRI, GEDA, BAPS et al.
   were read by inference from a print scan. Vector files and permission needed before a
   partner strip ships — required by week 3.
3. **Photography.** Real classroom images from the PM SHRI deployments, with consent, would be
   a step change in credibility over rendered illustrations — required by week 4.
