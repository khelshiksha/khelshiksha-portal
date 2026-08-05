"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/utils";

/**
 * Animated number.
 *
 * The final value is rendered in the SSR HTML, so "12,000+" is simply there
 * with JavaScript disabled, before hydration, and under reduced motion. The
 * animation is an enhancement over correct content - never a replacement.
 *
 * Uses a bare IntersectionObserver + rAF rather than an animation library:
 * counting from 0 to N is not worth 50KB of dependency.
 */
export function Counter({
  to,
  suffix = "",
  durationMs = 1400,
}: {
  to: number;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Small numbers read as broken when animated - 1 counting to 1 is a
       flicker, not an animation. */
    if (to <= 5) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / durationMs, 1);
      /* ease-out-quint, matching --ease-out-quint in the token set */
      setValue(Math.round(to * (1 - Math.pow(1 - t, 5))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} className="tabular">
      {formatCount(value)}
      {suffix}
    </span>
  );
}
