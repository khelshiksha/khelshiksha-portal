import { spawnSync } from "node:child_process";

/**
 * Applies pending migrations during the build, but only when a database is
 * actually configured.
 *
 * Two failure modes this exists to avoid:
 *
 *  - Putting a bare `prisma migrate deploy` in the build script means a
 *    missing DATABASE_URL fails the whole deploy with a Prisma stack trace,
 *    which is a confusing way to learn you forgot an environment variable.
 *
 *  - Leaving migrations out of the build entirely means the first form
 *    submission on a fresh database fails with "relation does not exist",
 *    which is a much worse way to find out.
 *
 * So: skip loudly when unconfigured, apply when configured, and fail the
 * build only if a migration genuinely cannot be applied.
 */
const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  console.warn(
    "\n[migrate] DATABASE_URL is not set — skipping migrations.\n" +
      "[migrate] The site will build and serve, but enquiries cannot be stored.\n" +
      "[migrate] Set DATABASE_URL and DIRECT_DATABASE_URL to enable them.\n",
  );
  process.exit(0);
}

console.log("[migrate] database configured — applying migrations");

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});

/* A real migration failure must stop the deploy: shipping application code
   that expects tables which do not exist is worse than not shipping. */
process.exit(result.status ?? 1);
