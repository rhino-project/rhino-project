import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const config = defineConfig({
  plugins: [react()],
  test: {
    watch: false
  }
});

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: ['./src/index.ts', './src/env.ts', './src/assets.ts'],
    srcDir: './src',
    externalDeps: [
      'rhino.config',
      'virtual:@rhino-project/config/env',
      'virtual:@rhino-project/config/assets'
    ]
  })
);
