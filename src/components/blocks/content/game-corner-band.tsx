import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SHELF_LABEL, SHELF_KEYS } from "@/lib/constants";

/**
 * The physical Experiential Learning Zone.
 *
 * Full-bleed and tinted — it deliberately breaks the cream rhythm, because
 * this is the one section describing something physical that arrives in the
 * school. The visual interruption does the same job as the paragraph.
 */
export function GameCornerBand() {
  return (
    <section className="bg-ink text-paper" aria-labelledby="game-corner-heading">
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
        <div className="flex flex-col gap-6">
          <p className="text-label font-bold tracking-[0.16em] text-paper/60 uppercase">
            The Game Corner
          </p>
          <h2 id="game-corner-heading" className="text-h1 text-paper">
            Where learning feels like play, and play{" "}
            <em className="accent-phrase text-accent">builds life.</em>
          </h2>
          <p className="measure text-body-lg text-paper/75">
            A branded shelf unit that gives the kits a home in your classroom,
            organised by theme so a teacher can find the right one in seconds —
            not a cupboard they have to dig through.
          </p>
          <div>
            <ButtonLink
              href="/approach/game-corner"
              className="bg-paper text-ink hover:bg-accent hover:text-on-accent"
            >
              See how it works
            </ButtonLink>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {SHELF_KEYS.map((key) => (
            <li
              key={key}
              className="rounded-[var(--radius-md)] border border-paper/15 bg-paper/[0.06] px-4 py-5 text-[0.875rem] font-semibold text-paper/90"
            >
              {SHELF_LABEL[key]}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
