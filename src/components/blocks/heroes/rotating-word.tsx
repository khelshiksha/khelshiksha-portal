"use client";

import { useEffect, useRef } from "react";
import { setBeatPaused, subscribeToBeat } from "@/lib/play-beat";

/**
 * Exactly five words, because there are exactly five zones in the world and
 * the die lands on one per word. A fixed-length tuple makes adding a sixth
 * word without adding a sixth zone a compile error rather than a hero that
 * silently falls out of sync.
 *
 * It used to live in hero-artwork.tsx, which was the only reason that file
 * still existed after KhelVerse replaced it.
 */
export type HeroWords = [string, string, string, string, string];

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
 *  3. The change is driven by lib/play-beat, NOT by a timer of its own. The
 *     hero artwork hops a die along a board on the same beat, and the word
 *     changes where it lands — that only reads as cause and effect if both are
 *     the same event. Two independent timers drift apart within seconds.
 *
 *     The word list and the board's tiles are the same sequence: tile n
 *     carries n pips because it is the nth word. Adding a word here means
 *     adding a tile in hero-artwork.tsx.
 *
 *  4. The beat is paused when the pointer or keyboard focus is on the
 *     headline. WCAG 2.2.2 wants auto-updating content to be pausable;
 *     hovering the thing you are trying to read is the natural gesture, and it
 *     also stops the word changing out from under someone mid-sentence.
 *     (Hidden tabs are handled inside play-beat.)
 */

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

    const unsubscribe = subscribeToBeat((event) => {
      if (event !== "impact") return;
      items[index].classList.remove("is-active");
      index = (index + 1) % items.length;
      items[index].classList.add("is-active");
    });

    const pause = () => setBeatPaused(true);
    const resume = () => setBeatPaused(false);

    root.addEventListener("pointerenter", pause);
    root.addEventListener("pointerleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    return () => {
      unsubscribe();
      root.removeEventListener("pointerenter", pause);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("focusin", pause);
      root.removeEventListener("focusout", resume);
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
