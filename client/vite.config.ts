import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import eslint from 'vite-plugin-eslint';
import { RhinoProjectVite } from '@rhino-project/vite-plugin-rhino';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // https://main.vitejs.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Allow .env to specify port
    server: {
      // Allow serving from 0.0.0.0, 127.0.0.1 and localhost
      host: true,
      port: Number(env.PORT) || 3001
    },

    plugins: [
      RhinoProjectVite(),
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
      ViteEjsPlugin()
    ],

    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['src/__tests__/shared/setupTests.js'],
      // For now until speed improves https://dev.to/thejaredwilcurt/improving-vitest-performance-42c6
      testTimeout: 10000
    }
  };
});
