"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FLIGHT_MS, setBeatPaused, subscribeToBeat } from "@/lib/play-beat";
import { iso, points, VIEW, VIEW_BOX } from "./iso";
import { PLATFORM_H, ZONES, zoneCentre } from "./zones";

/**
 * The living layer of KhelVerse: the die that travels the world, and the zone
 * links.
 *
 * ARCHITECTURE. The static world is a Server Component (world.tsx) passed in
 * as children, so none of its several hundred polygons reach the JavaScript
 * bundle. This file adds two thin layers on top of it:
 *
 *   1. An overlay <svg> with an identical viewBox, holding only the die.
 *   2. Real HTML <a> elements for the five zones.
 *
 * The links are HTML, not SVG anchors, on purpose. They are the only part of
 * the world that has to work for a keyboard, a screen reader, a translation
 * tool and Google, and HTML gives all four for free. The world beneath is
 * aria-hidden decoration; nothing is reachable ONLY by finding it in a
 * picture.
 *
 * ALIGNMENT. The wrapper is locked to the viewBox's aspect ratio, so a point
 * at viewBox (x, y) is always at a fixed fraction of the box. That is what lets
 * an HTML label sit exactly above an SVG rooftop at every screen size without
 * measuring anything at runtime.
 *
 * THE DIE. It hops zone to zone on the shared beat from lib/play-beat, and the
 * headline word changes when it lands — the same causality as before, now at
 * the scale of the world. The zone it lands on lights up, so the eye is led
 * around all five pillars in turn without anyone having to hover.
 *
 * Reduced motion: no hop, no drift, no sway. The die simply appears on the
 * next zone and the zone lights. The word still changes, because the word is
 * content — see lib/play-beat.
 */

const CUBE = 0.92;
const DIE_LIFT = PLATFORM_H + 0.06;

/* Pip layout in fractions of the top face. */
const P0 = 0.27;
const P1 = 0.73;
const PC = 0.5;
const FACES: readonly (readonly [number, number])[][] = [
  [[PC, PC]],
  [
    [P0, P0],
    [P1, P1],
  ],
  [
    [P0, P0],
    [PC, PC],
    [P1, P1],
  ],
  [
    [P0, P0],
    [P1, P0],
    [P0, P1],
    [P1, P1],
  ],
  [
    [P0, P0],
    [P1, P0],
    [PC, PC],
    [P0, P1],
    [P1, P1],
  ],
];

/** The die drawn at grid origin; the loop moves it by translating in screen space. */
function DieCube() {
  const s = CUBE;
  /* Corner naming as in solids.tsx: the two visible side faces are the two
     touching the front corner. */
  const back = iso(0, 0, s);
  const right = iso(s, 0, s);
  const front = iso(s, s, s);
  const left = iso(0, s, s);
  const rightB = iso(s, 0, 0);
  const frontB = iso(s, s, 0);
  const leftB = iso(0, s, 0);

  return (
    <g>
      {/* Outlined, unlike every other solid in the world. The die is the one
          object that has to be findable at a glance from across the page while
          sitting on grass, on stone or against the sky, and a dark edge is the
          only treatment that survives all three. */}
      <g stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points={points([left, front, frontB, leftB])} fill="var(--w-roof-left)" />
        <polygon points={points([right, front, frontB, rightB])} fill="var(--w-roof-right)" />
        <polygon points={points([back, right, front, left])} fill="var(--accent)" />
      </g>

      {FACES.map((face, i) => (
        <g key={i} className="kv-die-face" data-face={i}>
          {face.map(([u, v]) => {
            const p = iso(u * s, v * s, s);
            /* A circle lying in the ground plane projects to a 2:1 ellipse
               under this camera, so the pips sit ON the face instead of
               hovering above it. */
            return <ellipse key={`${u},${v}`} cx={p.x} cy={p.y} rx="7" ry="3.5" fill="var(--ink)" />;
          })}
        </g>
      ))}
    </g>
  );
}

export function KhelVerse({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dieRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const die = dieRef.current;
    if (root === null || die === null) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zoneEls = new Map<string, Element>();
    for (const el of root.querySelectorAll("[data-zone]")) {
      const slug = el.getAttribute("data-zone");
      if (slug !== null && el.tagName.toLowerCase() === "g") zoneEls.set(slug, el);
    }

    const origin = iso(0, 0, 0);
    const at = (gx: number, gy: number, gz: number) => {
      const p = iso(gx, gy, gz);
      return { x: p.x - origin.x, y: p.y - origin.y };
    };

    let index = 0;
    let frame = 0;
    let startedAt = 0;
    let fromZone = zoneCentre(ZONES[0]);
    let toZone = fromZone;
    let faceSwapped = false;

    const showFace = (n: number) => {
      for (const g of die.querySelectorAll(".kv-die-face")) {
        g.classList.toggle("is-shown", Number(g.getAttribute("data-face")) === n);
      }
    };

    const place = (gx: number, gy: number, gz: number) => {
      const p = at(gx, gy, gz);
      die.style.transform = `translate(${p.x}px, ${p.y}px)`;
    };

    /* Light the platform AND name it. The label follows the die so the world
       introduces its own pillars one at a time — see .kv-pin in globals.css
       for why five permanent labels were the least simple thing here. */
    const lightOnly = (slug: string) => {
      for (const [key, el] of zoneEls) el.classList.toggle("is-active", key === slug);
      for (const pin of root.querySelectorAll("[data-zone-link]")) {
        pin.classList.toggle("is-current", pin.getAttribute("data-zone-link") === slug);
      }
    };

    /* The die sits half a cube's width off the platform centre so it reads as
       standing beside the landmark rather than inside it. */
    const settle = (c: { gx: number; gy: number }) =>
      place(c.gx - CUBE / 2 + 0.55, c.gy - CUBE / 2 + 0.55, DIE_LIFT);

    settle(fromZone);
    showFace(0);
    lightOnly(ZONES[0].slug);

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / FLIGHT_MS, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const gx = fromZone.gx + (toZone.gx - fromZone.gx) * e;
      const gy = fromZone.gy + (toZone.gy - fromZone.gy) * e;
      /* Arc height scales with the distance travelled, so the long hop back
         across the island reads as a bigger leap than a hop next door. */
      const span = Math.hypot(toZone.gx - fromZone.gx, toZone.gy - fromZone.gy);
      const lift = DIE_LIFT + Math.min(span * 0.34, 1.5) * 4 * t * (1 - t);

      place(gx - CUBE / 2 + 0.55, gy - CUBE / 2 + 0.55, lift);

      if (!faceSwapped && t >= 0.5) {
        faceSwapped = true;
        showFace(index);
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const unsubscribe = subscribeToBeat((event) => {
      if (event === "launch") {
        fromZone = zoneCentre(ZONES[index]);
        index = (index + 1) % ZONES.length;
        toZone = zoneCentre(ZONES[index]);

        if (reduced) {
          showFace(index);
          settle(toZone);
          return;
        }

        faceSwapped = false;
        cancelAnimationFrame(frame);
        startedAt = performance.now();
        frame = requestAnimationFrame(tick);
      }

      if (event === "impact") {
        showFace(index);
        lightOnly(ZONES[index].slug);
        if (!reduced) settle(toZone);
      }
    });

    /* WCAG 2.2.2: auto-updating content must be pausable. Reaching for a zone
       is the natural gesture, and it also stops the die hopping out from under
       the pointer mid-click. */
    const pause = () => setBeatPaused(true);
    const resume = () => setBeatPaused(false);
    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    /* pointerdown, not just pointerenter, and this one is load-bearing.
       On a phone the label is a single card that cycles through the five
       pillars, so it is a MOVING TARGET: a thumb aimed at "Climate Education"
       could land after the beat had advanced and navigate to Life Skills
       instead — the site doing something the visitor never asked for, which
       is the worst class of interface bug. Touch does not reliably fire
       pointerenter before the tap, so the freeze has to hang off the press
       itself. Verified by tapping and asserting the URL matches the card that
       was showing. */
    root.addEventListener("pointerdown", pause);
    root.addEventListener("touchstart", pause, { passive: true });

    /* The ambient loops are CSS animations, which keep running in a background
       tab — unlike rAF, which the browser throttles for us. Fifty animated
       elements burning battery for a tab nobody is looking at is exactly the
       kind of thing that gets a site closed, so they are parked explicitly. */
    const onVisibility = () => {
      root.dataset.paused = document.hidden ? "1" : "0";
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointerdown", pause);
      root.removeEventListener("touchstart", pause);
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
    };
  }, []);

  return (
    <div ref={rootRef} className="kv-root relative w-full">
      {/* .kv-frame owns the aspect ratio and the responsive sizing — see the
          note in globals.css. Pins are positioned as a percentage of THIS box,
          so its ratio must match the camera crop exactly or every label drifts
          off its rooftop. It already happened once. */}
      <div
        className="kv-frame"
        style={{ "--kv-ratio": `${VIEW.w} / ${VIEW.h}` } as React.CSSProperties}
      >
        {/* Both SVGs live on the stage so they crop together; the pins stay on
            the frame, because on phones they are a centred caption rather than
            a position on the campus. */}
        <div className="kv-stage">
          {children}

          <svg
          viewBox={VIEW_BOX}
          className="pointer-events-none absolute inset-0 size-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
            <g ref={dieRef} className="kv-die">
              <DieCube />
            </g>
          </svg>
        </div>

        {/* The zones as real links. Positioned as a percentage of the viewBox,
            which the locked aspect ratio above makes exact at any size. */}
        {ZONES.map((zone) => {
          const c = zoneCentre(zone);
          /* 2.8 clears the tallest roof without leaving the frame. At 2.1 the
             labels sat ON the schoolhouse and the pavilion; at 3.4 the
             back-most zone's label rose out of the world entirely and landed
             behind the call-to-action buttons. */
          const anchor = iso(c.gx, c.gy, 2.8);
          return (
            <Link
              key={zone.slug}
              href={`/approach/pillars/${zone.slug}`}
              data-zone-link={zone.slug}
              className="kv-pin"
              style={{
                left: `${((anchor.x - VIEW.x) / VIEW.w) * 100}%`,
                /* Clamped so the card cannot climb out of the frame. The card
                   is anchored by its BOTTOM edge, so a zone near the back of
                   the island put it above the campus entirely — on a laptop it
                   landed on top of the trust signals. The tail keeps it
                   pointing at the right platform either way. */
                top: `${Math.max(26, ((anchor.y - VIEW.y) / VIEW.h) * 100)}%`,
              }}
              onPointerEnter={() => highlight(rootRef.current, zone.slug)}
              onFocus={() => highlight(rootRef.current, zone.slug)}
            >
              <span className="kv-pin-label">{zone.label}</span>
              <span className="kv-pin-blurb">{zone.blurb}</span>
              {/* Says out loud that the campus is navigable. Without it a
                  label reads as a caption on a picture, and nobody presses a
                  caption. */}
              <span className="kv-pin-go" aria-hidden="true">
                Explore &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Light the zone a visitor is pointing at, overriding the die's own cycle. */
function highlight(root: HTMLElement | null, slug: string) {
  if (root === null) return;
  for (const el of root.querySelectorAll("g[data-zone]")) {
    el.classList.toggle("is-active", el.getAttribute("data-zone") === slug);
  }
}
