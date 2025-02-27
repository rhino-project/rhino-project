import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import url from 'node:url';
import { Plugin, transformWithEsbuild } from 'vite';
import { resolve } from 'node:path';

// NOTE: Keep trailing slash to use resulting path in prefix matching.
const srcDir = url.fileURLToPath(new URL('./src/', import.meta.url));

const vitePlugin = (isProd: boolean): Plugin => ({
  name: 'js-in-jsx',
  enforce: 'pre',
  async transform(code, id) {
    // Ignore Rollup virtual modules.
    if (id.startsWith('\0')) {
      return;
    }
    // Strip off any "proxy id" component before testing against path.
    // See: https://github.com/vitejs/vite-plugin-react-swc/blob/a1bfc313612a8143a153ce87f52925059459aeb2/src/index.ts#L89
    // See: https://rollupjs.org/plugin-development/#inter-plugin-communication
    // @ts-expect-error Legacy code
    [id] = id.split('?');
    if (id.startsWith(srcDir) && id.endsWith('.js')) {
      return await transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
        jsxDev: !isProd
      });
    }

    return undefined;
  }
});
const config = defineConfig({
  plugins: [vitePlugin(true), react()],
  resolve: {
    // This prevents pnpm symlink paths from being used in the build for icons
    preserveSymlinks: true,
    // https://github.com/vitejs/vite/discussions/15268
    mainFields: ['browser'],
    dedupe: [
      '@tanstack/react-query',
      'react-hook-form',
      '@tanstack/react-router'
    ]
  },
  test: {
    environment: 'jsdom',
    globals: true,
    watch: false,
    setupFiles: ['src/__tests__/shared/setupTests.js'],
    server: {
      deps: {
        inline: ['@rhino-project/core']
      }
    },

    alias: {
      'rhino.config': resolve('src/__tests__/shared/rhino.config.jsx'),
      'virtual:@rhino-project/core/config/env': resolve(
        'src/__tests__/shared/env.js'
      ),
      'virtual:@rhino-project/core/config/assets': resolve(
        'src/__tests__/shared/assets.js'
      ),
      'models/static': resolve('src/__tests__/shared/modelFixtures.js'),
      'routes/custom': resolve('src/__tests__/shared/customRoutes.js')
    }
  }
});

export default mergeConfig(
  tanstackBuildConfig({
    entry: ['./src/index.tsx'],
    exclude: ['./src/__tests__'],
    srcDir: './src',
    externalDeps: [
      'react',
      'rhino.config',
      'routes/custom',
      'models/static',
      'virtual:@rhino-project/core/config/assets',
      'virtual:@rhino-project/core/config/env'
    ]
  }),
  config
);
