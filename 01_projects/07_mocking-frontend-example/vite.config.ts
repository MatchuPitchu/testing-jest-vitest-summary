/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // if defined here, not needed to add in script in package.json; vitest --run --reporter=verbose
    reporters: 'verbose',
    coverage: {
      include: ['src'],
      exclude: ['**/*.spec.*', '**/index.ts'],
      reporter: 'text',
    },
  },
});
