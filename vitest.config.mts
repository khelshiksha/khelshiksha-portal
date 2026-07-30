import { defineConfig } from "vitest/config";

export default defineConfig({
  /* Native tsconfig path resolution — no vite-tsconfig-paths plugin needed. */
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
