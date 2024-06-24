interface ImportMetaEnv {
  readonly VITE_API_ROOT_PATH: string;
  readonly VITE_DESIGN_SYSTEM_ENABLED: string;
  readonly VITE_ROLLBAR_ACCESS_TOKEN: string;
  readonly VITE_ROLLBAR_ENV: string;
  readonly VITE_ROLLBAR_ENABLED: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface RhinoEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly API_ROOT_PATH: string;
  readonly DESIGN_SYSTEM_ENABLED: boolean;
  readonly ROLLBAR_ACCESS_TOKEN: string;
  readonly ROLLBAR_ENV: string;
  readonly ROLLBAR_ENABLED: boolean;
  readonly STRIPE_PUBLISHABLE_KEY: string;
}
