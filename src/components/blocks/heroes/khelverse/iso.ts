/**
 * Isometric projection for the KhelVerse hero world.
 *
 * The world is authored in grid units - (gx, gy) across the ground plane and
 * gz upward - and projected to screen here. Authoring in grid units is the
 * whole point: placing a tree "two tiles left of the schoolhouse" is a thing a
 * person can reason about, while placing it at screen (417, 288) is not, and
 * every adjustment to the camera would otherwise mean re-deriving every
 * coordinate in the scene.
 *
 * A true 2:1 dimetric projection (the "isometric" of games, not of drafting)
 * because its 26.57° edges land on exact half-pixel slopes, so long straight
 * edges stay crisp instead of shimmering.
 *
 * SORTING. In an isometric scene, what is in front is determined by depth, not
 * by source order, and SVG has no z-index - it paints in document order. So
 * everything drawn into the world carries a depth key and is sorted before
 * render. Getting this wrong is the classic isometric bug: a tree drawn behind
 * a building overlaps it anyway and the whole illusion of solidity dies.
 */

/** Half-width and half-height of one ground tile, in user units. */
export const TILE_W = 78;
export const TILE_H = 32;

/** Screen origin of grid (0, 0). Tuned so the island sits in the viewBox. */
export const ORIGIN_X = 640;
export const ORIGIN_Y = 160;

/**
 * The camera crop.
 *
 * Not "0 0 1280 580": the island only occupies part of that box, and the slack
 * showed up as a dead band of empty sky between the buttons and the world.
 * This is cropped to the island's actual extents. It tightened again when the
 * clouds were removed: the band they occupied was then just empty space, and
 * empty space at the top of the frame is what made the hero too tall.
 *
 * Every consumer - both SVGs and the HTML pins layered over them - derives its
 * geometry from this one constant, so the crop can be retuned in a single
 * place without the labels drifting off the rooftops.
 */
export const VIEW = { x: 96, y: 104, w: 1096, h: 444 } as const;
export const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`;

export type Point = { x: number; y: number };

/** Project a grid point to screen space. gz is height above the ground plane. */
export function iso(gx: number, gy: number, gz = 0): Point {
  return {
    x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
    y: ORIGIN_Y + (gx + gy) * (TILE_H / 2) - gz * TILE_H,
  };
}

/**
 * Painter's-algorithm depth for a solid whose footprint starts at (gx, gy).
 *
 * Larger sorts later, so it paints on top. Height is included with a small
 * weight: two solids on the same tile must still stack correctly, but height
 * must never outrank ground position or a tall tree at the back would paint
 * over a short wall at the front.
 */
export function depthOf(gx: number, gy: number, gz = 0): number {
  return (gx + gy) * 100 + gz;
}

export function points(list: Point[]): string {
  return list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

/**
 * Deterministic pseudo-random in [0, 1).
 *
 * Scattering trees and animation offsets must not use Math.random: the server
 * and the client would disagree and React would throw a hydration mismatch on
 * the most important page of the site. A seeded hash gives the same scatter in
 * both places while still looking unplanned.
 */
export function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Deterministic value in [min, max), rounded to 2dp for stable markup. */
export function randRange(seed: number, min: number, max: number): number {
  return Math.round((min + rand(seed) * (max - min)) * 100) / 100;
}
