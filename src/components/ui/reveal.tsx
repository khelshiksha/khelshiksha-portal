"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const DIRECTION_CLASS: Record<Direction, string> = {
  up: "reveal-up",
  down: "reveal-down",
  left: "reveal-left",
  right: "reveal-right",
  none: "",
};

/**
 * THE single scroll-reveal primitive. Everything scroll-triggered on the site
 * goes through it.
 *
 * IntersectionObserver + CSS, under 1KB. Framer Motion cost ~50KB gzipped on
 * every page for this one behaviour; motion now stays out of the bundle
 * entirely.
 *
 * Two properties worth preserving if this is ever changed:
 *   1. The hidden state lives in CSS behind [data-js], so WITHOUT JavaScript
 *      the content simply renders visible. A reveal must never be able to
 *      hide content permanently.
 *   2. The observer toggles a class through a ref rather than setting React
 *      state — syncing React to the DOM is what an effect is for, and it
 *      avoids a re-render per revealed element.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  direction?: Direction;
  /** Milliseconds. Stagger with staggerDelay(index) from @/lib/motion. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-shown");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add("is-shown");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", DIRECTION_CLASS[direction], className)}
    >
      {children}
    </Tag>
  );
}
