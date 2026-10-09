import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    benchmark: {
      include: ["bench/**/*.bench.ts"],
    },
    coverage: {
      exclude: ["src/**/*.test.ts"],
      include: ["src/**/*.ts"],
      provider: "v8",
    },
    include: ["src/**/*.test.ts"],
  },
});
