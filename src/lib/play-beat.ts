/**
 * One clock for the hero.
 *
 * The headline word changes because a ball hits it. That only reads as cause
 * and effect if the kick and the word are the same event — a ball on its own
 * timer landing near a word on its own timer drifts apart within seconds and
 * the whole idea collapses into two unrelated animations.
 *
 * So neither component owns the timing. Both subscribe here:
 *
 *   launch  the ball leaves the foot
 *   impact  the ball arrives — the word changes, the burst fires
 *
 * The clock is shared, lazily started on the first subscriber and stopped on
 * the last, so a page without the hero pays nothing. It also stops while the
 * tab is hidden; there is no reason to run a loop for nobody, and coming back
 * to a background tab mid-flight would show the ball teleporting.
 *
 * Reduced motion still emits `impact`. The word is content, not decoration —
 * suppressing it would freeze the headline on whichever word happened to be
 * showing. Only the flight is suppressed, by the artwork ignoring `launch`.
 */
export type BeatEvent = "launch" | "impact";

/** Ball flight, and the gap from one landing to the next kick. */
export const FLIGHT_MS = 900;
export const CYCLE_MS = 3200;

type Listener = (event: BeatEvent) => void;

const listeners = new Set<Listener>();
let launchTimer: ReturnType<typeof setTimeout> | null = null;
let impactTimer: ReturnType<typeof setTimeout> | null = null;
let cycleTimer: ReturnType<typeof setInterval> | null = null;

function emit(event: BeatEvent) {
  for (const listener of listeners) listener(event);
}

function runCycle() {
  emit("launch");
  impactTimer = setTimeout(() => emit("impact"), FLIGHT_MS);
}

function start() {
  if (cycleTimer !== null || typeof document === "undefined") return;
  /* A beat before the first kick, so the hero is readable on arrival rather
     than moving the instant it appears. */
  launchTimer = setTimeout(() => {
    runCycle();
    cycleTimer = setInterval(runCycle, CYCLE_MS);
  }, 1200);
}

function stop() {
  if (launchTimer !== null) clearTimeout(launchTimer);
  if (impactTimer !== null) clearTimeout(impactTimer);
  if (cycleTimer !== null) clearInterval(cycleTimer);
  launchTimer = impactTimer = null;
  cycleTimer = null;
}

function onVisibilityChange() {
  if (document.hidden) stop();
  else if (listeners.size > 0) start();
}

export function subscribeToBeat(listener: Listener): () => void {
  const first = listeners.size === 0;
  listeners.add(listener);

  if (first) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!document.hidden) start();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    }
  };
}

/** Pause and resume without unsubscribing — used when the hero is hovered. */
export function setBeatPaused(paused: boolean) {
  if (paused) stop();
  else if (listeners.size > 0 && !document.hidden) start();
}
