import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const config = defineConfig({
  plugins: [
    externalizeDeps({
      include: ['rhino.config', 'virtual:@rhino-project/config/env']
    }),
    react()
  ]
});

export default mergeConfig(
  tanstackBuildConfig({
    entry: ['./src/index.ts', './src/env.ts'],
    srcDir: './src'
  }),
  config
);
