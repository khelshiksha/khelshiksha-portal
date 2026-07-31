import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * The one PrismaClient in the codebase.
 *
 * Cached on globalThis in development because Next's HMR re-evaluates modules
 * on every edit, and a fresh client per reload exhausts the connection pool
 * within a few minutes of normal work.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — getPrisma() should not have been called",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
