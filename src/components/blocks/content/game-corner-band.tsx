import { Panel } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SHELF_LABEL, SHELF_KEYS } from "@/lib/constants";

/**
 * The physical Experiential Learning Zone.
 *
 * An inset dark panel - it deliberately breaks the cream rhythm, because this
 * is the one section describing something physical that arrives in the
 * school. The visual interruption does the same job as the paragraph.
 */
export function GameCornerBand() {
  return (
    <Panel
      tone="dark"
      labelledBy="game-corner-heading"
      innerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
    >
      <div className="flex flex-col gap-6">
        <p className="text-label text-on-band-dark/70 font-bold tracking-[0.16em] uppercase">
          The Game Corner
        </p>
        <h2 id="game-corner-heading" className="text-h1 text-on-band-dark">
          Where learning feels like play, and play{" "}
          <em className="accent-phrase text-accent">builds life.</em>
        </h2>
        <p className="measure text-body-lg text-on-band-dark/80">
          A branded shelf unit that gives the kits a home in your classroom,
          organised by theme so a teacher can find the right one in seconds, not
          a cupboard they have to dig through.
        </p>
        <div>
          <ButtonLink
            href="/approach/game-corner"
            className="bg-on-band-dark text-band-dark hover:bg-accent hover:text-on-accent"
          >
            See how it works
          </ButtonLink>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3">
        {SHELF_KEYS.map((key) => (
          <li
            key={key}
            className="border-on-band-dark/20 bg-on-band-dark/[0.07] text-on-band-dark/90 rounded-[var(--radius-md)] border px-4 py-5 text-[0.875rem] font-semibold"
          >
            {SHELF_LABEL[key]}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
