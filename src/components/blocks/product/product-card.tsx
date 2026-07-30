import { ArrowRight } from "lucide-react";
import { LinkCard } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { MediaFrame } from "@/components/ui/media-frame";
import { formatAgeRange, formatDuration } from "@/lib/utils";
import type { PillarTint } from "@/lib/constants";
import type { Pillar, Product } from "@/services/cms/types";

export function ProductCard({
  product,
  pillars,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  product: Product;
  pillars: Pillar[];
  sizes?: string;
  priority?: boolean;
}) {
  const pillar = pillars.find((p) => p.key === product.pillars[0]);
  const tint = (pillar?.tint ?? "sky") as PillarTint;

  return (
    <LinkCard
      href={`/products/${product.slug}`}
      className="flex flex-col overflow-hidden"
      /* One accessible name for the whole card — the inner heading and the
         "learn more" affordance are not separate tab stops. */
      ariaLabel={`${product.title} — ${product.tagline}`}
    >
      <MediaFrame
        image={product.heroImage}
        ratio="4/3"
        sizes={sizes}
        priority={priority}
        zoomOnHover
        radius="md"
        className="rounded-none"
      />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Chips carry a text label as well as a tint — colour is never the
            only signal. */}
        <div className="flex flex-wrap gap-1.5">
          {pillar ? (
            <Chip variant="pillar" tint={tint}>
              {pillar.title}
            </Chip>
          ) : null}
          <Chip>{formatAgeRange(product.ageMin, product.ageMax)}</Chip>
        </div>

        <h3 className="text-h3 font-bold text-ink">{product.title}</h3>

        <p className="flex-1 text-body-sm text-ink-muted">{product.tagline}</p>

        <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-brand-deep">
          {formatDuration(product.durationMinutes)}
          <span aria-hidden="true" className="text-ink-subtle">
            ·
          </span>
          {product.groupSizeMin}–{product.groupSizeMax} players
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="ml-auto transition-transform duration-150 group-hover:translate-x-1"
          />
        </p>
      </div>
    </LinkCard>
  );
}
