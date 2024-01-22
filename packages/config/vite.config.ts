import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, transformWithEsbuild } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import eslint from 'vite-plugin-eslint';

// https://stackoverflow.com/questions/68241263/absolute-path-not-working-in-vite-project-react-ts
import tsconfigPaths from 'vite-tsconfig-paths';

import fs from 'fs/promises';
import path from 'node:path';
import url from 'node:url';

// The vitePlugin and esBuildPlugin are both needed to support JSX in JS and are based on:
// https://github.com/vitejs/vite/discussions/3448#discussioncomment-5681381

// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const nodeModulesStr = `${path.sep}node_modules${path.sep}`;
// NOTE: Keep trailing slash to use resulting path in prefix matching.
const srcDir = url.fileURLToPath(new URL('./src/', import.meta.url));
// NOTE: Since ESBuild evaluates this regex using Go's engine, it is not
// clear whether the JS-specific regex escape logic is sound.
const srcRegex = new RegExp(`^${escapeRegExp(srcDir)}.*\.js$`);

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

const esbuildPlugin = {
  name: 'jsx-loader',
  setup(build) {
    // See: https://github.com/vitejs/vite/discussions/3448#discussioncomment-749919
    build.onLoad({ filter: srcRegex }, async (args) => {
      if (args.path.endsWith('.js')) {
        return {
          contents: await fs.readFile(args.path),
          loader: 'jsx'
        };
      }
    });
  }
};

// Environment variable check plugin
const envCheckPlugin = () => ({
  name: 'env-check-plugin',
  configResolved(config) {
    Object.keys(config.env).forEach((key) => {
      if (key.startsWith('REACT_APP_')) {
        const viteKey = key.replace(/^REACT_APP_/, 'VITE_');
        if (!config.env[viteKey]) {
          throw new Error(
            `Environment variable ${key} should be converted to ${viteKey}`
          );
        } else {
          console.warn(
            `Environment variable ${key} can be removed in favor of ${viteKey}`
          );
        }
      }
    });

    // Check for required environment variables
    const requiredEnv = ['VITE_API_ROOT_PATH'];
    requiredEnv.forEach((key) => {
      if (!config.env[key]) {
        throw new Error(
          `Environment variable ${key} is required${
            config.env['DEV'] ? ' does .env exist?' : ''
          }`
        );
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // https://main.vitejs.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, process.cwd(), '');

  return {
    optimizeDeps: {
      esbuildOptions: {
        plugins: [esbuildPlugin]
      }
    },

    // https://github.com/vitejs/vite/issues/382#issuecomment-821971429
    resolve: {
      alias: [
        {
          find: /^~.+/,
          replacement: (val) => {
            return val.replace(/^~/, '');
          }
        }
      ]
    },

    // Backwards compatibility with create-react-app
    envPrefix: ['REACT_APP_', 'VITE_'],

    // Allow .env to specify port
    server: {
      // Allow serving from 0.0.0.0, 127.0.0.1 and localhost
      host: true,
      port: env.PORT
    },

    plugins: [
      vitePlugin(mode === 'production'),
      envCheckPlugin(),
      react(),
      {
        // default settings on build (i.e. fail on error)
        ...eslint(),
        apply: 'build'
      },
      // https://github.com/vitest-dev/vitest/issues/4055#issuecomment-1732994672
      mode !== 'test' && {
        // do not fail on serve (i.e. local development)
        ...eslint({
          failOnWarning: false,
          failOnError: false
        }),
        apply: 'serve',
        enforce: 'post'
      },
      ViteEjsPlugin(),
      tsconfigPaths()
    ],

    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['src/setupTests.js'],
      // For now until speed improves https://dev.to/thejaredwilcurt/improving-vitest-performance-42c6
      testTimeout: 10000
    }
  };
});
