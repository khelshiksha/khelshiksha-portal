"use client";

import { useEffect, useRef } from "react";

/**
 * Cycles the italic word at the end of the hero headline.
 *
 * Three properties worth preserving if this is ever changed:
 *
 *  1. Every word is server-rendered inside the <h1>. The headline is the LCP
 *     element and the page's most important text — it must not wait for
 *     hydration, and it must be in the HTML for a crawler that does not run
 *     scripts.
 *
 *  2. The active word moves by toggling a class through a ref, not by React
 *     state. Re-rendering the LCP heading five times a minute to change one
 *     word is work with no user-visible benefit, and syncing React to the DOM
 *     is what an effect is for. Same reasoning as ui/reveal.tsx.
 *
 *  3. The interval is paused when the tab is hidden and when the pointer or
 *     keyboard focus is on the headline. WCAG 2.2.2 wants auto-updating
 *     content to be pausable; hovering the thing you are trying to read is
 *     the natural gesture, and it also stops the word changing out from under
 *     someone mid-sentence.
 */
const INTERVAL_MS = 2600;

export function RotatingWord({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (root === null) return;

    const items = Array.from(root.children) as HTMLElement[];
    if (items.length < 2) return;

    let index = 0;
    let timer: ReturnType<typeof setInterval> | null = null;
    let paused = false;

    const advance = () => {
      items[index].classList.remove("is-active");
      index = (index + 1) % items.length;
      items[index].classList.add("is-active");
    };

    const start = () => {
      if (timer === null && !paused && !document.hidden) {
        timer = setInterval(advance, INTERVAL_MS);
      }
    };
    const stop = () => {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    const pause = () => {
      paused = true;
      stop();
    };
    const resume = () => {
      paused = false;
      start();
    };
    /* A background tab still fires intervals; there is no reason to animate
       for nobody. */
    const onVisibility = () => (document.hidden ? stop() : start());

    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <span ref={ref} className={`word-rotator ${className ?? ""}`}>
      {words.map((word, i) => (
        <em
          key={word}
          className={i === 0 ? "accent-phrase is-active" : "accent-phrase"}
        >
          {word}
        </em>
      ))}
    </span>
  );
}
