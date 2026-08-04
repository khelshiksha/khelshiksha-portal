import { ArrowRight } from "lucide-react";
import { LinkCard } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { MediaFrame } from "@/components/ui/media-frame";
import { formatAgeRange, formatDuration } from "@/lib/utils";
import type { PillarTint } from "@/lib/constants";
import type { Pillar, Product } from "@/services/cms/types";

/** Separator between meta values. Decorative, so it is hidden from AT. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ink-subtle">
      ·
    </span>
  );
}

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
      /* h-full, and the <li> around it must stretch too — see the grid in
         featured-kits.tsx. Without it the card is as tall as its own content,
         so the four kits in a row ended at four different heights: SURAKSHA's
         chips fit one line, Aryabhata's wrapped to two, and each tagline is a
         different length. A row of cards that do not agree on a baseline
         reads as a rendering fault, not as variety. With h-full the shell is
         uniform and `flex-1` on the tagline absorbs the difference, so the
         duration line sits on the same baseline in all four. */
      className="flex h-full flex-col overflow-hidden"
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
        {/* ONE chip, not two. The pillar chip and an age chip together are
            wider than a quarter-width card, so "Foundational Learning" +
            "8–12 years" wrapped to a second row on exactly one of the four
            featured kits — and that card's title, tagline and meta line all
            sat 30px lower than its neighbours'. One chip cannot wrap, so
            every card in a row starts its title at the same height.

            The age did not disappear: it moved to the meta line below, which
            is where the other two numbers a teacher needs already live. It is
            arguably a better home — time, group size and age band are one
            thought ("can I run this, with these children, in this period?"),
            and they now read as one.

            Chips still carry a text label as well as a tint — colour is never
            the only signal. */}
        {pillar ? (
          <div className="flex">
            <Chip variant="pillar" tint={tint}>
              {pillar.title}
            </Chip>
          </div>
        ) : null}

        <h3 className="text-h3 text-ink font-bold">{product.title}</h3>

        {/* Absorbs the difference between a short tagline and a long one, so
            the meta line lands on the same baseline across the row. Only
            works because the card is h-full — see above. */}
        <p className="text-body-sm text-ink-muted flex-1">{product.tagline}</p>

        {/* The arrow is a SIBLING of the meta line, not the last item in it.
            Inside the wrapping row it was pushed onto a line of its own the
            moment three values did not fit, leaving an orphaned arrow under
            the text on every card. Out here it stays pinned right and
            vertically centred however many lines the meta takes. */}
        <div className="flex items-center gap-3">
          <p className="text-brand-deep flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-semibold">
            {formatDuration(product.durationMinutes)}
            <Dot />
            {product.groupSizeMin}–{product.groupSizeMax} players
            <Dot />
            {formatAgeRange(product.ageMin, product.ageMax)}
          </p>
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="text-brand-deep ml-auto shrink-0 transition-transform duration-150 group-hover:translate-x-1"
          />
        </div>
      </div>
    </LinkCard>
  );
}
