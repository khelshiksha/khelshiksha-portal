import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with correct conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Brainy Bee" -> "brainy-bee" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** 20 -> "20 min" · 90 -> "1 hr 30 min" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

/** { min: 8, max: 12 } -> "8–12 years" (en dash, not hyphen) */
export function formatAgeRange(min: number, max: number): string {
  return min === max ? `${min} years` : `${min}–${max} years`;
}

export function formatGroupSize(min: number, max: number): string {
  if (min === max) return min === 1 ? "Solo" : `${min} players`;
  return `${min}–${max} players`;
}

/** 12000 -> "12,000" in the Indian numbering convention. */
export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}
