import { iso, points, type Point } from "./iso";

/**
 * The solid vocabulary of KhelVerse.
 *
 * Everything in the world is built from these five shapes. That constraint is
 * deliberate — a world assembled from one consistent set of forms reads as a
 * designed place, while a world where each object is drawn ad hoc reads as
 * clip-art. It is also what makes the light direction believable: the top face
 * is always lit, the left face always mid, the right face always dark, on
 * every object without exception.
 *
 * No characters, no faces, no anatomy. Monument Valley, which this borrows
 * from, is almost entirely architecture; hand-authored figures in SVG are what
 * two earlier passes at this hero died on.
 */

type Material = { top: string; left: string; right: string };

export const MATERIALS = {
  grass: {
    top: "var(--w-grass-top)",
    left: "var(--w-grass-left)",
    right: "var(--w-grass-right)",
  },
  earth: {
    top: "var(--w-grass-top)",
    left: "var(--w-earth-left)",
    right: "var(--w-earth-right)",
  },
  stone: {
    top: "var(--w-stone-top)",
    left: "var(--w-stone-left)",
    right: "var(--w-stone-right)",
  },
  wood: {
    top: "var(--w-wood-top)",
    left: "var(--w-wood-left)",
    right: "var(--w-wood-right)",
  },
  roof: {
    top: "var(--w-roof-top)",
    left: "var(--w-roof-left)",
    right: "var(--w-roof-right)",
  },
  leaf: {
    top: "var(--w-leaf-top)",
    left: "var(--w-leaf-left)",
    right: "var(--w-leaf-right)",
  },
  /* Fins and trim. Wood against a stone rocket body was too close in value
     for the fins to register at this size. */
  coralwood: {
    top: "var(--w-coral)",
    left: "var(--w-coral)",
    right: "var(--w-wood-right)",
  },
  path: {
    top: "var(--w-path-top)",
    left: "var(--w-path-left)",
    right: "var(--w-path-left)",
  },
} satisfies Record<string, Material>;

export type MaterialName = keyof typeof MATERIALS;

/**
 * A rectangular box: w × d on the ground, h tall, its near-bottom corner at
 * (gx, gy, gz). The workhorse — platforms, walls, buildings, steps and plinths
 * are all boxes at different proportions.
 */
export function Box({
  gx,
  gy,
  gz = 0,
  w,
  d,
  h,
  material,
  opacity,
}: {
  gx: number;
  gy: number;
  gz?: number;
  w: number;
  d: number;
  h: number;
  material: MaterialName;
  opacity?: number;
}) {
  const m = MATERIALS[material];
  const top = gz + h;

  /* Corner naming matters here, and getting it wrong is invisible until the
     whole scene looks subtly broken.

     Increasing gx runs down-RIGHT on screen and increasing gy runs down-LEFT,
     so of the four top corners: `back` is highest, `front` is lowest, and
     `left`/`right` are the flanks. The two faces the camera can see are
     exactly the two that touch `front`. An earlier version drew one of these
     and one BACK face, which is why every solid in the world was missing a
     side and showing a face that should have been hidden. */
  const back = iso(gx, gy, top);
  const right = iso(gx + w, gy, top);
  const front = iso(gx + w, gy + d, top);
  const left = iso(gx, gy + d, top);

  const rightB = iso(gx + w, gy, gz);
  const frontB = iso(gx + w, gy + d, gz);
  const leftB = iso(gx, gy + d, gz);

  return (
    <g opacity={opacity}>
      <polygon points={points([back, right, front, left])} fill={m.top} />
      <polygon points={points([left, front, frontB, leftB])} fill={m.left} />
      <polygon points={points([right, front, frontB, rightB])} fill={m.right} />
    </g>
  );
}

/**
 * A square pyramid — roofs, and the canopy tiers of a tree. Two faces visible,
 * shaded left and right like every other solid.
 */
export function Pyramid({
  gx,
  gy,
  gz = 0,
  w,
  d,
  h,
  material,
}: {
  gx: number;
  gy: number;
  gz?: number;
  w: number;
  d: number;
  h: number;
  material: MaterialName;
}) {
  const m = MATERIALS[material];
  const apex = iso(gx + w / 2, gy + d / 2, gz + h);
  /* Same rule as Box: the visible faces are the two touching the front
     corner. Drawing a back face here made every roof read as one flat
     triangle instead of two planes meeting at a ridge. */
  const right = iso(gx + w, gy, gz);
  const front = iso(gx + w, gy + d, gz);
  const left = iso(gx, gy + d, gz);

  return (
    <g>
      <polygon points={points([left, front, apex])} fill={m.left} />
      <polygon points={points([right, front, apex])} fill={m.right} />
    </g>
  );
}

/**
 * A flat quad laid on the ground — paths, plazas, water, painted markings.
 * Zero height, so it never needs side faces.
 */
export function Tile({
  gx,
  gy,
  gz = 0,
  w,
  d,
  fill,
  opacity,
  rx,
}: {
  gx: number;
  gy: number;
  gz?: number;
  w: number;
  d: number;
  fill: string;
  opacity?: number;
  rx?: number;
}) {
  const corners: Point[] = [
    iso(gx, gy, gz),
    iso(gx + w, gy, gz),
    iso(gx + w, gy + d, gz),
    iso(gx, gy + d, gz),
  ];
  return (
    <polygon
      points={points(corners)}
      fill={fill}
      opacity={opacity}
      strokeLinejoin={rx ? "round" : undefined}
      strokeWidth={rx}
      stroke={rx ? fill : undefined}
    />
  );
}

/**
 * A low-poly tree: a trunk with two or three canopy tiers.
 *
 * Tiers rather than a sphere because a stack of pyramids keeps the flat-shaded
 * language of everything else — a smoothly shaded ball would be the one object
 * in the world lit by a different renderer.
 */
export function Tree({
  gx,
  gy,
  gz = 0,
  scale = 1,
  tiers = 3,
}: {
  gx: number;
  gy: number;
  gz?: number;
  scale?: number;
  tiers?: number;
}) {
  const trunkH = 0.34 * scale;
  const tierH = 0.52 * scale;
  const base = 0.86 * scale;

  return (
    <g>
      <Box
        gx={gx + base * 0.34}
        gy={gy + base * 0.34}
        gz={gz}
        w={base * 0.32}
        d={base * 0.32}
        h={trunkH}
        material="wood"
      />
      {Array.from({ length: tiers }, (_, i) => {
        const shrink = 1 - i * 0.22;
        const size = base * shrink;
        const offset = (base - size) / 2;
        return (
          <Pyramid
            key={i}
            gx={gx + offset}
            gy={gy + offset}
            gz={gz + trunkH + i * tierH * 0.62}
            w={size}
            d={size}
            h={tierH * 1.5}
            material="leaf"
          />
        );
      })}
    </g>
  );
}

/**
 * A vertical post with an optional coloured topper — flagpoles, lamps, signs.
 * Thin boxes read poorly at this scale, so the post is drawn as a single lit
 * quad with one shaded edge rather than a full solid.
 */
export function Post({
  gx,
  gy,
  gz = 0,
  h,
  material = "wood",
}: {
  gx: number;
  gy: number;
  gz?: number;
  h: number;
  material?: MaterialName;
}) {
  return (
    <Box
      gx={gx}
      gy={gy}
      gz={gz}
      w={0.14}
      d={0.14}
      h={h}
      material={material}
    />
  );
}
