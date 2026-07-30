"use client";

import { useEffect, useRef } from "react";

/**
 * The hero composition: three layers that drift with the cursor at different
 * depths. Entirely decorative, so the whole thing is aria-hidden.
 *
 * Written against rAF + CSS transforms rather than an animation library. A
 * three-layer parallax is ~40 lines here; pulling in Framer Motion for it cost
 * ~50KB gzipped on the site's most important page.
 *
 * Parallax runs ONLY on a desktop-class pointer and ONLY when reduced motion
 * is off. On touch the listener is never attached, so the artwork renders
 * identically minus the movement — no wasted battery, no wasted bytes.
 *
 * Placeholder artwork: geometric forms in the brand palette, standing in for
 * real classroom photography (blocker #3).
 */
export function HeroArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  /* Three explicit refs rather than a ref-array with a callback: assigning
     into a ref array from a render-time closure reads as a ref access during
     render, and this is clearer anyway. */
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const layers: [HTMLDivElement | null, number][] = [
      [backRef.current, 3],
      [midRef.current, 6],
      [frontRef.current, 12],
    ];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      targetX = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 2;
      targetY = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 2;
    };

    const tick = () => {
      /* Critically damped-ish easing toward the cursor, so the layers glide
         rather than snap. */
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      for (const [node, depth] of layers) {
        if (!node) continue;
        node.style.transform = `translate3d(${currentX * depth}px, ${currentY * depth}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[460px] lg:max-w-none"
    >
      {/* Back — soft organic blobs, the brochure's background language */}
      <div
        ref={backRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <svg viewBox="0 0 400 400" className="size-full">
          <circle cx="140" cy="130" r="118" fill="var(--tint-blush)" />
          <circle cx="278" cy="252" r="126" fill="var(--tint-sky)" />
          <circle cx="150" cy="290" r="86" fill="var(--tint-peach)" />
        </svg>
      </div>

      {/* Middle — the kit */}
      <div
        ref={midRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <svg viewBox="0 0 400 400" className="size-[76%]">
          <rect
            x="92"
            y="126"
            width="216"
            height="156"
            rx="26"
            fill="var(--surface)"
            stroke="var(--rule)"
            strokeWidth="2"
          />
          <rect
            x="120"
            y="158"
            width="70"
            height="92"
            rx="12"
            fill="var(--brand)"
            opacity="0.9"
          />
          <rect x="202" y="158" width="86" height="42" rx="10" fill="var(--accent)" />
          <rect
            x="202"
            y="210"
            width="86"
            height="40"
            rx="10"
            fill="var(--tint-mint)"
          />
        </svg>
      </div>

      {/* Front — dice and counters, closest and fastest-moving */}
      <div
        ref={frontRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        <svg viewBox="0 0 400 400" className="size-full">
          <g transform="rotate(-14 108 292)">
            <rect
              x="76"
              y="260"
              width="64"
              height="64"
              rx="16"
              fill="var(--surface)"
              stroke="var(--rule-strong)"
              strokeWidth="2"
            />
            <circle cx="96" cy="280" r="6" fill="var(--brand)" />
            <circle cx="120" cy="304" r="6" fill="var(--brand)" />
          </g>
          <circle cx="304" cy="118" r="26" fill="var(--magenta)" opacity="0.9" />
          <circle cx="330" cy="300" r="18" fill="var(--success)" opacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
