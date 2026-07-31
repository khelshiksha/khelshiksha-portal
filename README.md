# Khel Shiksha Portal

The website for **Khel Shiksha** — gamified experiential learning kits, a Game Corner for the
classroom, and teacher training for Vidyalayas across India.

> **Learning Through Play.** Build • Play • Learn

## Getting started

```bash
npm install
cp .env.example .env.local   # nothing is required to run locally
npm run dev
```

The site runs with no credentials at all. Content comes from typed local files, and enquiries
are written to `.data/leads.jsonl` in development.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright — accessibility, keyboard journeys, no-JS. Builds first. |
| `npm run format` | Prettier |

## What is and isn't wired

The honest state of the system. See [`docs/architecture/`](docs/architecture/) for the
reasoning behind each boundary.

| Capability | Status | To activate |
|---|---|---|
| Site, content, navigation, SEO | **Working** | — |
| Enquiry forms (validation, rate limiting, no-JS submit) | **Working** | — |
| Lead persistence | **Needs `DATABASE_URL`** | Provision Postgres, then `npx prisma migrate deploy` |
| Lead notification email | **Needs `RESEND_API_KEY`** | Add key + `LEAD_NOTIFY_TO` |
| Content editing in a CMS | **Not wired** | Create a Sanity project; `services/cms` swaps to GROQ with no call-site changes |
| AI advisor / lesson planner | **Not started** | Phase 3 |

### Without a database

Enquiries **cannot be stored in production**, and the form says so — it surfaces the phone
number rather than reporting a false success. This is deliberate: silently swallowing an
enquiry is the worst possible failure on a lead-generation site.

```bash
# 1. Provision Postgres (Neon or Supabase), set DATABASE_URL + DIRECT_DATABASE_URL
# 2. Create the tables
npx prisma migrate dev --name init     # local
npx prisma migrate deploy              # production / CI
```

Nothing in the application changes — `getLeadRepository()` returns the Postgres-backed
implementation as soon as `DATABASE_URL` is present.

## Architecture

Fifteen documents in [`docs/architecture/`](docs/architecture/), covering information
architecture, user journeys, the design system, data and CMS schemas, API design, and the
animation, SEO, performance and accessibility strategies.

Four boundaries worth knowing before changing anything:

1. **`services/cms` is the only way to read content.** Pages never import `src/content`
   directly, so swapping the local adapter for Sanity is contained to one module.
2. **`src/styles/theme.css` is the only file permitted to contain a hex colour.** Every value
   in it has a computed contrast ratio recorded beside it.
3. **One zod schema per form**, imported by both the client component and the Server Action, so
   client-side UX validation and the real server check cannot drift.
4. **Import direction is one-way:** `app → features → components → lib`, with `services` as the
   only place third-party SDKs are imported.

## Quality gates

Every one of these passes on `main`:

- TypeScript strict, zero errors
- ESLint, zero warnings
- 29 unit tests (Vitest)
- 41 end-to-end checks (Playwright), including **zero axe violations** on WCAG 2.1 A/AA across
  desktop and a Pixel 7 profile, a keyboard-only demo booking, and the site working with
  JavaScript disabled

E2E runs against a production build, not the dev server — a dev-server audit misses
minification, real hydration timing, and the actual shipped CSS.

## Content

`docs/brand-context.md` is the extracted reference from the company profile brochure — vision,
mission, the five pillars, the kit catalogue, credibility markers and contact details. Read it
before writing site copy.

Three content blockers are tracked in
[`docs/architecture/14-implementation-roadmap.md`](docs/architecture/14-implementation-roadmap.md):
the full kit catalogue, partner logos with written permission, and real classroom photography.

## Assets

`assets/` — reference materials, including the company profile brochure the content was
extracted from.
