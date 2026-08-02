import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import type { PressCutting } from "@/services/cms/types";

/**
 * Newspaper coverage, as scans.
 *
 * These are photographs of print, so they are heavy and they are all below the
 * fold. Every one is lazy-loaded and sized, and next/image serves AVIF/WebP
 * derivatives rather than the 400KB JPEGs sitting in the repo.
 *
 * `sizes` matters more than usual here: without it every cutting would be
 * fetched at full width on a phone, which is most of a megabyte of a
 * three-column Gujarati article rendered 380px wide.
 *
 * The cuttings are in Gujarati. A visitor who does not read Gujarati — and a
 * screen reader user of any language — gets nothing from the image itself, so
 * the alt text carries what the article is about. That is also the only reason
 * these count as evidence rather than decoration.
 *
 * A caption appears ONLY where the publication is known. An invented masthead
 * or date is the first thing a journalist would check and the fastest way to
 * turn evidence into a liability.
 */
export function PressGallery({
  cuttings,
  heading,
  intro,
}: {
  cuttings: PressCutting[];
  heading: string;
  intro?: string;
}) {
  if (cuttings.length === 0) return null;

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-ink">{heading}</h2>
          {intro !== undefined && (
            <p className="measure text-body-lg text-ink-muted">{intro}</p>
          )}
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cuttings.map((cutting) => (
            <li key={cutting._id} className="flex flex-col gap-3">
              <figure className="flex flex-col gap-3">
                <div className="border-rule bg-surface overflow-hidden rounded-[var(--radius-lg)] border">
                  <Image
                    src={`/press/${cutting.file}`}
                    alt={cutting.alt}
                    width={1400}
                    height={1400}
                    loading="lazy"
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 92vw"
                    className="h-auto w-full object-contain"
                  />
                </div>
                {(cutting.publication ?? cutting.date) !== null && (
                  <figcaption className="text-body-sm text-ink-muted">
                    {[cutting.publication, cutting.date]
                      .filter((part): part is string => part !== null)
                      .join(" · ")}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
