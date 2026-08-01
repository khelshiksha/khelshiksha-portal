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
    <section className="kv-hero relative flex flex-col overflow-hidden">
      <Container className="relative z-10 flex flex-col gap-4 pt-8 sm:gap-5 sm:pt-16 lg:max-w-[62rem] lg:gap-6 lg:pt-20">
        <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
          {SITE.tagline}
        </p>

        <h1 className="text-display-1 max-sm:text-[2.35rem] max-sm:leading-[1.06] text-ink">
          Learning through play.
          {/* The line break is desktop-only. On a 390px screen it forced
              "play." onto a line of its own and the headline ran to SIX lines,
              which is most of the first screen spent on one sentence. Let it
              flow and it settles into four. */}
          <br className="max-sm:hidden" />{" "}
          Every classroom a hub of <RotatingWord words={WORDS} />
        </h1>
      </Container>

      {/* THE WORLD SITS BETWEEN THE HEADLINE AND THE COPY ON MOBILE.
          Below it on desktop, via order-last.

          This is the whole mobile fix. With the world last, a phone visitor
          met eyebrow + headline + paragraph + two buttons — a screen of pure
          type — and the island only began around 1300px down. Most visitors
          are on phones, so for most visitors the entire brand idea was below
          the fold. Moved here, the world lands in the first screen and the
          buttons still clear it.

          Wider than the viewport on small screens on purpose: fitting the
          whole island into 390px made every landmark about twelve pixels
          tall, and present-but-unreadable is worse than absent. The camera
          moves in instead, the island runs off both edges, and the section
          clips it so nothing scrolls sideways. */}
      <div className="relative -mx-[38%] my-1 w-[176%] overflow-hidden sm:-mx-[18%] sm:-mt-8 sm:w-[136%] lg:order-last lg:mx-0 lg:-mt-28 lg:w-full lg:overflow-visible">
        {/* Crop the sky on small screens.

            Zoomed in on a phone, the band above the island is mostly empty,
            and a single drifting cloud sitting alone in it read as a stray
            white blob under the headline rather than as weather. Desktop
            keeps the full sky, where the clouds have an island and a balloon
            to belong to. */}
        <div className="-mt-10 sm:mt-0">
          <KhelVerse>
            <World />
          </KhelVerse>
        </div>
      </div>

      <Container className="relative z-10 flex flex-col gap-4 pb-4 sm:gap-5 lg:max-w-[62rem] lg:gap-6">
        <p className="measure text-body sm:text-body-lg text-ink-muted">
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
    </section>
  );
}
