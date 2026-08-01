import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { HeroArtwork, type HeroWords } from "./hero-artwork";
import { RotatingWord } from "./rotating-word";

/* The rotating word is the vision line from the brochure — "vibrant hubs of
   discovery" — opened out into the things a classroom actually becomes. Every
   word is a claim the rest of the page then backs up, not a thesaurus run on
   "discovery".

   These are also the board in HeroArtwork: one tile per word, lit in order as
   the die reaches it. HeroWords is a fixed-length tuple so adding a sixth word
   here fails the build rather than silently landing on nothing. */
const WORDS: HeroWords = [
  "discovery.",
  "curiosity.",
  "confidence.",
  "teamwork.",
  "wonder.",
];

/**
 * The homepage hero.
 *
 * Stays a Server Component. The LCP element is the HEADLINE TEXT, not the
 * artwork — so nothing about the illustration can delay the largest paint.
 * Only the artwork's parallax is client-side, isolated in HeroArtwork.
 *
 * On mobile the artwork renders BELOW the headline and CTAs in DOM order:
 * text first is what a hurried teacher on 4G needs, and what a crawler reads.
 */
export function HeroHome() {
  const t = getDictionary();

  return (
    <section className="relative overflow-hidden">
      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-6">
          <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
            {SITE.tagline}
          </p>

          <h1 className="text-display-1 text-ink">
            Learning through play.
            <br />
            Every classroom a hub of <RotatingWord words={WORDS} />
          </h1>

          <p className="measure text-body-lg text-ink-muted">
            Gamified experiential learning kits, a Game Corner for the
            classroom, and teacher training — built for Vidyalayas and aligned
            to NEP 2020 and NCF 2023.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact?type=school-demo" size="lg">
              {t.cta.bookDemo}
            </ButtonLink>
            <ButtonLink href="/approach" variant="secondary" size="lg">
              {t.cta.exploreApproach}
            </ButtonLink>
          </div>
        </div>

        <HeroArtwork />
      </Container>
    </section>
  );
}
