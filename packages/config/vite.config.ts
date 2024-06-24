import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';

const config = defineConfig({
  plugins: [
    // @ts-expect-error Rollup plugin used as a Vite plugin
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
  // @ts-expect-error Rollup plugin used as a Vite plugin
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
