import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Breadcrumbs } from "@/components/blocks/navigation/breadcrumbs";
import { ProductCard } from "@/components/blocks/product/product-card";
import { CTABand } from "@/components/blocks/content/cta-band";
import { PillarIcon } from "@/components/icons/pillar-icon";
import { PILLAR_ACCENT_CLASS, PILLAR_TINT_CLASS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import {
  getPillarBySlug,
  getPillars,
  getPillarSlugs,
  getProductsByPillar,
} from "@/services/cms";

export const revalidate = 3600;

/**
 * Every kit is generated from the content layer at build time, so a slug that
 * was not generated is not a page that failed - it is not a route at all.
 * dynamicParams = false says exactly that, and it is also the only way this
 * route can produce a correct 404 document.
 *
 * WHY IT MATTERS: with every route under app/[locale] there is no app/layout
 * above it, so a notFound() thrown INSIDE the locale tree has no root layout
 * to render into. Next falls back to its own bare shell - <html> with no lang
 * attribute, no navigation, 35KB of nothing. That is a serious WCAG failure,
 * and it is what an unknown kit URL used to return: exactly what a stale
 * brochure link or a renamed kit produces.
 *
 * Turning the slug into an unmatched route routes it through
 * app/global-not-found.tsx instead, which owns a complete document.
 *
 * The cost is that a new kit needs a rebuild before its page exists. That was
 * already true - the content lives in the repo - so nothing is lost.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPillarSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const pillar = await getPillarBySlug((await params).slug);
  if (!pillar) return {};

  return buildMetadata({
    title: pillar.title,
    description: pillar.description,
    path: `/approach/pillars/${pillar.slug}`,
  });
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = await getPillarBySlug(slug);
  if (!pillar) notFound();

  const [kits, pillars] = await Promise.all([
    getProductsByPillar(pillar.key),
    getPillars(),
  ]);

  return (
    <>
      <section className={PILLAR_TINT_CLASS[pillar.tint]}>
        <Container className="flex flex-col gap-8 py-8 lg:py-12">
          <Breadcrumbs
            trail={[
              { name: "Learning Through Play", path: "/approach" },
              { name: "The 5 Pillars", path: "/approach/pillars" },
              { name: pillar.title, path: `/approach/pillars/${pillar.slug}` },
            ]}
          />
          <div className="flex flex-col gap-5 pb-8 lg:pb-12">
            <PillarIcon
              name={pillar.icon}
              size={40}
              className={PILLAR_ACCENT_CLASS[pillar.tint]}
            />
            <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
              Pillar {pillar.order} of 5
            </p>
            <h1 className="text-display-2 text-ink max-w-[16ch]">
              {pillar.title}
            </h1>
            <p className="measure text-body-lg text-ink-muted">
              {pillar.description}
            </p>
          </div>
        </Container>
      </section>

      <Section labelledBy="pillar-kits-heading">
        <Container className="flex flex-col gap-10">
          <SectionTitle
            id="pillar-kits-heading"
            eyebrow="Kits in this pillar"
            title="What we use to teach"
            accent={pillar.title.toLowerCase() + "."}
          />

          {kits.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kits.map((kit) => (
                <li key={kit._id} className="h-full">
                  <ProductCard
                    product={kit}
                    pillars={pillars}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          ) : (
            /* Honest empty state rather than a hidden section - a pillar with
               no kits yet is information, not an error. */
            <p className="border-rule bg-sunken text-body text-ink-muted rounded-[var(--radius-lg)] border p-8">
              Kits for this pillar are in development. Tell us what you need and
              we will let you know as soon as they are ready.
            </p>
          )}
        </Container>
      </Section>

      <CTABand
        title="Bring this pillar into"
        accent="your school."
        primary={{ label: "Book a Demo", href: "/contact?type=school-demo" }}
        secondary={{ label: "See all pillars", href: "/approach/pillars" }}
      />
    </>
  );
}
