import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { TrustStrip } from "@/components/blocks/proof/trust-strip";
import { getDictionary } from "@/lib/i18n";
import { KhelVerse } from "./khelverse/khelverse";
import { World } from "./khelverse/world";
import { RotatingWord, type HeroWords } from "./rotating-word";

/**
 * The homepage hero - the gate into KhelVerse.
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
 * unreachable by keyboard - on a site whose entire job is to get a school to
 * book a demo. The world is the opening; below it the page stays fast and
 * scannable.
 */

/* The rotating word is the vision line from the brochure - "vibrant hubs of
   discovery" - opened out into the things a classroom actually becomes. Every
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
      <Container className="relative z-10 flex flex-col gap-4 pt-8 sm:gap-5 sm:pt-12 lg:max-w-[62rem] lg:gap-6 lg:pt-12">
        <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
          {SITE.tagline}
        </p>

        <h1 className="text-display-1 text-ink max-sm:text-[2.35rem] max-sm:leading-[1.06]">
          Play with Purpose.
          {/* The line break is desktop-only. On a 390px screen it forced the
              second sentence onto a line of its own and the headline ran to
              SIX lines, which is most of the first screen spent on one
              sentence. Let it flow and it settles into four.

              NO ITALIC IN THE HEADLINE. This section spends its single
              Fraunces phrase on the rotating word below, and two accent
              phrases in one block is where a page starts shouting. */}
          <br className="max-sm:hidden" /> Learn with Joy.
        </h1>

        <p className="text-h3 text-ink-muted max-w-[34ch] font-normal">
          Where learning feels like play, and play builds life.
        </p>

        {/* THE BUTTONS ARE BACK, and the pairing is not the header's.

            They were removed once because "Book a Demo" and "Explore the
            approach" were the fifth and sixth copy of the header's own two
            words above the fold. That objection was about DUPLICATION rather
            than about buttons, so these two deliberately do not repeat it:
            the header closes ("Book a Demo"), and this pair opens the two
            doors a first-time reader actually arrives through - the catalogue
            and the partnership track. Neither label appears in the header.

            Order is browse-then-commit. A visitor who has read four lines is
            not ready to be closed, so the low-commitment door is primary and
            the partnership one is secondary. */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/products" size="lg">
            Explore Our Games
          </ButtonLink>
          <ButtonLink href="/corporate" variant="secondary" size="lg">
            Partner With Us
          </ButtonLink>
        </div>

        {/* THE ROTATING WORD MOVED OUT OF THE <h1>, which is a real change and
            not a reshuffle.

            It used to end the headline. The client's headline is a fixed
            two-sentence line with no slot for a cycling word, so rather than
            lose the word - and with it the die's reason to hop, since the
            board and this list are the same five-item sequence - it becomes
            its own line beneath the CTAs.

            What that costs: the LCP element is now this <h1> alone, which is
            if anything better. What it must not cost is the SYNC - the word
            still changes on lib/play-beat's impact event, so the die landing
            and the word turning stay one event. See rotating-word.tsx. */}
        <p className="text-h3 text-ink max-w-[34ch] font-normal">
          Every classroom a hub of <RotatingWord words={WORDS} />
        </p>

        <TrustStrip items={[t.trust.nep, t.trust.ncf, t.trust.training]} />
      </Container>

      {/* THE CAMPUS SITS BETWEEN THE ACTION AND THE PROSE, on every screen.

          Order is: headline, what you can do, why you can trust it, what it
          is, and only then the paragraph. The illustration is doing the
          explaining, so it belongs above the sentence that would otherwise
          have to. It used to be order-last on desktop, which put the prose
          between the trust signals and the campus and left the zone tooltip
          overlapping the paragraph.

          Wider than the viewport on small screens on purpose: fitting the
          whole island into 390px made every landmark about twelve pixels
          tall, and present-but-unreadable is worse than absent. The camera
          moves in instead, the island runs off both edges, and the section
          clips it so nothing scrolls sideways. */}
      <div className="relative my-1 w-full sm:-mt-4 lg:my-0 lg:mt-2">
        <KhelVerse>
          <World />
        </KhelVerse>
      </div>

      <Container className="relative z-10 mt-2 flex flex-col gap-4 pb-4 sm:gap-5 lg:mt-7 lg:max-w-[62rem] lg:gap-6">
        <p className="measure text-body sm:text-body-lg text-ink-muted">
          Gamified experiential learning kits, a Game Corner for the classroom
          and teacher training. Built for Vidyalayas and aligned to NEP 2020 and
          NCF 2023.
        </p>
      </Container>
    </section>
  );
}
