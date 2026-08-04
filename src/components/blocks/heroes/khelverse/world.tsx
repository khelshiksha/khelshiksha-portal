import { iso, points, randRange, VIEW_BOX, type Point } from "./iso";
import { Box, Tree } from "./solids";
import {
  ClimateGrove,
  Schoolhouse,
  ScienceYard,
  SportsGround,
  StageYard,
} from "./landmarks";
import { Sky } from "./sky";
import {
  PLATFORM,
  PLATFORM_H,
  PLAZA,
  PLAZA_CENTRE,
  ZONES,
  zoneCentre,
} from "./zones";

/**
 * The static geometry of KhelVerse.
 *
 * THE SKY IS BACK, thinner than before — four barely-moving clouds and one
 * flock. It was removed when the world sat behind the hero copy and clouds
 * drifted through the paragraph; that layout is gone. See sky.tsx for the
 * full history and for the rule that keeps it from happening again.
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
   rectangle would read as a diagram rather than as a place. */
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

/**
 * Discovery Square: the plaza all five paths run to, with an open book at the
 * centre of it.
 *
 * The centre used to be an empty stone slab with a painted ring. It read as
 * important — everything points at it — and meant nothing, which is the worst
 * combination a focal point can have.
 *
 * An open book, because it is the one object that says "learning" in every
 * language on this page's audience list, at any size, with no label. It is
 * also the only curved-plane object in the world, which is what makes it read
 * as a monument rather than as another building.
 */
function Plaza() {
  const cx = PLAZA_CENTRE.gx;
  const cy = PLAZA_CENTRE.gy;
  const c = iso(cx, cy, PLAZA.h + 0.01);

  /* Plinth height, then the spine and the outer edge of each page. The pages
     tilt: the spine sits higher than the fore-edges, which is what stops the
     book reading as a flat diamond painted on the floor. */
  const base = PLAZA.h + 0.24;
  const spineTop = base + 0.46;
  const edgeTop = base + 0.16;
  const halfW = 0.72;
  const pageD = 0.92;

  const spineA = iso(cx - halfW, cy, spineTop);
  const spineB = iso(cx + halfW, cy, spineTop);
  const backA = iso(cx - halfW, cy - pageD, edgeTop);
  const backB = iso(cx + halfW, cy - pageD, edgeTop);
  const frontA = iso(cx - halfW, cy + pageD, edgeTop);
  const frontB = iso(cx + halfW, cy + pageD, edgeTop);

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

      {/* Ring of brand blue inlaid in the paving, so the plaza reads as a
          designed square rather than a slab. */}
      <ellipse
        cx={c.x}
        cy={c.y}
        rx="60"
        ry="30"
        fill="none"
        stroke="var(--w-sky-blue)"
        strokeWidth="5"
        opacity="0.45"
      />

      {/* Stepped plinth */}
      <Box
        gx={cx - 1.05}
        gy={cy - 1.05}
        gz={PLAZA.h}
        w={2.1}
        d={2.1}
        h={0.12}
        material="stone"
      />
      <Box
        gx={cx - 0.82}
        gy={cy - 0.82}
        gz={PLAZA.h + 0.12}
        w={1.64}
        d={1.64}
        h={0.12}
        material="wood"
      />

      {/* The two pages. Different tones so they read as two planes meeting at
          a ridge, exactly like every roof in the world. */}
      <polygon
        points={points([spineA, spineB, backB, backA])}
        fill="var(--w-stone-top)"
      />
      <polygon
        points={points([spineA, spineB, frontB, frontA])}
        fill="var(--w-stone-left)"
      />
      <line
        x1={spineA.x}
        y1={spineA.y}
        x2={spineB.x}
        y2={spineB.y}
        stroke="var(--w-wood-right)"
        strokeWidth="3"
        strokeLinecap="round"
      />
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
      {/* First, so everything else paints over it. Nothing in the sky is ever
          meant to pass in front of the island. */}
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
      {/* Contact shadow. Without one the plateau reads as a decal on the
          grass rather than a raised bank of earth — the cheapest depth cue
          in the scene and the one that does the most work. */}
      <ellipse
        cx={
          iso(zone.gx + PLATFORM / 2 + 0.18, zone.gy + PLATFORM / 2 + 0.18, 0).x
        }
        cy={
          iso(zone.gx + PLATFORM / 2 + 0.18, zone.gy + PLATFORM / 2 + 0.18, 0).y
        }
        rx="112"
        ry="56"
        fill="var(--w-grass-right)"
        opacity="0.34"
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
