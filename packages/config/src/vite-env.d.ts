/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ROOT_PATH: string
  readonly VITE_DESIGN_SYSTEM_ENABLED: string
  readonly VITE_ROLLBAR_ACCESS_TOKEN: string
  readonly VITE_ROLLBAR_ENV: string
  readonly VITE_ROLLBAR_ENABLED: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
