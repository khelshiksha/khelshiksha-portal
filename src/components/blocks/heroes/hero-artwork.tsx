"use client";

import { useEffect, useRef } from "react";
import { FLIGHT_MS, subscribeToBeat } from "@/lib/play-beat";

/**
 * The hero scene: a child kicks a ball, the ball arcs up toward the headline,
 * and the word at the end of the headline changes when it lands.
 *
 * The point is the causality. "Learning through play" is the whole thesis, so
 * the headline changing BECAUSE something was played is the argument made
 * visually rather than a decoration sitting next to it. Timing comes from
 * lib/play-beat, shared with the word, because two independent timers drift
 * apart within seconds and the idea collapses into two unrelated animations.
 *
 * Written against rAF and CSS transforms, no animation library — the previous
 * parallax version made the same call, and Framer Motion cost ~50KB gzipped
 * on the site's most important page.
 *
 * Entirely decorative, so the whole thing is aria-hidden. Nothing here carries
 * information that is not already in the headline.
 *
 * Reduced motion: the ball never flies. It rests at the child's foot and the
 * scene is a still illustration. The word still changes, because that is
 * content — see the note in lib/play-beat.
 */

/* Flight path, in viewBox units. Starts at the foot, ends at the upper left
   where the headline sits. A quadratic curve rather than a parabola because
   the control point lets the arc be tuned by eye. */
const START = { x: 176, y: 322 };
const CONTROL = { x: 104, y: 74 };
const END = { x: 2, y: 148 };

function pointAt(t: number) {
  const inv = 1 - t;
  return {
    x: inv * inv * START.x + 2 * inv * t * CONTROL.x + t * t * END.x,
    y: inv * inv * START.y + 2 * inv * t * CONTROL.y + t * t * END.y,
  };
}

export function HeroArtwork() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const legRef = useRef<SVGGElement>(null);
  const burstRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ball = ballRef.current;
    const leg = legRef.current;
    const burst = burstRef.current;
    if (!ball || !leg || !burst) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let startedAt = 0;

    const rest = () => {
      ball.style.transform = `translate(${START.x}px, ${START.y}px)`;
      ball.style.opacity = "1";
    };
    rest();

    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / FLIGHT_MS, 1);
      const { x, y } = pointAt(t);
      /* Spin scales with how far it has travelled, so it slows as it lands. */
      ball.style.transform = `translate(${x}px, ${y}px) rotate(${t * 540}deg)`;
      /* Fades out over the last fifth — it is heading off toward the word,
         not stopping at the panel edge. */
      ball.style.opacity = t > 0.8 ? String((1 - t) / 0.2) : "1";

      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const unsubscribe = subscribeToBeat((event) => {
      if (reduced) return;

      if (event === "launch") {
        cancelAnimationFrame(frame);
        leg.classList.add("is-kicking");
        startedAt = performance.now();
        frame = requestAnimationFrame(tick);
        window.setTimeout(() => leg.classList.remove("is-kicking"), 320);
      }

      if (event === "impact") {
        /* Retrigger the burst by tearing the animation off and back on. */
        burst.classList.remove("is-bursting");
        void burst.getBoundingClientRect();
        burst.classList.add("is-bursting");
        window.setTimeout(rest, 260);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[460px] lg:max-w-none"
    >
      <svg viewBox="0 0 400 400" className="size-full overflow-visible">
        {/* Ground — soft brand shapes, the brochure's background language */}
        <circle cx="150" cy="140" r="112" fill="var(--tint-blush)" />
        <circle cx="268" cy="248" r="122" fill="var(--tint-sky)" />
        <circle cx="146" cy="286" r="84" fill="var(--tint-peach)" />

        {/* Where the ball is headed. A faint dotted arc so the trajectory
            reads even in the still, reduced-motion state. */}
        <path
          d={`M ${START.x} ${START.y} Q ${CONTROL.x} ${CONTROL.y} ${END.x} ${END.y}`}
          fill="none"
          stroke="var(--rule-strong)"
          strokeWidth="2"
          strokeDasharray="2 12"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Contact point with the headline */}
        <g ref={burstRef} className="hero-burst" transform={`translate(${END.x} ${END.y})`}>
          <circle r="7" fill="var(--accent)" />
          <circle cx="16" cy="-14" r="4" fill="var(--brand)" />
          <circle cx="20" cy="10" r="3.5" fill="var(--magenta)" />
          <circle cx="4" cy="22" r="3" fill="var(--success)" />
        </g>

        {/* Ground. Without a shadow the figure floats and the kick has
            nothing to push against. */}
        <ellipse cx="268" cy="352" rx="86" ry="13" fill="var(--ink)" opacity="0.07" />

        {/* The child, mid-kick. Chunky rounded forms echoing the logo.
            The REST pose is already a kick — planted leg under the hip, body
            leaning in, arms counterbalancing. A neutral standing pose read as
            a doll placed next to a ball; the action has to be legible in a
            still frame, because that is what reduced-motion visitors get. */}
        <g transform="translate(196 96) scale(1.62)">
          {/* Planted leg */}
          <g transform="rotate(6 34 92)">
            <rect x="30" y="86" width="19" height="60" rx="9.5" fill="var(--fig-skin-dark)" />
            <rect x="26" y="138" width="34" height="14" rx="7" fill="var(--ink)" />
          </g>

          {/* Kicking leg — already swung forward, swings further on the beat */}
          <g ref={legRef} className="hero-leg" style={{ transformOrigin: "34px 92px" }}>
            <g transform="rotate(-30 34 92)">
              <rect x="10" y="86" width="19" height="58" rx="9.5" fill="var(--fig-skin)" />
              <rect x="0" y="136" width="34" height="14" rx="7" fill="var(--ink)" />
            </g>
          </g>

          {/* Torso, leaning into the kick */}
          <g transform="rotate(-9 30 60)">
            <rect x="8" y="72" width="46" height="30" rx="12" fill="var(--fig-shorts)" />
            <rect x="6" y="24" width="50" height="56" rx="18" fill="var(--fig-shirt)" />

            {/* Arms counterbalancing — one forward, one back */}
            <rect
              x="-16"
              y="28"
              width="17"
              height="46"
              rx="8.5"
              fill="var(--fig-skin)"
              transform="rotate(52 -7 51)"
            />
            <rect
              x="54"
              y="28"
              width="17"
              height="46"
              rx="8.5"
              fill="var(--fig-skin)"
              transform="rotate(-44 62 51)"
            />

            {/* Head, hair, and the same smile the logo's die wears */}
            <circle cx="31" cy="4" r="25" fill="var(--fig-skin)" />
            <path d="M6 2a25 25 0 0 1 50 0a30 30 0 0 0-50 0z" fill="var(--fig-hair)" />
            <circle cx="21" cy="4" r="2.6" fill="var(--fig-hair)" />
            <circle cx="39" cy="4" r="2.6" fill="var(--fig-hair)" />
            <path
              d="M23 13q8 7 16 0"
              fill="none"
              stroke="var(--fig-hair)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* The ball. Positioned by transform so the rAF loop only ever writes
            one property. */}
        <g ref={ballRef} className="hero-ball">
          <circle r="22" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
          <path d="M0-11l10.5 7.6-4 12.4h-13l-4-12.4z" fill="var(--ink)" />
          <path
            d="M0-22v11M-21-4l10.5 0M21-4l-10.5 0M-13 20l4-12.4M13 20l-4-12.4"
            stroke="var(--ink)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
