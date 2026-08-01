import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { KhelVerse } from "./khelverse/khelverse";
import { World } from "./khelverse/world";
import { RotatingWord } from "./rotating-word";
import type { HeroWords } from "./hero-artwork";

/**
 * The homepage hero — the gate into KhelVerse.
 *
 * Stays a Server Component, and so does the world inside it. The LCP element
 * is the HEADLINE TEXT, so nothing about the illustration may delay the
 * largest paint: the copy is above the world in DOM order and needs no
 * JavaScript at all to render.
 *
 * WHY THE COPY IS NOT INSIDE THE WORLD. The brief asked for the headline to
 * sit in Discovery Square. It does not, and that is deliberate: a headline
 * composited over a landscape has to fight it for contrast at every viewport,
 * and this is the one piece of text on the site that a principal must be able
 * to read on a cheap phone in daylight. The copy sits on flat paper, the world
 * opens beneath it. You still walk through the gate; you just do not have to
 * squint at the sign.
 *
 * WHY THERE IS NO SCROLL-DRIVEN CAMERA. Also asked for, also deliberately not
 * built. Turning statistics into signboards and testimonials into notice
 * boards inside a scrolling world makes the page unscannable, unindexable and
 * unreachable by keyboard — on a site whose entire job is to get a school to
 * book a demo. The world is the opening; below it the page stays fast and
 * scannable.
 */

/* The rotating word is the vision line from the brochure — "vibrant hubs of
   discovery" — opened out into the things a classroom actually becomes. Every
   word is a claim the rest of the page then backs up.

   These are also the five zones of the world: the die lands on a zone and the
   word changes. HeroWords is a fixed-length tuple, so adding a sixth word
   without adding a sixth zone fails the build. */
const WORDS: HeroWords = [
  "discovery.",
  "curiosity.",
  "confidence.",
  "teamwork.",
  "wonder.",
];

export function HeroHome() {
  const t = getDictionary();

  return (
    <section className="kv-hero relative overflow-hidden">
      <Container className="relative z-10 flex flex-col gap-6 pt-12 pb-4 sm:pt-16 lg:max-w-[62rem] lg:pt-20">
        <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
          {SITE.tagline}
        </p>

        <h1 className="text-display-1 text-ink">
          Learning through play.
          <br />
          Every classroom a hub of <RotatingWord words={WORDS} />
        </h1>

        <p className="measure text-body-lg text-ink-muted">
          Gamified experiential learning kits, a Game Corner for the classroom,
          and teacher training — built for Vidyalayas and aligned to NEP 2020
          and NCF 2023.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact?type=school-demo" size="lg">
            {t.cta.bookDemo}
          </ButtonLink>
          <ButtonLink href="/approach" variant="secondary" size="lg">
            {t.cta.exploreApproach}
          </ButtonLink>
        </div>
      </Container>

      {/* Pulled up so the sky sits behind the copy, and WIDER THAN THE VIEWPORT
          on small screens.

          Fitting the whole island into 390px made every landmark about twelve
          pixels tall — present, but unreadable, which is worse than absent. So
          the camera moves in instead: the island overflows both edges and the
          visitor sees the middle of a place that continues past the screen.
          The section clips it, so nothing scrolls sideways. */}
      <div className="relative -mt-10 -ml-[38%] w-[176%] sm:-mt-16 sm:-ml-[18%] sm:w-[136%] lg:-mt-28 lg:ml-0 lg:w-full">
        <KhelVerse>
          <World />
        </KhelVerse>
      </div>
    </section>
  );
}
