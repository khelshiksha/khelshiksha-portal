"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { setBeatPaused, subscribeToBeat } from "@/lib/play-beat";
import type { HeroProduct } from "@/services/cms/types";

/**
 * The rotating product showcase in the home hero.
 *
 * ---------------------------------------------------------------------------
 * ONE BEAT, TWO THINGS MOVING. The die tumbles on `launch` and settles on
 * `impact`, and the product changes on that same `impact` - so the roll reads
 * as the CAUSE of the change rather than as a second animation running
 * nearby. That is the whole reason this subscribes to lib/play-beat instead
 * of keeping a timer: the headline's rotating word is on the same event, and
 * two independent intervals drift apart within seconds. It is the same
 * argument the old KhelVerse die made, kept, with the campus swapped for the
 * kits it was always standing in for.
 *
 * ---------------------------------------------------------------------------
 * ALL ELEVEN KITS ROTATE. THREE ARE IN THE DOM AT ONCE.
 *
 * Those are different things and the distinction is the whole design. Every
 * product is shown, in turn, on its own beat. What is bounded is how many
 * <img> elements exist simultaneously: the OUTGOING frame to cross-fade
 * against, the CURRENT one, and the NEXT one so it is decoded before its beat
 * arrives.
 *
 * The alternative - all eleven stacked at opacity 0 - would put 660KB of
 * photography on the critical path, because a transparent element in the
 * viewport is still fetched and still decoded. On the 4G connection this site
 * is built for, that is the hero arriving after the fold instead of with it.
 *
 * SO THE REST ARE WARMED INSTEAD, on an idle callback after first paint. By
 * the time the second beat lands every photograph is in the browser cache and
 * the remaining nine swap instantly - the same result as mounting them all,
 * without any of them competing with the headline for the first paint.
 *
 * The first frame is `priority`; the rest are not. The h1 is still this
 * section's LCP element and a hero image race would only push it later.
 *
 * ---------------------------------------------------------------------------
 * ACCESSIBILITY. The panel is `aria-live="off"` on purpose. A region that
 * announced a new product every 3.2 seconds would talk over everything else
 * on the page - the names and blurbs are decorative repetition of the
 * catalogue, which /products lists in full and in a stable order. Each frame
 * still carries real alt text for the case where someone lands on one.
 *
 * Hovering or focusing the stage pauses the beat, per WCAG 2.2.2 - the same
 * treatment the rotating headline word gets, and the natural gesture for
 * someone trying to read a card that is about to change.
 */

/* Pip layout per face, in fractions of the die's box. Lifted from the
   KhelVerse die so the two read as the same object if they ever share a
   screen. */
const FACES: readonly (readonly [number, number])[][] = [
  [[0.5, 0.5]],
  [
    [0.28, 0.28],
    [0.72, 0.72],
  ],
  [
    [0.28, 0.28],
    [0.5, 0.5],
    [0.72, 0.72],
  ],
  [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  [
    [0.28, 0.28],
    [0.72, 0.28],
    [0.5, 0.5],
    [0.28, 0.72],
    [0.72, 0.72],
  ],
  [
    [0.28, 0.26],
    [0.72, 0.26],
    [0.28, 0.5],
    [0.72, 0.5],
    [0.28, 0.74],
    [0.72, 0.74],
  ],
];

function Die({ face, rolling }: { face: number; rolling: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`kv-stage-die${rolling ? "is-rolling" : ""}`}
      /* The die is the brand's own mark - it is the dot on the i of Shiksha
         in the logo - so it earns a place in the hero rather than being
         decoration bolted on to justify the animation. */
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="20"
          /* Fixed paper, not var(--surface) - the die straddles the panel
             edge and a theme-aware fill would half-sink it. See the note on
             .kv-stage-die in globals.css. */
          fill="#fdfbf6"
          stroke="var(--rule-strong)"
          strokeWidth="3"
        />
        {FACES[face].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x * 100}
            cy={y * 100}
            r="8"
            fill="var(--brand)"
          />
        ))}
      </svg>
    </span>
  );
}

export function ProductStage({ products }: { products: HeroProduct[] }) {
  /* ONE OBJECT, NOT THREE PIECES OF STATE. `previous` only ever means "what
     index was before this one", so deriving it in the same updater keeps them
     impossible to desync. The first version called setPrevious INSIDE
     setIndex's updater, which is a React anti-pattern: updaters must be pure,
     and StrictMode runs them twice in development - so the outgoing frame was
     set from a value that had already moved. */
  const [frame, setFrame] = useState<{
    index: number;
    previous: number | null;
  }>({ index: 0, previous: null });
  const [turns, setTurns] = useState(0);
  /* Mount every frame once the page is idle - see the note above. */
  const [warmed, setWarmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { index, previous } = frame;

  /* WARM EVERY REMAINING PHOTOGRAPH ONCE THE PAGE IS IDLE.
     Not on mount - that would race the headline. requestIdleCallback fires
     after the browser has finished the work that matters, so this costs the
     first paint nothing and still completes long before the second beat.

     Requested through next/image's own endpoint rather than the source path,
     so what lands in the cache is the exact transformed file the <img> will
     ask for. Fetching /images/... directly would warm a URL the component
     never requests and the swap would still hit the network.

     Safari has no requestIdleCallback; the timeout fallback is deliberate
     rather than a polyfill, because being a second late here costs nothing. */
  useEffect(() => {
    const warm = () => setWarmed(true);
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(warm, 1200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToBeat((event) => {
      if (event === "launch") {
        setTurns((t) => t + 1);
        return;
      }
      setFrame((f) => ({
        index: (f.index + 1) % products.length,
        previous: f.index,
      }));
    });
    return unsubscribe;
  }, [products.length]);

  /* WCAG 2.2.2: auto-updating content must be pausable, and hovering the
     thing you are reading is the gesture people already make. Pausing the
     shared beat stops the headline word too, which is correct - they are one
     mechanism, and freezing half of it would look like a bug. */
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    const pause = () => setBeatPaused(true);
    const resume = () => setBeatPaused(false);
    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);
    return () => {
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
    };
  }, []);

  const next = (index + 1) % products.length;
  const current = products[index];

  /* THREE FRAMES UNTIL THE PAGE IS IDLE, THEN ALL ELEVEN.

     The first version warmed the rest by constructing /_next/image URLs by
     hand. That was wrong twice over: the width next/image actually requests
     depends on `sizes` and the device pixel ratio, so a guessed w=1080 warms
     a URL the <img> never asks for - paying the bandwidth twice and helping
     with neither. Mounting the real components after idle lets next/image
     build its own URLs, which are by definition the ones that get used. */
  const mounted = warmed
    ? products.map((_, i) => i)
    : ([previous, index, next].filter(
        (n, i, a) => n !== null && a.indexOf(n) === i,
      ) as number[]);

  return (
    <div ref={rootRef} className="flex w-full flex-col items-center gap-5">
      <div className="kv-stage-panel">
        {mounted.map((n) => (
          <Image
            key={products[n]._id}
            src={products[n].image.src}
            alt={n === index ? products[n].image.alt : ""}
            width={880}
            height={880}
            priority={n === 0}
            className={`kv-stage-frame${n === index ? "is-current" : ""}`}
            sizes="(min-width: 1024px) 440px, 90vw"
          />
        ))}

        <Die face={index % 6} turns={turns} />
      </div>

      {/* The caption is OUTSIDE the panel, so the panel stays a clean white
          field for the photograph and the type sits on the hero's own ground.
          A min-height holds the two lines the longest blurb needs, or the
          block below the stage would jog on every beat. */}
      <div
        aria-live="off"
        className="flex min-h-[4.5rem] flex-col items-center gap-1 text-center"
      >
        <p key={`${current._id}-n`} className="text-h3 text-ink kv-stage-in">
          {current.name}
        </p>
        <p
          key={`${current._id}-b`}
          className="text-body-sm text-ink-muted kv-stage-in measure-tight"
        >
          {current.blurb}
        </p>
      </div>
    </div>
  );
}
