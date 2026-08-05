import "server-only";
import { createHash } from "node:crypto";

/**
 * IP addresses are never stored raw - only SHA-256(ip + salt), which is
 * enough for rate limiting and deduplication without holding PII.
 */
export function hashIp(forwardedFor: string | null): string | null {
  if (!forwardedFor) return null;
  const ip = forwardedFor.split(",")[0]?.trim();
  if (!ip) return null;
  const salt = process.env.APP_SALT ?? "khelshiksha-dev-salt";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 32);
}

/**
 * In-memory fixed-window limiter.
 *
 * Adequate for a single instance; it does NOT hold across serverless
 * instances, so production should front this with Upstash Redis at the edge
 * (per the performance strategy). Kept deliberately simple so the swap is a
 * one-function change.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  key: string,
  { limit, windowSec }: { limit: number; windowSec: number },
): Promise<boolean> {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }

  if (existing.count >= limit) return false;

  existing.count += 1;
  return true;
}
