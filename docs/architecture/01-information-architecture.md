# 1–2. Information Architecture & Site Map

## Organising principle

The site has **two orthogonal axes**, and conflating them is the classic ed-tech IA mistake:

- **WHO you are** → Schools, Teachers, Parents, Government/NGO. Audience hubs.
- **WHAT we do** → Pillars, Products, Impact, Resources. Capability content.

Navigation leads with WHO, because a principal and a parent need completely different proof and
completely different next actions. Capability content is shared and cross-linked from each hub.

Products are deliberately **not** a top-level nav item. They live under "What We Do" as evidence.
A visitor who wants the catalogue finds it in one click; a visitor who wants to understand the
approach is never dumped into a grid of boxes.

## Primary navigation

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [KhelShiksha ®]   For Schools  For Teachers  For Parents  Government     │
│                   What We Do ▾   Impact   Resources ▾        [Book Demo] │
└──────────────────────────────────────────────────────────────────────────┘

What We Do ▾  (mega-menu, 3 columns)
 ├ Col 1 — The Approach     ├ Col 2 — The 5 Pillars      ├ Col 3 — Products
 │  Learning Through Play   │  Foundational (FLN)        │  All Learning Kits →
 │  Why Experiential        │  Health & Nutrition        │  ─────────────────
 │  Game Corner / Zone      │  Climate Education         │  Project SURAKSHA
 │  NEP 2020 & NCF 2023     │  Future Readiness          │  Aryabhata
 │                          │  Life Skills               │  Yoga Safari
 │                          │                            │  Brainy Bee

Resources ▾  (2 columns)
 ├ Lesson Plans        ├ Blog
 │ Activity Sheets     │ Case Studies
 │ Teacher Guides      │ Gallery
 │ Brochures (PDF)     │ Press & News
```

**Utility nav (top-right, small):** Careers · Contact · Search (⌘K)
**Persistent CTA:** `Book a Demo` — solid blue button, present at every breakpoint.

## Site map

```
/                                    Home
│
├─ /schools                          ★ Audience hub — principals, trustees, admins
│   ├─ /schools/implementation       How a rollout actually works (timeline)
│   ├─ /schools/teacher-training     Training programme detail
│   ├─ /schools/outcomes             Measurement & monitoring framework
│   └─ /schools/case-studies         Filtered case-study index (school segment)
│
├─ /teachers                         ★ Audience hub — classroom educators
│   ├─ /teachers/lesson-plans        Filterable library (gated download)
│   ├─ /teachers/activities          Quick classroom activities
│   └─ /teachers/training            CPD / certification
│
├─ /parents                          ★ Audience hub — home learners
│   ├─ /parents/at-home              Activities requiring no kit
│   └─ /parents/choosing-a-kit       Guided finder → AI Advisor (phase 3)
│
├─ /government                       ★ Audience hub — govt bodies & NGOs
│   ├─ /government/alignment         NEP 2020 · NCF 2023 · Fit India · Mission LiFE
│   ├─ /government/scale             District/state deployment model
│   └─ /government/pm-shri           The 12,000-kit PM SHRI story
│
├─ /approach                         Learning Through Play — the philosophy
│   ├─ /approach/why-experiential    The 5 benefits, evidence-led
│   ├─ /approach/pillars             The 5 Pillars overview
│   │   └─ /approach/pillars/[slug]  foundational-learning | health-nutrition |
│   │                                climate-education | future-readiness | life-skills
│   └─ /approach/game-corner         The physical Experiential Learning Zone
│
├─ /products                         Catalogue with 9-facet filtering
│   └─ /products/[slug]              project-suraksha | aryabhata | aahar |
│                                    yoga-safari | brainy-bee | naturebola | …
│
├─ /impact                           Numbers, map, partners, testimonials
│   ├─ /impact/case-studies          All case studies
│   │   └─ /impact/case-studies/[slug]
│   └─ /impact/gallery               Photo & video, filterable by event
│
├─ /resources                        Resource hub index
│   ├─ /resources/[slug]             Individual downloadable
│   └─ /blog
│       ├─ /blog/[slug]              Article
│       └─ /blog/category/[slug]     Category index
│
├─ /about                            Vision, mission, story, team
│   └─ /about/team
├─ /careers
│   └─ /careers/[slug]
├─ /contact                          Routed enquiry forms
│
├─ /search                           Full search results (⌘K palette overlays this)
│
└─ (utility)  /privacy · /terms · /sitemap.xml · /robots.txt · 404 · 500
```

★ = audience hub. These four pages carry the primary conversion load.

## URL conventions

| Rule                                            | Example                                       |
| ----------------------------------------------- | --------------------------------------------- |
| Lowercase, hyphenated, no trailing slash        | `/approach/pillars/climate-education`         |
| Audience hubs are single nouns at root          | `/schools`, not `/for-schools`                |
| Never expose CMS IDs                            | `/products/aryabhata`, not `/products/a7f3-…` |
| Category pages are `/[section]/category/[slug]` | `/blog/category/foundational-learning`        |
| Legacy/typo redirects live in `next.config.ts`  | `/for-schools` → 308 → `/schools`             |

## Content taxonomy

Two vocabularies, one shared, one product-specific.

**Shared taxonomy (`pillar`)** — tags products, blog posts, case studies, and resources alike.
This is what makes cross-linking work: a Climate Education pillar page can pull its own
products, articles, and case studies with a single tag query.

```
foundational-learning · health-nutrition · climate-education ·
future-readiness · life-skills
```

**Product facets (9 filters, per the brief)**

| Facet         | Type   | Values                                                                  |
| ------------- | ------ | ----------------------------------------------------------------------- |
| Age           | range  | 3–5 · 6–8 · 9–11 · 12–14 · 14+                                          |
| Grade         | range  | Pre-primary · 1–2 · 3–5 · 6–8 · 9–10                                    |
| Subject       | multi  | Maths · Language · Science · EVS · Health · Values · Life Skills        |
| Skill         | multi  | Problem-solving · Teamwork · Communication · Creativity · Motor · Focus |
| Learning goal | multi  | Mapped to the 5 pillars                                                 |
| Duration      | single | <15 min · 15–30 · 30–45 · 45+                                           |
| Setting       | single | Indoor · Outdoor · Either                                               |
| Group size    | single | Solo · Pair · Small (3–6) · Whole class                                 |
| Budget        | range  | Only if D5 (public pricing) is resolved yes                             |

## Navigation rules

1. **Three clicks maximum** from home to any leaf. Verified against the map above.
2. **Every page has a next action.** No dead ends. Leaf pages end in a contextual CTA block
   matched to the audience that most likely landed there.
3. **Breadcrumbs on every page below depth 1**, with `BreadcrumbList` structured data.
4. **Mobile nav is a full-screen sheet**, accordion-grouped by the same WHO/WHAT split. The
   `Book a Demo` CTA is pinned to the sheet footer, always thumb-reachable.
5. **⌘K search is global** and available from every page including 404.

## Conversion architecture

Each audience hub drives exactly one primary action. Secondary actions exist but are visually
subordinate — this is the difference between a site that converts and a site with eleven buttons.

| Audience   | Primary CTA          | Secondary            | Lands in                       |
| ---------- | -------------------- | -------------------- | ------------------------------ |
| Schools    | Book a Demo          | Download brochure    | `Lead(type=SCHOOL_DEMO)`       |
| Teachers   | Download lesson plan | Join training        | `ResourceDownload` + soft lead |
| Parents    | Find the right kit   | Browse activities    | `Lead(type=PARENT_ENQUIRY)`    |
| Government | Request a proposal   | Download impact deck | `Lead(type=GOVT_PROPOSAL)`     |

Every form captures `source` (page path), `utm_*`, and `pillarInterest` so the team can see
which pillar and which content actually generates enquiries.
