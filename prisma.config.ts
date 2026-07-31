import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 keeps connection URLs here rather than in schema.prisma. This file
 * is used by the CLI (migrate, studio) only — the runtime client is built
 * with a driver adapter in src/services/db/client.ts.
 *
 * Migrations deliberately prefer DIRECT_DATABASE_URL: running them through a
 * connection pooler makes advisory locks fail intermittently, which leaves a
 * half-applied migration behind. Falls back to DATABASE_URL for local
 * Postgres, where there is no pooler to bypass.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL,
  },
});
