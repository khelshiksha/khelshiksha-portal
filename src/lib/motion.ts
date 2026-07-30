/**
 * Pure motion helpers. Deliberately NOT in reveal.tsx — that file is
 * `"use client"`, so anything exported from it becomes a client reference and
 * cannot be called during server render.
 */

/**
 * Stagger delay in ms, capped so a twelve-card grid does not animate for
 * 720ms. The last card would otherwise arrive after the user reached it.
 */
export function staggerDelay(index: number, step = 60, cap = 240): number {
  return Math.min(index * step, cap);
}
