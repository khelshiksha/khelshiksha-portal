import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Chip, SpecItem } from "@/components/ui/chip";
import { ButtonLink } from "@/components/ui/button";
import { MediaFrame } from "@/components/ui/media-frame";
import { Reveal } from "@/components/ui/reveal";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { ProductCard } from "@/components/blocks/product/product-card";
import { InlineEnquiry } from "@/components/blocks/conversion/inline-enquiry";
import { JsonLd } from "@/components/seo/json-ld";
import { staggerDelay } from "@/lib/motion";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import {
  formatAgeRange,
  formatDuration,
  formatGroupSize,
} from "@/lib/utils";
import { SETTING_LABEL, SKILL_LABEL } from "@/lib/constants";
import {
  getPillars,
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/services/cms";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  /* image: null hands the share card to opengraph-image.tsx alongside this
     file, which renders a per-kit PNG. Previously this passed the hero
     illustration's URL — an SVG, which WhatsApp, Facebook, LinkedIn and X all
     refuse to render, so every kit shared to a staffroom group came out
     blank. */
  return buildMetadata({
    title: product.title,
    description: product.descriptionInstitutional,
    path: `/products/${product.slug}`,
    image: null,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [pillars, related] = await Promise.all([
    getPillars(),
    getRelatedProducts(slug),
  ]);
  const t = getDictionary();
  const pillar = pillars.find((p) => p.key === product.pillars[0]);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { name: "Learning Kits", path: "/products" },
            { name: product.title, path: `/products/${product.slug}` },
          ]}
        />
      </Container>

      <Section className="pt-10 sm:pt-12">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <MediaFrame
            image={product.heroImage}
            ratio="4/3"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            radius="xl"
          />

          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-wrap gap-2">
              {product.pillars.map((key) => {
                const p = pillars.find((x) => x.key === key);
                return p ? (
                  <Chip key={key} variant="pillar" tint={p.tint}>
                    {p.title}
                  </Chip>
                ) : null;
              })}
            </div>

            <h1 className="text-display-2 text-ink">{product.title}</h1>
            <p className="measure text-body-lg text-ink-muted">
              {product.descriptionInstitutional}
            </p>

            <dl className="grid grid-cols-2 gap-5 rounded-[var(--radius-lg)] border border-rule bg-surface p-5 sm:grid-cols-4">
              <SpecItem
                label={t.product.ageLabel}
                value={formatAgeRange(product.ageMin, product.ageMax)}
              />
              <SpecItem
                label={t.product.playersLabel}
                value={formatGroupSize(product.groupSizeMin, product.groupSizeMax)}
              />
              <SpecItem
                label={t.product.durationLabel}
                value={formatDuration(product.durationMinutes)}
              />
              <SpecItem
                label={t.product.settingLabel}
                value={SETTING_LABEL[product.setting]}
              />
            </dl>

            {/* Portfolio, not catalogue — decision D7. No price, no cart. The
                note explains WHY there is no price, rather than leaving a
                visitor to wonder. */}
            <p className="text-body-sm text-ink-muted">
              {t.product.noPricingNote}
            </p>

            <div>
              <ButtonLink href="#enquire" size="lg">
                {t.cta.enquire}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* Outcomes sit ABOVE "what's in the box", deliberately. */}
      <Section tint="bg-surface" labelledBy="outcomes-heading">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle
            id="outcomes-heading"
            eyebrow="Learning outcomes"
            title="What children take"
            accent="away with them."
            lede="Observable behaviours a teacher can watch for during the session — not aspirations."
          />
          <ul className="flex flex-col gap-4">
            {product.learningOutcomes.map((outcome, i) => (
              <Reveal as="li" key={outcome} delay={staggerDelay(i, 50, 200)}>
                <div className="flex gap-3">
                  <Check
                    size={19}
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-success"
                  />
                  <span className="text-body text-ink">{outcome}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="text-h2 text-ink">{t.product.skills}</h2>
            <ul className="flex flex-wrap gap-2">
              {product.skills.map((skill) => (
                <li key={skill}>
                  <Chip>{SKILL_LABEL[skill]}</Chip>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-h2 text-ink">{t.product.curriculum}</h2>
            <ul className="flex flex-col gap-3">
              {product.curriculumMapping.map((link) => (
                <li key={link.framework} className="flex flex-col">
                  <span className="text-[0.8125rem] font-extrabold tracking-[0.06em] text-brand uppercase">
                    {link.framework}
                  </span>
                  <span className="text-body-sm text-ink-muted">
                    {link.reference}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-h2 text-ink">{t.product.howToPlay}</h2>
            <ol className="flex flex-col gap-5">
              {product.howToPlay.map((step, i) => (
                <li key={step.step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="tabular mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-bold text-brand-deep"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-ink">{step.step}</p>
                    {step.detail ? (
                      <p className="text-body-sm text-ink-muted">
                        {step.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-6 text-h2 text-ink">{t.product.inTheBox}</h2>
            <ul className="flex flex-col gap-2">
              {product.boxContents.map((item) => (
                <li
                  key={item}
                  className="border-b border-rule py-2 text-body-sm text-ink-muted last:border-b-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tint="bg-surface" labelledBy="related-heading">
          <Container className="flex flex-col gap-10">
            <SectionTitle
              id="related-heading"
              eyebrow="Related"
              title={t.product.related}
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item._id}>
                  <ProductCard
                    product={item}
                    pillars={pillars}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <InlineEnquiry
        type="product-enquiry"
        sourcePath={`/products/${product.slug}`}
        productId={product._id}
        eyebrow="Enquire"
        title={`Interested in ${product.title}?`}
        accent=""
        lede={
          pillar
            ? `Tell us about your school and we'll show you how ${product.title} works alongside the rest of the ${pillar.title} pillar.`
            : undefined
        }
        submitLabel="Send enquiry"
      />

      <JsonLd data={productJsonLd(product)} />
    </>
  );
}
