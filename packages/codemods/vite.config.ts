import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'codemods',
    dir: './src',
    watch: false,
    globals: true,
    coverage: { enabled: true, include: ['src/**/*'] },
    typecheck: { enabled: true }
  }
});
