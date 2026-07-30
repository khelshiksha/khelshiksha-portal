# 7. CMS Schema (Sanity)

## Editing philosophy

The brief says "everything editable". That is right, but it has a failure mode: a fully
free-form page builder gives editors enough rope to break the design system on a Tuesday
afternoon.

The resolution used here:

- **Structured documents** (products, posts, case studies) have typed fields. The layout is
  fixed; the content is editable. An editor cannot make a product page look wrong.
- **Composed pages** (home, audience hubs) use a constrained `sections[]` array. Editors
  reorder and toggle sections from a fixed vocabulary that maps 1:1 to
  [tier-3 block components](05-component-inventory.md#tier-3--componentsblocks-page-sections).
  They cannot invent a section, and they cannot set arbitrary colours or spacing.
- **Singletons** (settings, navigation) are locked to a single document via Structure Builder.

Every schema below carries a **`preview`** config so the Studio list view is readable, and
draft/published perspectives drive on-site preview.

---

## Document types

### `product` — the learning kits

```ts
defineType({
  name: 'product',
  type: 'document',
  title: 'Learning Kit',
  groups: [
    { name: 'content',  title: 'Content', default: true },
    { name: 'taxonomy', title: 'Classification' },
    { name: 'media',    title: 'Media' },
    { name: 'teaching', title: 'For Teachers' },
    { name: 'seo',      title: 'SEO' },
  ],
  fields: [
    { name: 'title',    type: 'string', validation: r => r.required(), group: 'content' },
    { name: 'slug',     type: 'slug', options: { source: 'title' },
      validation: r => r.required(), group: 'content' },
    { name: 'tagline',  type: 'string', description: 'One line, max 90 chars',
      validation: r => r.max(90), group: 'content' },

    // Two voices for the same kit — see journey rule 2.
    { name: 'descriptionInstitutional', type: 'text', rows: 3, group: 'content',
      title: 'Description — schools & government',
      description: 'Competency language. Shown on /schools and /government.' },
    { name: 'descriptionParent', type: 'text', rows: 3, group: 'content',
      title: 'Description — parents',
      description: 'Plain, warm language. No NEP/NCF jargon.' },

    { name: 'body', type: 'portableText', group: 'content' },

    // Taxonomy — drives all 9 filters
    { name: 'pillars', type: 'array', of: [{ type: 'reference', to: [{ type: 'pillar' }] }],
      validation: r => r.min(1), group: 'taxonomy' },
    { name: 'ageMin', type: 'number', validation: r => r.required().min(2).max(18), group: 'taxonomy' },
    { name: 'ageMax', type: 'number', validation: r => r.required().min(2).max(18), group: 'taxonomy' },
    { name: 'grades', type: 'array', of: [{ type: 'string' }], group: 'taxonomy',
      options: { list: ['pre-primary','1-2','3-5','6-8','9-10'] } },
    { name: 'subjects', type: 'array', of: [{ type: 'string' }], group: 'taxonomy',
      options: { list: ['maths','language','science','evs','health','values','life-skills'] } },
    { name: 'skills', type: 'array', of: [{ type: 'string' }], group: 'taxonomy',
      options: { list: ['problem-solving','teamwork','communication','creativity',
                        'motor-skills','focus','memory','empathy'] } },
    { name: 'durationMinutes', type: 'number', group: 'taxonomy' },
    { name: 'setting', type: 'string', group: 'taxonomy',
      options: { list: ['indoor','outdoor','either'], layout: 'radio' } },
    { name: 'groupSizeMin', type: 'number', group: 'taxonomy' },
    { name: 'groupSizeMax', type: 'number', group: 'taxonomy' },
    { name: 'gameCornerShelf', type: 'string', group: 'taxonomy',
      description: 'Which Game Corner compartment this sits in',
      options: { list: ['wellbeing-values','nutrition-health','nature-discovery',
                        'math-thinking','teamwork-citizenship','environment-sustainability'] } },

    // Outcomes — the most important content on the page
    { name: 'learningOutcomes', type: 'array', of: [{ type: 'string' }], group: 'content',
      validation: r => r.min(2).max(8),
      description: 'What the child can do afterwards. Observable, not aspirational.' },
    { name: 'curriculumMapping', type: 'array', group: 'content',
      of: [{ type: 'object', fields: [
        { name: 'framework', type: 'string', options: { list: ['NEP 2020','NCF 2023','FLN','Fit India','Mission LiFE'] } },
        { name: 'reference', type: 'string' },
      ]}] },

    // Media
    { name: 'heroImage', type: 'accessibleImage', validation: r => r.required(), group: 'media' },
    { name: 'gallery',   type: 'array', of: [{ type: 'accessibleImage' }], group: 'media' },
    { name: 'video',     type: 'videoEmbed', group: 'media' },
    { name: 'boxContents', type: 'array', of: [{ type: 'string' }], group: 'media' },

    // Teacher assets
    { name: 'howToPlay', type: 'array', group: 'teaching',
      of: [{ type: 'object', fields: [
        { name: 'step', type: 'string' },
        { name: 'image', type: 'accessibleImage' },
      ]}] },
    { name: 'teacherGuide', type: 'reference', to: [{ type: 'resource' }], group: 'teaching' },
    { name: 'lessonPlans', type: 'array', of: [{ type: 'reference', to: [{ type: 'resource' }] }],
      group: 'teaching' },

    { name: 'relatedProducts', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: r => r.max(3), group: 'content' },
    { name: 'featured',    type: 'boolean', initialValue: false, group: 'content' },
    { name: 'orderRank',   type: 'string', hidden: true },  // @sanity/orderable-document-list
    { name: 'seo',         type: 'seo', group: 'seo' },
  ],
  validation: r => r.custom(d =>
    d.ageMin <= d.ageMax || 'Minimum age must not exceed maximum age'),
})
```

### `pillar` — the five learning pillars

```ts
{
  name: 'pillar', type: 'document',
  fields: [
    { name: 'title', type: 'string' },              // "Climate Education"
    { name: 'slug', type: 'slug' },                 // climate-education
    { name: 'shortDescription', type: 'string' },   // one line, used in the grid
    { name: 'body', type: 'portableText' },
    { name: 'colorKey', type: 'string',
      options: { list: ['sky','blush','mint','peach','lavender'] },
      description: 'Maps to a design-system tint. Not a free colour picker.' },
    { name: 'icon', type: 'string', options: { list: [/* the 5 custom pillar icons */] } },
    { name: 'heroImage', type: 'accessibleImage' },
    { name: 'orderRank', type: 'number' },
    { name: 'seo', type: 'seo' },
  ],
}
```

`colorKey` is an enum, not a colour field. This is the mechanism that stops the design system
drifting: an editor picks a *pillar identity*, not a hex value.

### `page` — composed pages (home + audience hubs)

```ts
{
  name: 'page', type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'audience', type: 'string',
      options: { list: ['general','schools','teachers','parents','government'] } },
    { name: 'sections', type: 'array', of: [
      { type: 'heroSection' },      { type: 'audienceSplitSection' },
      { type: 'benefitListSection'},{ type: 'pillarGridSection' },
      { type: 'featureGridSection'},{ type: 'productShowcaseSection' },
      { type: 'timelineSection' },  { type: 'comparisonSection' },
      { type: 'alignmentSection' }, { type: 'statBandSection' },
      { type: 'testimonialSection'},{ type: 'caseStudySection' },
      { type: 'partnerSection' },   { type: 'gallerySection' },
      { type: 'videoSection' },     { type: 'faqSection' },
      { type: 'richTextSection' },  { type: 'ctaBandSection' },
      { type: 'formSection' },
    ]},
    { name: 'seo', type: 'seo' },
  ],
}
```

Nineteen section types, each with its own small field set and a Studio preview showing its
title. That is the whole page-builder surface — closed vocabulary, no escape hatch.

### Remaining documents

| Type | Key fields |
|---|---|
| `post` (blog) | title, slug, excerpt, body, `author→`, `categories[]→`, `pillars[]→`, heroImage, publishedAt, `readingTime` (auto-derived), `featured`, seo |
| `caseStudy` | title, slug, `school`, district, `studentsReached`, `pillars[]→`, `productsUsed[]→`, `challenge`, `approach`, `outcomes[]` (metric + before + after), quote, gallery, `downloadablePdf`, seo |
| `testimonial` | quote, name, role, organisation, `audience` (school/teacher/parent/govt), photo, `productReference→`, `featured` |
| `resource` | title, slug, `resourceType` (lesson-plan/activity/guide/brochure/report), `file`, previewImages[], grades[], subjects[], `pillars[]→`, `gated` (bool), `relatedProduct→` |
| `partner` | name, logo (SVG preferred), url, `partnerType` (govt/ngo/institution/media), `displayOnHomepage` |
| `teamMember` | name, role, photo, bio, linkedIn, orderRank |
| `faq` | question, answer (portable text), `category`, `audience`, orderRank |
| `galleryItem` | image/video, caption, `event`, date, `pillars[]→`, district |
| `jobPosting` | title, slug, location, type, description, `applyEmail`, `closesAt` |
| `category` | title, slug, description (blog taxonomy) |
| `author` | name, role, photo, bio |

---

## Singletons

| Singleton | Contains |
|---|---|
| `siteSettings` | Brand name, tagline, logo variants, contact (2 phones, email), social handles, default OG image, org address for `Organization` JSON-LD |
| `navigation` | Header links + mega-menu structure, footer column groups. Editable so a new hub doesn't need a deploy. |
| `homePage` | A `page` document locked to the `/` route |

Enforced with a `singletonPlugin` that removes create/delete actions and a Structure Builder
desk that pins them to a fixed document ID.

---

## Reusable objects

```ts
// accessibleImage — alt text is REQUIRED unless explicitly marked decorative.
{
  name: 'accessibleImage', type: 'object',
  fields: [
    { name: 'asset', type: 'image', options: { hotspot: true } },
    { name: 'alt', type: 'string',
      validation: r => r.custom((alt, ctx) =>
        ctx.parent?.decorative || alt ? true : 'Alt text is required'),
      description: 'Describe the image for someone who cannot see it.' },
    { name: 'decorative', type: 'boolean', initialValue: false,
      description: 'Tick only if the image conveys no information.' },
    { name: 'caption', type: 'string' },
  ],
}
```

This one object is the highest-leverage accessibility decision in the project: it makes missing
alt text **impossible to publish**, rather than something an audit catches later.

```ts
// seo
{ name: 'seo', type: 'object', fields: [
  { name: 'metaTitle',       type: 'string', validation: r => r.max(60) },
  { name: 'metaDescription', type: 'text', rows: 2, validation: r => r.max(160) },
  { name: 'ogImage',         type: 'image' },
  { name: 'noIndex',         type: 'boolean', initialValue: false },
  { name: 'canonicalUrl',    type: 'url' },
]}

// videoEmbed — provider + id, never a raw iframe (facade pattern, see perf strategy)
{ name: 'videoEmbed', type: 'object', fields: [
  { name: 'provider', type: 'string', options: { list: ['youtube','vimeo','mux'] } },
  { name: 'videoId',  type: 'string' },
  { name: 'poster',   type: 'accessibleImage' },
  { name: 'title',    type: 'string', validation: r => r.required() },
]}

// portableText — a deliberately small block vocabulary
// styles: normal, h2, h3, h4, blockquote
// lists: bullet, number
// marks: strong, em, code, link(href + newTab), highlight
// custom blocks: accessibleImage, videoEmbed, callout(variant), productRef, statCallout
```

---

## Content lifecycle

**Preview.** Sanity Presentation tool + Next.js draft mode. Editors see unpublished changes on
the real site at `/api/draft?slug=…`, protected by a secret. Live-by-default via
`sanityFetch` with `perspective: 'previewDrafts'` when draft mode is on.

**Publishing → revalidation.** A Sanity webhook hits `POST /api/revalidate` (HMAC-signed with
`SANITY_WEBHOOK_SECRET`) which calls `revalidateTag()` for the affected document type. Tags:
`product`, `post`, `page:{slug}`, `settings`. Content is live within seconds without a rebuild.

**Roles.** `administrator` (full) · `editor` (create/publish content, cannot change schema or
settings) · `contributor` (drafts only, cannot publish).

**Localisation readiness.** If open question D3 resolves to yes, `title`, `tagline`, both
descriptions, `body`, and `learningOutcomes` become `internationalizedArray` fields. Designing
the schema knowing this is free; retrofitting it is a week. The field names above are chosen so
that migration is mechanical.

---

## Cross-system contract

The only link between Sanity and Postgres is a **string ID**:

```
Sanity product._id  ──(string)──▶  Lead.sanityProductId
Sanity resource._id ──(string)──▶  ResourceDownload.sanityResourceId
```

`ResourceDownload` also denormalises `resourceTitle` at write time, so a report still reads
correctly after a resource is deleted from the CMS. That is the one deliberate duplication in
the system, and it exists because reporting must not depend on content that editors can remove.
