import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { Founder } from "@/services/cms/types";

/**
 * The founders, on the About page.
 *
 * RENDERS NOTHING WHILE content/founders.ts IS EMPTY, which it is by default
 * and deliberately - a founder entry is a record about a named real person,
 * and inventing one is fabrication the rendered page would present as fact.
 * The note in that file has the full reasoning and the shape to fill in.
 *
 * The empty-case contract is the same one PressRail and the testimonial
 * section keep: the surrounding page must be complete without this. On About
 * it is - vision, mission and the audited stat band all stand alone - so
 * adding real founders later is a content edit and touches no layout.
 *
 * ---------------------------------------------------------------------------
 * WHY INITIALS RATHER THAN A PLACEHOLDER PORTRAIT.
 *
 * `image` is optional on Founder, because names arrive before photographs do
 * and a section that waits for a photo shoot never ships. A stock silhouette
 * in the gap would be the wrong answer twice: it reads as a person who does
 * not exist, and it makes the card look broken rather than deliberately
 * plain. Initials on the brand tint are unmistakably a typographic stand-in,
 * and the card is the same height either way so a mixed row does not stagger.
 *
 * The initials are aria-hidden and the name is right beneath them in text, so
 * a screen reader gets the name once rather than as two letters and then a
 * word.
 */

/** First letter of the first two words. "A. R. Patel" gives "AP", not "A.". */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => /[a-z]/i.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function FounderGrid({ founders }: { founders: Founder[] }) {
  if (founders.length === 0) return null;

  return (
    <Section className="pt-4">
      <Container className="flex flex-col gap-10">
        {/* "THE PEOPLE BEHIND", NOT "WHO STARTED", because the list is not
            only founders - the marketing lead is on it. A heading that said
            "who started" over a name that did not start it would be a small
            false claim about a real person, which is the same class of
            problem as an invented bio, just quieter. */}
        <SectionTitle
          eyebrow="Our team"
          title="The people behind"
          accent="Khel Shiksha."
        />

        {/* Three-up from lg, two from sm. With no bios yet the cards are a
            name and a role, and two-up would set three short cards as a row
            of two and an orphan. Three columns at 62rem is still about 20rem
            each, which holds a two-or-three sentence bio comfortably when
            they arrive - so this does not have to be revisited then. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder, i) => (
            <Reveal key={founder._id} delay={staggerDelay(i)}>
              {/* Stacked at every width, not a row that unstacks. At three
                  columns the card is about 20rem, and an avatar beside the
                  text leaves roughly 13rem for a name and a role - enough to
                  fit, narrow enough that "Ankit Padshala" and "Marketing
                  Head" each wrap. Portrait above name is also the
                  conventional reading order for a team card. */}
              <div className="border-rule bg-surface flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border p-6">
                {founder.image ? (
                  <Image
                    src={founder.image.src}
                    alt={founder.image.alt}
                    width={112}
                    height={112}
                    className="size-24 shrink-0 rounded-[var(--radius-md)] object-cover sm:size-28"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    /* bg-brand-tint / text-brand-deep is the pairing the
                       numbered step markers on a product page use - the same
                       "typographic stand-in on a soft ground" job. */
                    className="bg-brand-tint text-brand-deep flex size-24 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-2xl font-bold sm:size-28"
                  >
                    {initialsOf(founder.name)}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div>
                    {/* text-h3 rather than an h4 step: the scale stops at h3
                        (see theme.css), and a name is the largest thing on
                        this card by right. */}
                    <p className="text-h3 text-ink">{founder.name}</p>
                    <p className="text-ink-subtle text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
                      {founder.role}
                    </p>
                  </div>
                  {/* Omitted, not rendered empty. An empty <p> still takes
                      its line-height, so a card without a bio would carry a
                      blank band where the prose goes and read as content
                      that failed to load. */}
                  {founder.bio ? (
                    <p className="text-body text-ink-muted">{founder.bio}</p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
