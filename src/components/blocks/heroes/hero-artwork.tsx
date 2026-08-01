"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FLIGHT_MS, subscribeToBeat } from "@/lib/play-beat";

/**
 * The hero scene: a die climbs a game board and the headline word changes on
 * every square it lands on. The board colours in as the round progresses.
 *
 * WHY A BOARD AND NOT A CHARACTER. The first version drew a child kicking a
 * football. Hand-authored anatomy in SVG reads as clip-art almost every time,
 * and it did — a doll standing next to a ball. This draws what the company
 * actually sells: a board game. A die is the logo's own mark, so the scene is
 * on-brand without illustrating anything, and every shape here is a rounded
 * rectangle or a circle — the geometry SVG renders crisply at any size.
 *
 * WHY ONE BOARD AND NOT LOOSE PIECES. A previous pass scattered five tiles
 * along a curve with nothing behind them. It read as shapes floating in space:
 * no dominant form, no focal point, and the lit tiles looked like more dice.
 * A single bounded board gives the composition mass, the yellow die is
 * unmistakably the only die on it, and the empty corners become deliberate
 * negative space rather than emptiness.
 *
 * WHY FIVE SQUARES. There are five words in the headline, and each square
 * takes the tint of the pillar it lines up with in the section below — so the
 * hero and the rest of the page share one palette rather than each inventing
 * their own. Square n carries n pips because it is the nth word: the numbering
 * encodes the sequence rather than decorating it.
 *
 * The causality is the point. "Learning through play" is the thesis, so the
 * headline changing BECAUSE something was played is the argument made visually
 * rather than a decoration next to it. Timing comes from lib/play-beat, shared
 * with the word — two independent timers drift apart within seconds and the
 * idea collapses into two unrelated animations.
 *
 * rAF and CSS transforms, no animation library: Framer Motion costs ~50KB
 * gzipped on the site's most important page.
 *
 * Decorative, so the whole thing is aria-hidden — nothing here carries
 * information that is not already in the headline.
 *
 * Reduced motion: the die never tumbles, it simply appears on the next square.
 * Squares still fill, because they track the word, and the word is content —
 * see the note in lib/play-beat.
 */

type Square = { x: number; y: number; tint: string };

/* A 3×3 board. The route is a staircase climbing from the bottom-right corner
   toward the top-left — toward the headline — in right angles rather than a
   smooth curve, because a board route is built from steps and the climb is
   the point.

   The four cells the route does not touch are still drawn, faintly. An
   earlier pass drew only the five route squares and left the corners bare:
   the board had a diagonal band of content and two empty quarters, which read
   as an unfinished graphic rather than a game. Nine cells make it a board the
   route happens to cross. */
const GRID = [108, 204, 300];

const SQUARES: readonly Square[] = [
  { x: GRID[2], y: GRID[2], tint: "var(--tint-sky)" },
  { x: GRID[1], y: GRID[2], tint: "var(--tint-blush)" },
  { x: GRID[1], y: GRID[1], tint: "var(--tint-mint)" },
  { x: GRID[0], y: GRID[1], tint: "var(--tint-peach)" },
  { x: GRID[0], y: GRID[0], tint: "var(--tint-lavender)" },
];

/** Every cell the route does not use, so the board is a full 3×3. */
const OFF_ROUTE = GRID.flatMap((x) => GRID.map((y) => ({ x, y }))).filter(
  (cell) => !SQUARES.some((sq) => sq.x === cell.x && sq.y === cell.y),
);

/**
 * The headline's words, typed to exactly one per square.
 *
 * The board and the headline are one sequence, so a sixth word with only five
 * squares would light nothing on its turn and look broken. This makes that a
 * build failure at the call site instead — add a word, add a square.
 */
export type HeroWords = [string, string, string, string, string];

const SQUARE = 74;
const DIE = 62;

/* Pip layout for faces 1–5, in units from the face centre. */
const PIP = 14;
const FACES: readonly (readonly [number, number])[][] = [
  [[0, 0]],
  [
    [-PIP, -PIP],
    [PIP, PIP],
  ],
  [
    [-PIP, -PIP],
    [0, 0],
    [PIP, PIP],
  ],
  [
    [-PIP, -PIP],
    [PIP, -PIP],
    [-PIP, PIP],
    [PIP, PIP],
  ],
  [
    [-PIP, -PIP],
    [PIP, -PIP],
    [0, 0],
    [-PIP, PIP],
    [PIP, PIP],
  ],
];

/** Hop height, so the long hop back to the start arcs higher than one step. */
function liftFor(distance: number) {
  return Math.min(distance * 0.38, 96);
}

function Pips({ face, r }: { face: number; r: number }) {
  return (
    <>
      {FACES[face].map(([x, y]) => (
        <circle key={`${x},${y}`} cx={x} cy={y} r={r} />
      ))}
    </>
  );
}

export function HeroArtwork() {
  const dieRef = useRef<SVGGElement>(null);
  const faceRefs = useRef<(SVGGElement | null)[]>([]);
  const squareRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const die = dieRef.current;
    if (die === null) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let index = 0;
    let frame = 0;
    let startedAt = 0;
    let from = SQUARES[0];
    let to = SQUARES[0];
    let spinFrom = 0;
    let spinTo = 0;
    let distance = 0;
    let faceSwapped = false;

    const showFace = (n: number) => {
      faceRefs.current.forEach((g, i) => {
        g?.classList.toggle("is-shown", i === n);
      });
    };

    const place = (x: number, y: number, spin: number, scale = 1) => {
      die.style.transform = `translate(${x}px, ${y}px) rotate(${spin}deg) scale(${scale})`;
    };

    place(SQUARES[0].x, SQUARES[0].y, 0);
    showFace(0);
    squareRefs.current[0]?.classList.add("is-lit");

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / FLIGHT_MS, 1);
      /* Ease the travel along the ground, keep the lift a clean parabola, so
         the hop hangs at the top the way a thrown object does. */
      const e = 1 - Math.pow(1 - t, 3);
      const x = from.x + (to.x - from.x) * e;
      const y =
        from.y + (to.y - from.y) * e - liftFor(distance) * 4 * t * (1 - t);
      /* A little stretch at the peak and squash on landing sells the weight. */
      const scale = 1 + Math.sin(t * Math.PI) * 0.1;

      place(x, y, spinFrom + (spinTo - spinFrom) * e, scale);

      /* Swap the pip face at the midpoint, where the die is most rotated and
         the change is least noticeable. */
      if (!faceSwapped && t >= 0.5) {
        faceSwapped = true;
        showFace(index);
      }

      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const unsubscribe = subscribeToBeat((event) => {
      if (event === "launch") {
        from = SQUARES[index];
        index = (index + 1) % SQUARES.length;
        to = SQUARES[index];

        /* Wrapping back to the first square starts a new round — clear the
           board on the way, so the reset reads as deliberate, not as a
           glitch. */
        if (index === 0) {
          for (const sq of squareRefs.current) sq?.classList.remove("is-lit");
        }

        if (reduced) {
          showFace(index);
          place(to.x, to.y, 0);
          return;
        }

        distance = Math.hypot(to.x - from.x, to.y - from.y);
        spinFrom = spinTo;
        spinTo = spinFrom + 90;
        faceSwapped = false;
        cancelAnimationFrame(frame);
        startedAt = performance.now();
        frame = requestAnimationFrame(tick);
      }

      if (event === "impact") {
        showFace(index);
        /* The die is smaller than the square, so the fill reads as a coloured
           border appearing around it — the landing is visible immediately,
           not only once the die moves on. */
        squareRefs.current[index]?.classList.add("is-lit");

        if (!reduced) place(to.x, to.y, spinTo);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[460px] lg:max-w-none"
    >
      <svg viewBox="0 0 400 400" className="size-full overflow-visible">
        <defs>
          <filter id="hero-lift" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="12"
              floodColor="#2e2614"
              floodOpacity="0.13"
            />
          </filter>
          <filter id="hero-die-lift" x="-60%" y="-60%" width="220%" height="240%">
            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="7"
              floodColor="#2e2614"
              floodOpacity="0.24"
            />
          </filter>
        </defs>

        {/* The board. A few degrees off square so it reads as an object
            someone put on a table, not a UI panel. */}
        <g transform="rotate(-4 204 204)">
          <rect
            x="44"
            y="44"
            width="320"
            height="320"
            rx="36"
            fill="var(--surface)"
            stroke="var(--rule)"
            strokeWidth="2"
            filter="url(#hero-lift)"
          />

          {/* Cells the route skips. Quiet — no stroke, no pips — so they read
              as the rest of the board rather than as steps that never light. */}
          {OFF_ROUTE.map((cell) => (
            <rect
              key={`${cell.x},${cell.y}`}
              x={cell.x - SQUARE / 2}
              y={cell.y - SQUARE / 2}
              width={SQUARE}
              height={SQUARE}
              rx="20"
              fill="var(--paper)"
              opacity="0.75"
            />
          ))}

          {/* The route. Drawn over the cells so the climb is legible at a
              glance — it is the one thing on the board that has a direction. */}
          <path
            d={SQUARES.map(
              (sq, i) => `${i === 0 ? "M" : "L"} ${sq.x} ${sq.y}`,
            ).join(" ")}
            fill="none"
            stroke="var(--rule-strong)"
            strokeWidth="3"
            strokeDasharray="2 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {SQUARES.map((sq, i) => (
            <g
              key={i}
              ref={(el) => {
                squareRefs.current[i] = el;
              }}
              className="hero-square"
              transform={`translate(${sq.x} ${sq.y})`}
              style={{ "--sq-tint": sq.tint } as CSSProperties}
            >
              <rect
                className="hero-square-face"
                x={-SQUARE / 2}
                y={-SQUARE / 2}
                width={SQUARE}
                height={SQUARE}
                rx="20"
                strokeWidth="2"
              />
              <g className="hero-square-pips" fill="var(--brand-deep)">
                <Pips face={i} r={5} />
              </g>
            </g>
          ))}

          {/* The die. Yellow so there is exactly one focal point on the board
              and it is never mistaken for a square. Positioned by transform so
              the rAF loop only ever writes one property. */}
          <g ref={dieRef} className="hero-die" filter="url(#hero-die-lift)">
            <rect
              x={-DIE / 2}
              y={-DIE / 2}
              width={DIE}
              height={DIE}
              rx="16"
              fill="var(--accent)"
              stroke="var(--ink)"
              strokeWidth="3"
            />
            {FACES.map((_, i) => (
              <g
                key={i}
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                className="hero-die-face"
                fill="var(--ink)"
              >
                <Pips face={i} r={6} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
