import { defineConfig } from 'cypress';
import { loadEnv } from 'vite';

const env = loadEnv('testing', process.cwd(), '');

export default defineConfig({
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      config.testUser = {
        email: 'test@example.com',
        password: 'password'
      };

      return config;
    },
    baseUrl: `http://localhost:${env.PORT || 3000}`,
    env: {
      PORT: env.PORT || 3000,
      VITE_API_ROOT_PATH: env.VITE_API_ROOT_PATH
    }
  }
});
