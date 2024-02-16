import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const config = defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['rhino.config', 'virtual:@rhino-project/config/env'],
      output: {
        preserveModules: false,
        preserveModulesRoot: 'src'
      }
    }
  }
});

export default mergeConfig(
  tanstackBuildConfig({
    entry: ['./src/index.ts', './src/env.ts'],
    srcDir: './src'
  }),
  config
);
