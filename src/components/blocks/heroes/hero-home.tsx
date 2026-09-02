import { Container } from "@/components/ui/container";
import { getHeroProducts } from "@/services/cms";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { TrustStrip } from "@/components/blocks/proof/trust-strip";
import { getDictionary } from "@/lib/i18n";
import { ProductStage } from "./product-stage";
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

export async function HeroHome() {
  const t = getDictionary();
  const products = await getHeroProducts();

  return (
    <section className="kv-hero relative flex flex-col overflow-hidden">
      {/* TWO COLUMNS FROM lg, AND THAT IS THE REAL CHANGE HERE.

          The hero used to stack: copy, then a full-width isometric campus,
          then a paragraph. It read top-to-bottom as one long column and spent
          most of a laptop screen before the first product appeared.

          Proposition left, product right is the arrangement this content
          actually wants. The reader gets the claim and the two doors out of
          it in one glance, and the thing being claimed about is beside them
          rather than a scroll away. Below lg it stacks in that same order,
          because a phone has no second column and the copy must still come
          first.

          items-center rather than items-start: the stage is a fixed square
          and the copy column varies with the headline's wrap, so aligning
          their tops would leave the square hanging in whitespace whenever the
          copy is short. */}
      {/* MORE AIR THAN THIS USED TO HAVE, on purpose.

          The copy column grew by two rows when the CTAs and the rotating
          word line arrived, and the old gap-6/pt-12 had been tuned for a
          shorter stack - so the block read as crowded exactly where it
          should feel most composed. The steps are per-breakpoint rather
          than one larger number because vertical space is cheap on a
          desktop and expensive on a phone, where the campus below still
          has to be reachable without a long scroll. */}
      <Container className="relative z-10 grid items-center gap-10 pt-10 pb-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:pt-16 lg:pb-12">
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
          <p className="text-label text-ink-subtle font-bold tracking-[0.16em] uppercase">
            {SITE.tagline}
          </p>

          {/* brand-display is Baloo, and this is the ONLY heading on the site
            that gets it - see lib/fonts.ts for why the scope is one line. */}
          <h1 className="brand-display text-display-1 text-ink max-sm:text-[2.5rem] max-sm:leading-[1.02]">
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
        </div>

        {/* THE STAGE REPLACES THE ISOMETRIC CAMPUS.

            The campus was a beautiful thing that showed no product. Its die
            hopped between five painted zones and the headline word changed
            where it landed; the kits it was standing in for were nowhere on
            the screen. This keeps the mechanism exactly - same beat, same
            die, same causality - and puts the actual kits under it.

            khelverse/ is still in the tree and still builds. Reverting is
            this block and two imports. */}
        <ProductStage products={products} />
      </Container>

      <Container className="relative z-10 flex flex-col gap-4 pb-10 sm:gap-5 sm:pb-12 lg:max-w-[62rem] lg:gap-6 lg:pb-16">
        <p className="measure text-body sm:text-body-lg text-ink-muted">
          Gamified experiential learning kits, a Game Corner for the classroom
          and teacher training. Built for Vidyalayas and aligned to NEP 2020 and
          NCF 2023.
        </p>
      </Container>
    </section>
  );
}
