import { iso, points, randRange } from "./iso";
import { Box, Post, Pyramid, Tile, Tree } from "./solids";

/**
 * One landmark per zone.
 *
 * Each is a silhouette a person can name at a glance from across the page —
 * a schoolhouse, a rocket, a windmill, a running track, a stage. Legibility at
 * small size is the whole design constraint here: on a laptop each of these is
 * about 90px tall, so a landmark that needs detail to be understood is a
 * landmark that fails. Detail is spent on the roofline, not on props.
 *
 * Nothing here is a character. See the note in solids.tsx.
 */

/** Foundational Learning — a schoolhouse with a bell tower and number blocks. */
export function Schoolhouse({
  gx,
  gy,
  gz,
}: {
  gx: number;
  gy: number;
  gz: number;
}) {
  return (
    <g>
      {/* Tower first — it stands BEHIND the hall, so it must be painted
          first. Drawing it after put its roof over the hall's roof and the
          two read as one collapsed shape. */}
      <Box
        gx={gx + 1.42}
        gy={gy + 0.3}
        gz={gz}
        w={0.56}
        d={0.56}
        h={1.32}
        material="stone"
      />
      <Pyramid
        gx={gx + 1.36}
        gy={gy + 0.24}
        gz={gz + 1.32}
        w={0.68}
        d={0.68}
        h={0.46}
        material="roof"
      />

      {/* The hall. The roof overhangs by a tenth of a unit, not by a quarter:
          the earlier overhang was wide enough to hide the walls completely, so
          the building read as a roof resting on the grass. */}
      <Box
        gx={gx + 0.28}
        gy={gy + 0.9}
        gz={gz}
        w={1.34}
        d={1.0}
        h={0.78}
        material="stone"
      />
      <Pyramid
        gx={gx + 0.18}
        gy={gy + 0.8}
        gz={gz + 0.78}
        w={1.54}
        d={1.2}
        h={0.5}
        material="roof"
      />

      {/* Counting blocks in the yard — the one nod to what is taught here. */}
      <Box
        gx={gx + 0.32}
        gy={gy + 2.14}
        gz={gz}
        w={0.32}
        d={0.32}
        h={0.32}
        material="wood"
      />
      <Box
        gx={gx + 0.72}
        gy={gy + 2.18}
        gz={gz}
        w={0.28}
        d={0.28}
        h={0.28}
        material="wood"
      />
      <Box
        gx={gx + 0.34}
        gy={gy + 2.16}
        gz={gz + 0.32}
        w={0.28}
        d={0.28}
        h={0.28}
        material="roof"
      />
    </g>
  );
}

/** Climate Education — a windmill, trees and a pond. */
export function ClimateGrove({
  gx,
  gy,
  gz,
}: {
  gx: number;
  gy: number;
  gz: number;
}) {
  const hub = iso(gx + 1.86, gy + 0.86, gz + 1.5);

  return (
    <g>
      {/* Pond, sunk very slightly so its edge reads as a bank. */}
      <Tile
        gx={gx + 0.18}
        gy={gy + 1.5}
        w={1.1}
        d={0.9}
        fill="var(--w-water)"
        gz={gz + 0.01}
      />
      <Tile
        gx={gx + 0.36}
        gy={gy + 1.66}
        w={0.5}
        d={0.34}
        fill="var(--w-water-lit)"
        gz={gz + 0.02}
      />

      <Tree gx={gx + 0.2} gy={gy + 0.2} gz={gz} scale={1.05} />
      <Tree gx={gx + 1.02} gy={gy + 0.42} gz={gz} scale={0.78} tiers={2} />
      <Tree gx={gx + 1.5} gy={gy + 1.94} gz={gz} scale={0.9} />

      {/* Windmill. The blades spin — the one continuously moving mechanism in
          the world, so the eye always has somewhere to rest. */}
      <Box
        gx={gx + 1.78}
        gy={gy + 0.78}
        gz={gz}
        w={0.18}
        d={0.18}
        h={1.5}
        material="stone"
      />
      <g
        className="kv-spin"
        style={{ transformOrigin: `${hub.x}px ${hub.y}px` }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x={hub.x - 2.5}
            y={hub.y - 34}
            width="5"
            height="34"
            rx="2.5"
            fill="var(--w-stone-top)"
            transform={`rotate(${deg} ${hub.x} ${hub.y})`}
          />
        ))}
        <circle cx={hub.x} cy={hub.y} r="4" fill="var(--w-wood-left)" />
      </g>
    </g>
  );
}

/** Future Readiness — a launch pad and a small observatory dome. */
export function ScienceYard({
  gx,
  gy,
  gz,
}: {
  gx: number;
  gy: number;
  gz: number;
}) {
  const dome = iso(gx + 1.95, gy + 1.83, gz + 0.4);

  return (
    <g>
      {/* Launch pad */}
      <Box
        gx={gx + 0.34}
        gy={gy + 0.34}
        gz={gz}
        w={1.1}
        d={1.1}
        h={0.16}
        material="stone"
      />

      {/* Rocket: body, nose, and two fins. Fins are what make a cylinder read
          as a rocket rather than as a chimney. */}
      <Box
        gx={gx + 0.62}
        gy={gy + 0.62}
        gz={gz + 0.16}
        w={0.66}
        d={0.66}
        h={1.02}
        material="stone"
      />
      <Pyramid
        gx={gx + 0.62}
        gy={gy + 0.62}
        gz={gz + 1.18}
        w={0.66}
        d={0.66}
        h={0.66}
        material="roof"
      />
      <Box
        gx={gx + 0.44}
        gy={gy + 0.82}
        gz={gz + 0.16}
        w={0.2}
        d={0.26}
        h={0.44}
        material="coralwood"
      />
      <Box
        gx={gx + 0.82}
        gy={gy + 1.24}
        gz={gz + 0.16}
        w={0.26}
        d={0.2}
        h={0.44}
        material="coralwood"
      />

      <Box
        gx={gx + 0.6}
        gy={gy + 0.6}
        gz={gz + 0.86}
        w={0.7}
        d={0.7}
        h={0.2}
        material="coralwood"
      />

      {/* Exhaust — a soft plume, drifting on its own loop. */}
      <g className="kv-plume">
        <ellipse
          cx={iso(gx + 0.89, gy + 0.89, gz + 0.1).x}
          cy={iso(gx + 0.89, gy + 0.89, gz + 0.1).y}
          rx="15"
          ry="7"
          fill="var(--w-cloud)"
          opacity="0.75"
        />
        <ellipse
          cx={iso(gx + 0.89, gy + 0.89, gz + 0.1).x - 12}
          cy={iso(gx + 0.89, gy + 0.89, gz + 0.1).y + 4}
          rx="9"
          ry="5"
          fill="var(--w-cloud)"
          opacity="0.5"
        />
      </g>

      {/* Observatory: a drum with a half-dome, the classic silhouette. */}
      <Box
        gx={gx + 1.62}
        gy={gy + 1.5}
        gz={gz}
        w={0.66}
        d={0.66}
        h={0.4}
        material="stone"
      />
      <path
        d={`M ${dome.x - 25} ${dome.y} a 25 17 0 0 1 50 0 z`}
        fill="var(--w-sky-blue)"
      />
    </g>
  );
}

/** Health & Nutrition — a running track, a flag, and a yoga deck. */
export function SportsGround({
  gx,
  gy,
  gz,
}: {
  gx: number;
  gy: number;
  gz: number;
}) {
  const centre = iso(gx + 1.1, gy + 1.1, gz + 0.02);

  return (
    <g>
      {/* The track is a projected ellipse rather than a drawn oval: a circle on
          the ground plane becomes an ellipse of exactly this ratio under a 2:1
          projection, so it sits flat instead of floating. */}
      {/* Sized to the platform. At rx 74 the track overhung the plateau on
          every side and read as a coral ring lying on the island rather than
          as a running track on the ground of this zone. */}
      <ellipse
        cx={centre.x}
        cy={centre.y}
        rx="56"
        ry="28"
        fill="var(--w-coral)"
        opacity="0.9"
      />
      <ellipse
        cx={centre.x}
        cy={centre.y}
        rx="35"
        ry="17.5"
        fill="var(--w-grass-top)"
      />

      {/* Yoga deck */}
      <Box
        gx={gx + 1.7}
        gy={gy + 1.72}
        gz={gz}
        w={0.86}
        d={0.7}
        h={0.1}
        material="wood"
      />

      {/* Flag. The cloth is the only shape in the world allowed to be a curve
          on a vertical plane, because a rectangle would read as a signboard. */}
      <Post gx={gx + 0.26} gy={gy + 2.18} gz={gz} h={1.34} />
      <path
        d={(() => {
          const p = iso(gx + 0.33, gy + 2.25, gz + 1.34);
          return `M ${p.x} ${p.y} q 15 6 30 -2 l 0 18 q -15 8 -30 2 z`;
        })()}
        fill="var(--w-coral)"
      />
    </g>
  );
}

/** Life Skills — an open stage with a canopy, and a shelf of books. */
export function StageYard({
  gx,
  gy,
  gz,
}: {
  gx: number;
  gy: number;
  gz: number;
}) {
  return (
    <g>
      <Box
        gx={gx + 0.3}
        gy={gy + 0.4}
        gz={gz}
        w={1.5}
        d={1.2}
        h={0.24}
        material="wood"
      />

      {/* Four posts and a canopy — an open pavilion, so the zone does not read
          as another closed building like the schoolhouse. */}
      <Post gx={gx + 0.36} gy={gy + 0.46} gz={gz + 0.24} h={0.72} />
      <Post gx={gx + 1.66} gy={gy + 0.46} gz={gz + 0.24} h={0.72} />
      <Post gx={gx + 0.36} gy={gy + 1.46} gz={gz + 0.24} h={0.72} />
      <Post gx={gx + 1.66} gy={gy + 1.46} gz={gz + 0.24} h={0.72} />
      <Pyramid
        gx={gx + 0.16}
        gy={gy + 0.26}
        gz={gz + 0.96}
        w={1.78}
        d={1.48}
        h={0.56}
        material="roof"
      />

      {/* Books, stacked slightly out of true. */}
      <Box
        gx={gx + 0.44}
        gy={gy + 1.92}
        gz={gz}
        w={0.62}
        d={0.44}
        h={0.12}
        material="stone"
      />
      <Box
        gx={gx + 0.5}
        gy={gy + 1.96}
        gz={gz + 0.12}
        w={0.58}
        d={0.4}
        h={0.11}
        material="roof"
      />
      <Box
        gx={gx + 0.46}
        gy={gy + 1.9}
        gz={gz + 0.23}
        w={0.56}
        d={0.4}
        h={0.11}
        material="wood"
      />
    </g>
  );
}

/**
 * Scattered ground cover — small trees and rocks filling the island between
 * zones. Positions come from the seeded generator, so the scatter is identical
 * on the server and the client and cannot cause a hydration mismatch, while
 * still looking unplanned.
 */
export function Scatter({
  seeds,
  spots,
}: {
  seeds: number;
  spots: { gx: number; gy: number }[];
}) {
  return (
    <g>
      {spots.map((spot, i) => {
        const s = seeds + i * 7;
        const scale = randRange(s, 0.5, 0.86);
        return (
          <Tree
            key={i}
            gx={spot.gx + randRange(s + 1, -0.2, 0.2)}
            gy={spot.gy + randRange(s + 2, -0.2, 0.2)}
            scale={scale}
            tiers={rand2(s) ? 2 : 3}
          />
        );
      })}
    </g>
  );
}

function rand2(seed: number): boolean {
  return randRange(seed + 3, 0, 1) > 0.5;
}

/** A flat, soft-edged shadow under a solid, so nothing appears to float. */
export function GroundShadow({
  gx,
  gy,
  w,
  d,
  gz = 0,
}: {
  gx: number;
  gy: number;
  w: number;
  d: number;
  gz?: number;
}) {
  const c = iso(gx + w / 2, gy + d / 2, gz);
  return (
    <ellipse
      cx={c.x}
      cy={c.y}
      rx={w * 30}
      ry={w * 15}
      fill="var(--w-grass-right)"
      opacity="0.35"
    />
  );
}

export { points };
