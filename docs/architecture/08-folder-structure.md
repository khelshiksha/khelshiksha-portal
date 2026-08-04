# 8. Folder Structure

Feature-first. The rule that makes it hold: **`features/` may import from `components/`,
`lib/`, and `services/`. Nothing may import from `features/` except `app/`.** A feature is a
leaf, not a hub. Enforced by ESLint `import/no-restricted-paths`, not by hope.

```
khelshiksha-portal/
├── src/
│   ├── app/                          # ROUTING ONLY — thin. No business logic here.
│   │   ├── (marketing)/              # route group: shares the public header/footer
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # /
│   │   │   ├── schools/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── implementation/page.tsx
│   │   │   │   ├── teacher-training/page.tsx
│   │   │   │   └── outcomes/page.tsx
│   │   │   ├── teachers/{page,lesson-plans,activities,training}
│   │   │   ├── parents/{page,at-home,choosing-a-kit}
│   │   │   ├── government/{page,alignment,scale,pm-shri}
│   │   │   ├── approach/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── why-experiential/page.tsx
│   │   │   │   ├── game-corner/page.tsx
│   │   │   │   └── pillars/[slug]/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [slug]/{page.tsx,opengraph-image.tsx,not-found.tsx}
│   │   │   ├── impact/{page,case-studies/[slug],gallery}
│   │   │   ├── resources/{page,[slug]}
│   │   │   ├── blog/{page,[slug],category/[slug]}
│   │   │   ├── about/{page,team}
│   │   │   ├── careers/{page,[slug]}
│   │   │   ├── contact/page.tsx
│   │   │   └── search/page.tsx
│   │   │
│   │   ├── (legal)/{privacy,terms}/page.tsx
│   │   ├── studio/[[...tool]]/page.tsx      # embedded Sanity Studio at /studio
│   │   │
│   │   ├── api/
│   │   │   ├── revalidate/route.ts          # Sanity webhook (HMAC-verified)
│   │   │   ├── draft/route.ts               # preview mode enter/exit
│   │   │   ├── search/route.ts              # search index + query
│   │   │   ├── og/route.tsx                 # dynamic OG images
│   │   │   └── ai/
│   │   │       ├── advisor/route.ts         # streaming — Route Handler, not Server Action
│   │   │       ├── lesson-planner/route.ts
│   │   │       └── chat/route.ts
│   │   │
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── manifest.ts
│   │   ├── layout.tsx                       # <html>, fonts, theme script, analytics
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── global-error.tsx
│   │
│   ├── components/                   # PRESENTATION ONLY — no data fetching, no domain logic
│   │   ├── ui/                       # tier 2 — Button, Card, Chip, SectionTitle, Reveal…
│   │   ├── blocks/                   # tier 3 — heroes, grids, bands, forms
│   │   │   ├── heroes/  content/  proof/  product/  conversion/  navigation/  utility/
│   │   └── icons/                    # custom pillar icons + logo marks
│   │
│   ├── features/                     # tier 4 — domain slices. Self-contained.
│   │   ├── products/
│   │   │   ├── components/           # ProductDetailView, ProductFilterProvider
│   │   │   ├── hooks/                # useProductFilters
│   │   │   ├── lib/                  # filter predicate, facet counting, URL codec
│   │   │   ├── queries.ts            # GROQ + typed fetchers
│   │   │   └── types.ts
│   │   ├── schools/  teachers/  parents/  government/
│   │   ├── blog/  resources/  case-studies/  gallery/
│   │   ├── leads/
│   │   │   ├── actions.ts            # Server Actions: submitLead, bookDemo
│   │   │   ├── schema.ts             # zod — shared by client and server. One definition.
│   │   │   ├── components/
│   │   │   └── notifications.ts      # email on new lead
│   │   ├── search/
│   │   └── ai/                       # UI only; the model calls live in services/ai
│   │
│   ├── services/                     # EXTERNAL BOUNDARIES — the only place SDKs are imported
│   │   ├── ai/
│   │   │   ├── client.ts             # the single `new Anthropic()` in the codebase
│   │   │   ├── ports.ts              # AdvisorPort, LessonPlannerPort, IntentParserPort…
│   │   │   ├── prompts/              # versioned system prompts (cacheable prefixes)
│   │   │   ├── advisor.ts  lesson-planner.ts  activity-generator.ts
│   │   │   ├── parent-guide.ts  chatbot.ts  intent-parser.ts
│   │   │   ├── context.ts            # builds the stable cached catalogue prefix
│   │   │   └── telemetry.ts          # writes AiConversation rows
│   │   ├── cms/
│   │   │   ├── client.ts             # Sanity client (CDN + preview variants)
│   │   │   ├── queries/              # GROQ, one file per document type
│   │   │   ├── image.ts              # urlFor builder
│   │   │   └── types.generated.ts    # sanity typegen output — DO NOT EDIT
│   │   ├── db/
│   │   │   ├── client.ts             # PrismaClient singleton (dev HMR-safe)
│   │   │   └── repositories/         # leadRepo, downloadRepo, subscriberRepo
│   │   ├── email/                    # Resend — templates + send
│   │   ├── media/                    # Cloudinary signing + transforms
│   │   └── analytics/                # GA4, Clarity, PostHog — one `track()` facade
│   │
│   ├── lib/                          # PURE UTILITIES — no I/O, no React, no env access
│   │   ├── utils.ts                  # cn(), slugify, formatters
│   │   ├── seo.ts                    # metadata + JSON-LD builders
│   │   ├── validation/               # shared zod primitives (indianPhone, email…)
│   │   ├── constants.ts              # routes, pillar keys, facet definitions
│   │   ├── rate-limit.ts
│   │   └── env.ts                    # zod-validated process.env — fails the build if wrong
│   │
│   ├── hooks/                        # generic React hooks (useMediaQuery, useScrollProgress…)
│   ├── types/                        # global TS types + module augmentation
│   └── styles/
│       ├── globals.css
│       ├── theme.css                 # @theme tokens — the ONLY place hex values exist
│       └── print.css                 # /government print stylesheet (journey J4)
│
├── prisma/{schema.prisma,migrations/,seed.ts}
├── sanity/
│   ├── schemas/{documents/,objects/,sections/,index.ts}
│   ├── structure.ts                  # desk + singleton pinning
│   └── sanity.config.ts
├── public/{fonts/,images/,icons/}
├── tests/
│   ├── unit/                         # Vitest
│   ├── e2e/                          # Playwright
│   └── a11y/                         # axe-core sweeps
├── .github/workflows/ci.yml
└── {next.config.ts, tsconfig.json, eslint.config.mjs, vitest.config.ts, playwright.config.ts}
```

---

## The rules that keep it clean

**1. `app/` is routing, not logic.** A `page.tsx` fetches, composes, exports metadata. If it
exceeds ~80 lines, its content belongs in a feature.

```tsx
// app/(marketing)/products/[slug]/page.tsx — the shape every page should have
import { getProductBySlug, getProductSlugs } from "@/features/products/queries";
import { ProductDetailView } from "@/features/products/components/product-detail-view";
import { buildProductMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
```

**2. Import direction is one-way.**

```
app  →  features  →  components  →  lib
                 ↘   services    ↗
```

`components/` never imports `features/`. `lib/` imports nothing from the app at all. Violations
fail CI.

**3. SDK imports are confined to `services/`.** `@anthropic-ai/sdk`, `@sanity/client`,
`@prisma/client`, `resend`, `cloudinary` appear in exactly one file each. Swapping a vendor is
then a contained change instead of a migration.

**4. One zod schema per form, shared both ways.** `features/leads/schema.ts` is imported by the
client component (react-hook-form resolver) _and_ the Server Action (revalidation). Client-side
validation is UX; server-side validation is the actual check. They cannot drift because there
is one definition.

**5. `lib/env.ts` validates the environment at build time.**

```ts
export const env = z
  .object({
    DATABASE_URL: z.string().url(),
    DIRECT_DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    SANITY_API_READ_TOKEN: z.string().min(1),
    SANITY_WEBHOOK_SECRET: z.string().min(16),
    ANTHROPIC_API_KEY: z.string().startsWith("sk-ant-"),
    RESEND_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(32),
    APP_SALT: z.string().min(32),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  })
  .parse(process.env);
```

A missing key breaks the build, not a user's form submission at 11pm.

**6. Naming.** Files `kebab-case.tsx`. Components `PascalCase`. Hooks `useCamelCase`.
Server Actions are verbs (`submitLead`, `bookDemo`). GROQ queries are nouns (`productBySlug`).
Types are `PascalCase`, no `I` prefix.

**7. Path alias is `@/*` → `src/*`.** No relative imports crossing more than one directory
level — `../../../components` is a smell that a module is in the wrong place.

---

## Configuration highlights

```ts
// next.config.ts
export default {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  async redirects() {
    return [
      { source: "/for-schools", destination: "/schools", permanent: true },
      {
        source: "/products/:slug/",
        destination: "/products/:slug",
        permanent: true,
      },
    ];
  },
  headers: () => [{ source: "/(.*)", headers: securityHeaders }], // CSP, HSTS, X-CTO…
} satisfies NextConfig;
```

**Code quality gate** (`.husky/pre-commit` → lint-staged): Prettier → ESLint `--max-warnings 0`
→ `tsc --noEmit` on staged files. CI additionally runs Vitest, Playwright, and a Lighthouse CI
budget check. A PR that regresses the performance budget does not merge.
