"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * The hero composition: three layers that drift with the cursor at different
 * depths. Entirely decorative, so the whole thing is aria-hidden.
 *
 * Parallax runs ONLY on a desktop-class pointer and ONLY when reduced motion
 * is off. On touch there is no cursor to parallax against, so the listener is
 * never attached and the springs simply stay at 0 — the artwork renders
 * identically, minus the movement.
 *
 * Placeholder artwork: geometric forms in the brand palette, standing in for
 * real classroom photography (blocker #3).
 */
export function HeroArtwork() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* Hooks are unconditional — depth is applied via useTransform, never by
     conditionally creating springs. */
  const px = useSpring(0, { stiffness: 120, damping: 30 });
  const py = useSpring(0, { stiffness: 120, damping: 30 });

  const backX = useTransform(px, (v) => v * 3);
  const backY = useTransform(py, (v) => v * 3);
  const midX = useTransform(px, (v) => v * 6);
  const midY = useTransform(py, (v) => v * 6);
  const frontX = useTransform(px, (v) => v * 12);
  const frontY = useTransform(py, (v) => v * 12);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      px.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 2);
      py.set(((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 2);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, px, py]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[460px] lg:max-w-none"
    >
      {/* Back — soft organic blobs, the brochure's background language */}
      <motion.div
        style={{ x: backX, y: backY }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 400 400" className="size-full">
          <circle cx="140" cy="130" r="118" fill="var(--tint-blush)" />
          <circle cx="278" cy="252" r="126" fill="var(--tint-sky)" />
          <circle cx="150" cy="290" r="86" fill="var(--tint-peach)" />
        </svg>
      </motion.div>

      {/* Middle — the kit */}
      <motion.div
        style={{ x: midX, y: midY }}
        className="absolute inset-0 flex items-center justify-center"
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
      </motion.div>

      {/* Front — dice and counters, closest and fastest-moving */}
      <motion.div
        style={{ x: frontX, y: frontY }}
        className="absolute inset-0 flex items-center justify-center"
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
      </motion.div>
    </div>
  );
}
