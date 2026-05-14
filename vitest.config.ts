import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 30,
        functions: 20,
        branches: 20,
        statements: 29,
      },
      exclude: ["node_modules/", "dist/", "**/*.test.ts", "**/*.d.ts"],
    },
    exclude: ["node_modules/", "dist/"],
  },
});
