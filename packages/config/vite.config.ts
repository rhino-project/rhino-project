import { tanstackViteConfig } from '@tanstack/config/vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';

const config = defineConfig({
  plugins: [
    copy({
      targets: [
        { src: 'src/rhino-env.d.ts', dest: 'dist/esm' },
        {
          src: 'src/rhino-env.d.ts',
          dest: 'dist/cjs',
          rename: 'rhino-env.d.cts'
        }
      ],
      hook: 'writeBundle'
    }),
    react()
  ],
  test: {
    watch: false
  }
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: ['./src/index.ts', './src/env.ts', './src/assets.ts'],
    srcDir: './src',
    externalDeps: ['rhino.config', 'virtual:@rhino-project/config/assets'],
    cjs: false
  })
);
