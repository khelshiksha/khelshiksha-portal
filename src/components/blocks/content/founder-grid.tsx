import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Reveal } from "@/components/ui/reveal";
import { staggerDelay } from "@/lib/motion";
import type { Founder } from "@/services/cms/types";

/**
 * The founders, on the About page.
 *
 * RENDERS NOTHING ON AN EMPTY LIST, which is how it shipped and is worth
 * keeping. The empty-case contract is the one PressRail and the testimonial
 * section keep: the surrounding page must be complete without this. On About
 * it is - vision, mission and the audited stat band all stand alone - which
 * is why filling content/founders.ts was a content edit that touched no
 * layout, and why emptying it again would not break the page.
 *
 * EVERY FIELD BELOW NAME AND ROLE IS OPTIONAL for the same reason. A quote, a
 * bio and a photograph each arrived on a different day; a card that required
 * all three would have held the section back until the slowest one landed.
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

        {/* Three-up from lg, two from sm. There are exactly three people, so
            two-up would set them as a row of two and an orphan. Three columns
            at 62rem is about 20rem each, which holds the one-line quotes now
            and a two-or-three sentence bio later without revisiting this. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder, i) => (
            <Reveal key={founder._id} delay={staggerDelay(i)}>
              {/* CENTRED, AND THE PORTRAIT IS THE SIZE OF A PORTRAIT.

                  It was size-24 (96px) and left-aligned. On a phone this card
                  is the full width of the viewport, so a 96px square pinned
                  to its top-left corner read as a thumbnail somebody forgot
                  to finish - the card was 340px wide and the face was under
                  a third of it.

                  size-36/40 (144/160px) is about half the card's inner width
                  at both the phone's one column and the desktop's three,
                  which is the proportion that makes a face read as the
                  subject rather than as an icon. Centring is what makes it
                  look chosen: a small left-aligned square under centred-
                  looking text is the layout you get by not deciding.

                  radius-lg rather than md because a corner radius has to grow
                  with the box it is on, or a bigger square looks squarer. */}
              <div className="border-rule bg-surface flex h-full flex-col items-center gap-5 rounded-[var(--radius-lg)] border p-6 text-center">
                {founder.image ? (
                  <Image
                    src={founder.image.src}
                    alt={founder.image.alt}
                    /* The LARGEST rendered size (sm:size-40 = 160px), not the
                       old 112. next/image builds its srcset from these, so
                       leaving them behind the CSS is how a portrait ends up
                       served at 112 and upscaled by the browser into a 160px
                       box on every retina phone. It emits 1x and 2x from
                       here, and the 448px source covers both. */
                    width={160}
                    height={160}
                    className="size-36 shrink-0 rounded-[var(--radius-lg)] object-cover sm:size-40"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    /* bg-brand-tint / text-brand-deep is the pairing the
                       numbered step markers on a product page use - the same
                       "typographic stand-in on a soft ground" job. */
                    className="bg-brand-tint text-brand-deep flex size-36 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-3xl font-bold sm:size-40"
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
                  {/* A QUOTE, SET AS ONE. <blockquote> rather than <p>
                      because it is someone speaking, and the element is what
                      tells a screen reader that - the quotation marks are
                      decoration a screen reader does not announce.

                      The marks are supplied HERE, not stored in the content,
                      so they cannot drift between entries: three people
                      supplying three lines will not all use the same
                      character, and straight quotes beside curly ones is the
                      kind of thing nobody notices until it is printed.

                      Italic and slightly tighter than body prose, which is
                      what separates it from the bio underneath when a card
                      carries both. */}
                  {founder.quote ? (
                    <blockquote className="text-body text-ink-muted italic">
                      &ldquo;{founder.quote}&rdquo;
                    </blockquote>
                  ) : null}

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
