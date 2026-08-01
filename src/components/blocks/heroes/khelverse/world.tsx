import { iso, points, randRange, VIEW_BOX, type Point } from "./iso";
import { Box, Tile, Tree } from "./solids";
import {
  ClimateGrove,
  Schoolhouse,
  ScienceYard,
  SportsGround,
  StageYard,
} from "./landmarks";
import { PLATFORM, PLATFORM_H, PLAZA, PLAZA_CENTRE, ZONES, zoneCentre } from "./zones";

/**
 * The static geometry of KhelVerse.
 *
 * A SERVER component on purpose. This is the largest markup on the site, and
 * none of it is interactive — shipping it as a client component would put
 * every polygon in the JavaScript bundle of the page whose load time matters
 * most. Only the die and the zone links are client-side; they layer over this
 * in a second SVG with an identical viewBox.
 *
 * Decorative in full, so aria-hidden. Everything the world says is also said
 * in the headline and in the real links above it — a screen reader gets the
 * five pillars as text, not as a description of a picture.
 *
 * PAINT ORDER IS THE WHOLE GAME. SVG has no z-index; it paints in document
 * order. So the island is drawn first, then the plaza, then the zones sorted
 * back to front by grid depth. Draw a zone out of order and it overlaps a
 * building it should sit behind, and the solidity of the scene collapses.
 */

/* The island's outline in grid units. Deliberately irregular — a circle or a
   rectangle would read as a diagram, and the brief asked for a place. */
const ISLAND: readonly Point[] = [
  { x: 3.2, y: -1.0 },
  { x: 7.2, y: -0.4 },
  { x: 10.6, y: 1.2 },
  { x: 12.0, y: 4.8 },
  { x: 11.8, y: 8.8 },
  { x: 9.2, y: 11.4 },
  { x: 5.2, y: 12.2 },
  { x: 1.6, y: 10.8 },
  { x: -0.8, y: 7.8 },
  { x: -1.0, y: 4.0 },
  { x: 0.8, y: 1.0 },
];

const ISLAND_DEPTH = 1.15;

/**
 * The island as an extruded slab.
 *
 * Only the edges facing the viewer get a side face. Which those are is decided
 * by geometry rather than by hand: an edge is visible when its outward normal
 * points down the screen. Emitting all of them instead would paint back faces
 * over the front of the island.
 */
function Island() {
  const top = ISLAND.map((p) => iso(p.x, p.y, 0));
  const bottom = ISLAND.map((p) => iso(p.x, p.y, -ISLAND_DEPTH));

  const centre = top.reduce(
    (acc, p) => ({ x: acc.x + p.x / top.length, y: acc.y + p.y / top.length }),
    { x: 0, y: 0 },
  );

  const skirts = top.map((p1, i) => {
    const j = (i + 1) % top.length;
    const mid = { x: (p1.x + top[j].x) / 2, y: (p1.y + top[j].y) / 2 };
    const outward = { x: mid.x - centre.x, y: mid.y - centre.y };
    return { i, j, visible: outward.y > 0, right: outward.x > 0 };
  });

  return (
    <g>
      {skirts
        .filter((s) => s.visible)
        .map((s) => (
          <polygon
            key={s.i}
            points={points([top[s.i], top[s.j], bottom[s.j], bottom[s.i]])}
            fill={s.right ? "var(--w-earth-right)" : "var(--w-earth-left)"}
          />
        ))}
      <polygon points={points(top)} fill="var(--w-grass-top)" />
      {/* A few darker patches. One flat fill across an island this size read
          as a sheet of paper; these give the turf enough variation to look
          like ground without introducing any texture or gradient. */}
      {[
        { gx: 1.4, gy: 6.6, rx: 96, ry: 44 },
        { gx: 8.6, gy: 9.4, rx: 78, ry: 36 },
        { gx: 9.8, gy: 1.8, rx: 66, ry: 30 },
      ].map((patch, i) => {
        const c = iso(patch.gx, patch.gy, 0.004);
        return (
          <ellipse
            key={i}
            cx={c.x}
            cy={c.y}
            rx={patch.rx}
            ry={patch.ry}
            fill="var(--w-grass-left)"
            opacity="0.45"
          />
        );
      })}
    </g>
  );
}

/** Paths radiating from Discovery Square to each zone. */
function Paths() {
  const hub = iso(PLAZA_CENTRE.gx, PLAZA_CENTRE.gy, 0.02);

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {ZONES.map((zone) => {
        const c = zoneCentre(zone);
        const end = iso(c.gx, c.gy, 0.02);
        /* Bowed rather than straight: a path that bends looks walked, a path
           that is a straight line looks like a wire in a diagram. */
        const bow = {
          x: (hub.x + end.x) / 2 + (end.y - hub.y) * 0.08,
          y: (hub.y + end.y) / 2 - (end.x - hub.x) * 0.04,
        };
        /* ONE soft stroke. A darker stroke under a lighter one gave the path
           a visible edge, and an edge on a flat surface reads as thickness —
           the paths looked like planks laid across the grass. A single
           low-contrast band reads as ground worn bare. */
        return (
          <path
            key={zone.slug}
            d={`M ${hub.x} ${hub.y} Q ${bow.x} ${bow.y} ${end.x} ${end.y}`}
            stroke="var(--w-path-top)"
            strokeWidth="11"
            opacity="0.6"
          />
        );
      })}
    </g>
  );
}

/** Discovery Square: a low stone plaza where the paths meet. */
function Plaza() {
  const c = iso(PLAZA_CENTRE.gx, PLAZA_CENTRE.gy, PLAZA.h + 0.01);
  return (
    <g>
      <Box
        gx={PLAZA.gx}
        gy={PLAZA.gy}
        w={PLAZA.size}
        d={PLAZA.size}
        h={PLAZA.h}
        material="stone"
      />
      {/* An inlaid ring in brand blue. In pale stone-on-stone it disappeared
          entirely and Discovery Square — the point all five paths run to —
          read as an empty patch. */}
      <ellipse
        cx={c.x}
        cy={c.y}
        rx="58"
        ry="29"
        fill="none"
        stroke="var(--w-sky-blue)"
        strokeWidth="6"
        opacity="0.55"
      />
      <ellipse cx={c.x} cy={c.y} rx="26" ry="13" fill="var(--w-sky-blue)" opacity="0.22" />
    </g>
  );
}

const LANDMARKS = {
  "foundational-learning": Schoolhouse,
  "climate-education": ClimateGrove,
  "future-readiness": ScienceYard,
  "health-nutrition": SportsGround,
  "life-skills": StageYard,
} as const;

/** Trees filling the island between the zones. Seeded, never Math.random. */
const FILLER = [
  { gx: 1.2, gy: 1.6 },
  { gx: 2.6, gy: 0.6 },
  { gx: 6.4, gy: -0.2 },
  { gx: 9.4, gy: 0.8 },
  { gx: 11.0, gy: 3.0 },
  { gx: 11.2, gy: 6.4 },
  { gx: 10.4, gy: 9.6 },
  { gx: 7.4, gy: 10.6 },
  { gx: 3.0, gy: 11.0 },
  { gx: 0.4, gy: 9.2 },
  { gx: -0.4, gy: 6.0 },
  { gx: 0.0, gy: 2.8 },
  { gx: 6.8, gy: 8.4 },
  { gx: 2.4, gy: 7.2 },
];

export function World() {
  /* Back to front. Everything with a footprint goes through this one sort;
     nothing is allowed to rely on the order it appears in the source. */
  const painted = [
    ...ZONES.map((zone) => ({
      key: zone.slug,
      depth: zone.gx + zone.gy,
      node: <ZonePlatform slug={zone.slug} />,
    })),
    {
      key: "plaza",
      depth: PLAZA.gx + PLAZA.gy,
      node: <Plaza />,
    },
  ].sort((a, b) => a.depth - b.depth);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="kv-world size-full"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <Sky />

      <Island />

      {FILLER.map((spot, i) => {
        const s = 31 + i * 13;
        return (
          <FillerTree
            key={i}
            gx={spot.gx + randRange(s, -0.25, 0.25)}
            gy={spot.gy + randRange(s + 1, -0.25, 0.25)}
            scale={randRange(s + 2, 0.52, 0.92)}
            seed={s}
          />
        );
      })}

      <Paths />

      {painted.map((item) => (
        <g key={item.key}>{item.node}</g>
      ))}
    </svg>
  );
}

function FillerTree({
  gx,
  gy,
  scale,
  seed,
}: {
  gx: number;
  gy: number;
  scale: number;
  seed: number;
}) {
  /* Each tree sways on its own clock. Identical loops across fourteen trees
     would read as a single mechanism rather than as wind. */
  const style = {
    animationDuration: `${randRange(seed + 5, 5.5, 9.5)}s`,
    animationDelay: `-${randRange(seed + 6, 0, 6)}s`,
    transformOrigin: `${iso(gx + 0.4, gy + 0.4, 0).x}px ${iso(gx + 0.4, gy + 0.4, 0).y}px`,
  };
  return (
    <g className="kv-sway" style={style}>
      <Tree
        gx={gx}
        gy={gy}
        scale={scale}
        tiers={randRange(seed + 7, 0, 1) > 0.45 ? 3 : 2}
      />
    </g>
  );
}

/** Uniform scale about a platform's centre, in screen space. */
function landmarkScale(gx: number, gy: number): string {
  const c = iso(gx + PLATFORM / 2, gy + PLATFORM / 2, PLATFORM_H);
  return `translate(${c.x} ${c.y}) scale(1.34) translate(${-c.x} ${-c.y})`;
}

function ZonePlatform({ slug }: { slug: string }) {
  const zone = ZONES.find((z) => z.slug === slug);
  if (zone === undefined) return null;
  const Landmark = LANDMARKS[slug as keyof typeof LANDMARKS];

  return (
    <g className="kv-zone" data-zone={slug}>
      {/* The glow sits UNDER the platform and is scaled up on hover, so the
          highlight reads as the ground lighting rather than as an outline
          drawn around a shape. */}
      <ellipse
        className="kv-zone-glow"
        cx={iso(zone.gx + PLATFORM / 2, zone.gy + PLATFORM / 2, 0).x}
        cy={iso(zone.gx + PLATFORM / 2, zone.gy + PLATFORM / 2, 0).y}
        rx="118"
        ry="60"
        fill={zone.accent}
      />
      <g className="kv-zone-body">
        {/* Turf on an earth bank. Once the side faces were drawn correctly
            this needed no rim of its own — the two shaded earth faces under
            the grass are what make the plateau read as raised. An earlier
            version outlined it in pale stone, which looked like a diagram. */}
        <Box
          gx={zone.gx}
          gy={zone.gy}
          w={PLATFORM}
          d={PLATFORM}
          h={PLATFORM_H}
          material="earth"
        />
        {/* Scaled about the platform centre rather than by editing every
            coordinate inside each landmark. At true footprint size the
            buildings were too small to identify — a schoolhouse you cannot
            recognise is just a beige lump — and uniform scaling of flat-shaded
            polygons stays perfectly isometric. */}
        <g transform={landmarkScale(zone.gx, zone.gy)}>
          <Landmark gx={zone.gx} gy={zone.gy} gz={PLATFORM_H} />
        </g>
      </g>
    </g>
  );
}

/** Clouds, a balloon and birds. Everything drifts on its own timing. */
function Sky() {
  return (
    <g className="kv-sky">
      {[
        { x: 120, y: 70, s: 1.0, seed: 3 },
        { x: 520, y: 40, s: 0.72, seed: 9 },
        { x: 880, y: 96, s: 1.15, seed: 17 },
        { x: 1120, y: 46, s: 0.62, seed: 23 },
      ].map((c) => (
        <g
          key={c.seed}
          className="kv-drift"
          style={{
            animationDuration: `${randRange(c.seed, 46, 82)}s`,
            animationDelay: `-${randRange(c.seed + 1, 0, 40)}s`,
          }}
        >
          <g transform={`translate(${c.x} ${c.y}) scale(${c.s})`} opacity="0.9">
            <ellipse cx="0" cy="0" rx="42" ry="20" fill="var(--w-cloud)" />
            <ellipse cx="-30" cy="6" rx="26" ry="14" fill="var(--w-cloud)" />
            <ellipse cx="30" cy="7" rx="30" ry="15" fill="var(--w-cloud)" />
            <ellipse cx="6" cy="-14" rx="24" ry="15" fill="var(--w-cloud)" />
          </g>
        </g>
      ))}

      {/* Hot air balloon — the one object that crosses the whole sky, on a very
          long loop so it is a surprise rather than a metronome. */}
      <g className="kv-balloon">
        <g transform="translate(0 0)">
          <path
            d="M0-26 a26 30 0 0 1 26 30 c0 14 -12 24 -26 40 c-14 -16 -26 -26 -26 -40 a26 30 0 0 1 26 -30 z"
            fill="var(--w-coral)"
          />
          <path
            d="M0-26 a26 30 0 0 1 13 4 c4 20 2 40 -13 66 c-4 -6 -7 -11 -10 -16 c6 -20 9 -38 10 -54 z"
            fill="var(--w-roof-top)"
            opacity="0.85"
          />
          <rect x="-7" y="46" width="14" height="10" rx="3" fill="var(--w-wood-left)" />
          <path d="M-8 44 l3 -6 M8 44 l-3 -6" stroke="var(--w-wood-right)" strokeWidth="1.6" />
        </g>
      </g>

      {[
        { x: 300, y: 128, seed: 41 },
        { x: 340, y: 112, seed: 47 },
        { x: 372, y: 134, seed: 53 },
      ].map((b) => (
        <g
          key={b.seed}
          className="kv-bird"
          style={{
            animationDuration: `${randRange(b.seed, 26, 38)}s`,
            animationDelay: `-${randRange(b.seed + 1, 0, 26)}s`,
          }}
        >
          <path
            d={`M${b.x} ${b.y} q 7 -6 14 0 q 7 -6 14 0`}
            fill="none"
            stroke="var(--w-stone-right)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      ))}
    </g>
  );
}
