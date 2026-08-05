import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import { ProductCard } from "./product-card";
import { getDictionary } from "@/lib/i18n";
import type { Pillar, Product } from "@/services/cms/types";

export function FeaturedKits({
  products,
  pillars,
}: {
  products: Product[];
  pillars: Pillar[];
}) {
  const t = getDictionary();

  return (
    <Section tint="bg-surface" labelledBy="kits-heading">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            id="kits-heading"
            eyebrow="Learning kits"
            title="Games built around"
            accent="what children keep."
            lede="Every kit states the outcomes a teacher can watch for, not the features in the box."
          />
          <ButtonLink href="/products" variant="secondary">
            {t.cta.seeAllKits}
          </ButtonLink>
        </div>

        {/* The <li> is the grid item and it stretches by default, but the
            card inside it did not fill it - so the four kits ended at four
            different heights. `h-full` on both is what makes the row uniform;
            removing either one brings the ragged bottoms back. */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal
              as="li"
              key={product._id}
              delay={staggerDelay(i)}
              className="h-full"
            >
              <ProductCard product={product} pillars={pillars} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
