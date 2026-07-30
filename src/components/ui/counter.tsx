"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { formatCount } from "@/lib/utils";

/**
 * Animated number.
 *
 * The final value is rendered in the SSR HTML, so "12,000+" is simply there
 * with JavaScript disabled, before hydration, and under reduced motion. The
 * animation is an enhancement over correct content — never a replacement for
 * it. Counting only starts once, on first entry into view.
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
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || !inView || started.current) return;
    started.current = true;

    // Small numbers read as broken when animated — 1 counting to 1 is a flicker.
    if (to <= 5) return;

    let frame = 0;
    setValue(0);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      // ease-out-quint, matching --ease-out-quint in the token set
      const eased = 1 - Math.pow(1 - t, 5);
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, to, durationMs]);

  return (
    <span ref={ref} className="tabular">
      {formatCount(value)}
      {suffix}
    </span>
  );
}
