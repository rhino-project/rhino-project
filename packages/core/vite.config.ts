import { tanstackBuildConfig } from '@tanstack/config/build';
import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import url from 'node:url';
import { transformWithEsbuild } from 'vite';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { resolve } from 'node:path';

// NOTE: Keep trailing slash to use resulting path in prefix matching.
const srcDir = url.fileURLToPath(new URL('./src/', import.meta.url));

const vitePlugin = (isProd) => ({
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
    [id] = id.split('?');
    if (id.startsWith(srcDir) && id.endsWith('.js')) {
      return await transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic',
        jsxDev: !isProd
      });
    }
  }
});
const config = defineConfig({
  plugins: [
    externalizeDeps({
      include: [
        'react',
        'rhino.config',
        'virtual:@rhino-project/config/env',
        'components/app/CustomPrimaryNavigation',
        'components/app/CustomSecondaryNavigation',
        'assets/images/logo-dark.svg',
        'assets/images/logo-light.svg',
        'routes/custom',
        'models/static'
      ]
    }),
    vitePlugin(mode === 'production'),
    react()
  ],
  resolve: {
    // This prevents pnpm symlink paths from being used in the build for icons
    preserveSymlinks: true
  },
  test: {
    environment: 'jsdom',
    globals: true,
    watch: false,
    setupFiles: ['src/__tests__/shared/setupTests.js'],
    alias: {
      'rhino.config': resolve('src/__tests__/shared/rhino.config.js'),
      'virtual:@rhino-project/config/env': resolve(
        'src/__tests__/shared/env.js'
      ),
      'models/static': resolve('src/__tests__/shared/modelFixtures.js'),
      'routes/custom': resolve('src/__tests__/shared/customRoutes.js'),
      'assets/images/logo-dark.svg': resolve(
        'src/__tests__/shared/logo-dark.svg'
      ),
      'assets/images/logo-light.svg': resolve(
        'src/__tests__/shared/logo-light.svg'
      )
    }
  }
});

export default mergeConfig(
  tanstackBuildConfig({
    entry: [
      './src/index.js',
      './src/contexts/index.js',
      './src/queries/index.js',
      './src/utils/index.js',
      './src/models/index.js',
      './src/components/settings/index.js',
      './src/components/pagination/index.js',
      './src/components/forms/filters/index.js',
      './src/components/forms/displays/index.js',
      './src/components/forms/fieldGroups/index.js',
      './src/components/forms/index.js',
      './src/components/forms/displayGroups/index.js',
      './src/components/forms/filterGroups/index.js',
      './src/components/forms/fields/index.js',
      './src/components/empties/index.js',
      './src/components/buttons/index.js',
      './src/components/app/index.js',
      './src/components/auth/index.js',
      './src/components/shells/index.js',
      './src/components/logos/index.js',
      './src/components/index.js',
      './src/components/shared/index.js',
      './src/components/models/filters/index.js',
      './src/components/models/cells/index.js',
      './src/components/models/fieldGroups/index.js',
      './src/components/models/index.js',
      './src/components/models/displayGroups/index.js',
      './src/components/models/fields/index.js',
      './src/components/models/ModelIndex.js',
      './src/components/alerts/index.js',
      './src/components/checkboxes/index.js',
      './src/components/null/index.js',
      './src/components/layouts/index.js',
      './src/components/table/cells/index.js',
      './src/components/table/index.js',
      './src/components/icons/index.js',
      './src/components/devtool/index.js',
      './src/components/nav/index.js',
      './src/components/errors/index.js',
      './src/components/breadcrumbs/index.js',
      './src/components/analytics/index.js',
      './src/hooks/index.js',
      './src/lib/index.js',
      './src/pages/settings/index.js',
      './src/pages/auth/index.js',
      './src/pages/index.js',
      './src/pages/model/Index.js',
      './src/routes/index.js'
    ],
    exclude: ['./src/__tests__'],
    srcDir: './src'
  }),
  config
);
