# 12. SEO Strategy

## Where the traffic actually comes from

Ranking for *"educational games India"* is a losing fight against marketplaces. The winnable
positions are **long-tail teacher and parent intent queries** and **institutional/scheme
queries** — where the competition is thin and the intent is high.

| Cluster | Example query | Target page | Why we can win |
|---|---|---|---|
| Teacher resource | "grade 4 maths activity worksheet pdf" | `/teachers/lesson-plans`, `/blog/*` | Volume + weak competition + we have real assets |
| Scheme alignment | "NEP 2020 experiential learning kit vendor" | `/government/alignment` | Almost nobody writes this content properly |
| Pillar/topic | "climate education activities for primary school" | `/approach/pillars/climate-education` | Genuine subject-matter depth |
| Parent intent | "screen free learning games for 6 year old" | `/parents`, `/products/*` | High commercial intent |
| Branded/proof | "PM SHRI learning kits Gujarat" | `/government/pm-shri` | We own the story — 12,000 kits |
| Product | "Aryabhata maths game" | `/products/aryabhata` | Unique product names, uncontested |

**The strategic bet:** the resource library is the SEO engine. Each lesson plan is a landing
page for a long-tail query, and each converts a teacher into an advocate (journey J2). Content
depth beats keyword optimisation here.

---

## Metadata

Every route exports `generateMetadata`. Nothing relies on defaults.

```ts
// lib/seo.ts
export function buildMetadata({
  title, description, path, image, type = 'website', noIndex = false,
}: SeoInput): Metadata {
  const url = new URL(path, SITE_URL).toString()
  return {
    title,                                     // template appends " | Khel Shiksha"
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large',
                       'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type, url, title, description, siteName: 'Khel Shiksha', locale: 'en_IN',
      images: [{ url: image ?? ogFallback(title), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description,
               images: [image ?? ogFallback(title)], site: '@khelshiksha' },
  }
}
```

**Rules**
- Titles ≤ 60 chars, unique across the site, primary term first. Template:
  `%s | Khel Shiksha` (root: `Khel Shiksha — Learning Through Play`).
- Descriptions 140–160 chars, written to earn a click, not to repeat the title.
- **Canonicals are absolute and self-referential on every page.** Faceted product URLs
  (`?age=8-12`) canonical to `/products` — this is the single most important technical SEO
  decision on this site. Nine facets combinatorially generate thousands of near-duplicate URLs;
  without this, the crawl budget is spent on noise.
- `noIndex` on: `/search`, `/api/*`, `/studio`, draft-mode pages, thank-you pages.

---

## Structured data

JSON-LD via `<script type="application/ld+json">`, built by typed helpers in `lib/seo.ts`.
Every emitted schema is validated in CI against the Rich Results Test.

| Schema | Where | Payoff |
|---|---|---|
| `Organization` + `EducationalOrganization` | root layout | Knowledge panel, brand entity |
| `WebSite` + `SearchAction` | root layout | Sitelinks search box |
| `BreadcrumbList` | every page > depth 1 | Breadcrumb rich result |
| `Product` | `/products/[slug]` | Product rich result. `offers` only if D5 resolves to public pricing — never fabricate a price. |
| `Course` | pillar + training pages | Course rich result — a genuinely under-used opportunity in Indian ed-tech |
| `Article` / `BlogPosting` | `/blog/[slug]` | Author, date, top-stories eligibility |
| `FAQPage` | any page with `FAQAccordion` | FAQ rich result — high CTR |
| `HowTo` | product "How to play" | Step-by-step rich result |
| `VideoObject` | any embedded video | Video thumbnail in SERP |
| `JobPosting` | `/careers/[slug]` | Google Jobs indexing |
| `LocalBusiness` | `/contact` | Local pack for Gujarat searches |

```ts
// Organization — the entity anchor for the whole site
{
  '@context': 'https://schema.org',
  '@type': ['Organization', 'EducationalOrganization'],
  name: 'Khel Shiksha',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  slogan: 'Build • Play • Learn',
  description: 'Gamified experiential learning kits and teacher training for schools in India.',
  telephone: ['+91-97798-73333', '+91-91731-48292'],
  email: 'adminkhelshiksha@gmail.com',
  areaServed: { '@type': 'State', name: 'Gujarat' },
  sameAs: [
    'https://instagram.com/khelshiksha',
    'https://facebook.com/khelshiksha',
    'https://x.com/khelshiksha',
  ],
}
```

---

## Sitemaps & robots

`app/sitemap.ts` generates dynamically from Sanity. Split at 10,000 URLs (not a near-term
concern, but the split logic costs nothing now and is annoying to retrofit).

| Section | `changeFrequency` | `priority` |
|---|---|---|
| `/` | weekly | 1.0 |
| Audience hubs | weekly | 0.9 |
| Products | monthly | 0.8 |
| Pillars, `/impact` | monthly | 0.8 |
| Blog posts | monthly | 0.6 |
| Resources | monthly | 0.6 |
| Legal | yearly | 0.2 |

```ts
// app/robots.ts
{
  rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/studio/', '/search'] }],
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: SITE_URL,
}
```

We do **not** block AI crawlers. For an organisation whose goal is to be recognised as the
authority on experiential learning in Indian schools, being cited in AI answers is a benefit,
not a leak.

---

## Images

- Every image is `next/image` via `MediaFrame`. Explicit `width`/`height` always — this is CLS
  prevention and an SEO signal simultaneously.
- **Alt text is enforced at the CMS layer** (`accessibleImage` requires it unless marked
  decorative). Descriptive, not keyword-stuffed: *"Grade 4 students playing the Aryabhata maths
  game in a Gandhinagar classroom"*.
- Filenames are slugged from content, not `IMG_4471.jpg`.
- AVIF → WebP → JPEG. Sanity CDN handles the transform chain.
- OG images: hand-authored per key page; dynamic `ImageResponse` at `/api/og` for products and
  blog posts.

---

## Content & internal linking

**Internal links are the most under-used lever on most sites.** Rules:

1. Every product links to its pillar; every pillar lists its products. Bidirectional.
2. Every blog post links to ≥1 product and ≥1 pillar, in-body with descriptive anchor text.
3. Every case study links to the products used and the relevant audience hub.
4. Audience hubs link to each other where a persona overlaps (`/schools` ↔ `/government`).
5. **No orphan pages.** CI fails if any sitemap URL has zero internal inbound links.
6. Anchor text is descriptive. "Read more" carries no signal — for crawlers or for screen
   readers, which is a nice case of accessibility and SEO being the same fix.

**Editorial cadence:** 2 posts/month minimum, each targeting one long-tail cluster. Pillar
pages are the hubs; posts are the spokes.

**E-E-A-T:** every post has a named author with a real bio and credentials. Case studies name
the school and district. The UNICEF, PM SHRI and GUJCOST associations are stated with specifics,
not adjectives — this is exactly the experience/authority signal Google's guidelines describe.

---

## Technical checklist

- [ ] One `<h1>` per page; heading levels never skip
- [ ] Semantic landmarks: `header` / `nav` / `main` / `article` / `aside` / `footer`
- [ ] Self-referential absolute canonical on every page
- [ ] Faceted URLs canonical to the base page
- [ ] 308 redirects for all legacy/trailing-slash variants; no redirect chains
- [ ] 404 returns a real 404 status (not a soft 200)
- [ ] `hreflang` scaffolding ready if D3 (Gujarati) resolves yes
- [ ] HTTPS enforced, HSTS with preload
- [ ] Core Web Vitals in the green (see [performance strategy](12-performance-strategy.md)) —
      a real ranking factor, and this is where the budget is enforced
- [ ] Search Console + Bing Webmaster verified, sitemaps submitted
- [ ] Sanity `noIndex` toggle respected in `generateMetadata`
- [ ] Structured data validated in CI, not spot-checked manually

---

## Measurement

| Metric | Target (12 months) | Source |
|---|---|---|
| Organic sessions | 8,000/month | GA4 |
| Indexed pages | > 95% of sitemap | Search Console |
| Long-tail rankings (top 10) | 150 keywords | Search Console |
| Resource downloads from organic | 400/month | `ResourceDownload.sourcePath` |
| Organic → demo bookings | 25/month | `Lead.utmMedium = 'organic'` |
| Zero-result site searches | trending down | `SearchQuery.resultCount = 0` |

That last row is the most actionable report in the system. A zero-result search is a user
telling us exactly what our catalogue or content is missing, in their own words.
