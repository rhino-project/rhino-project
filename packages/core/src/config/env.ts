export default {
  API_ROOT_PATH: import.meta.env.VITE_API_ROOT_PATH,
  DESIGN_SYSTEM_ENABLED:
    import.meta.env.DEV ||
    import.meta.env.VITE_DESIGN_SYSTEM_ENABLED === 'true',
  ROLLBAR_ACCESS_TOKEN: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  ROLLBAR_ENV: import.meta.env.VITE_ROLLBAR_ENV || import.meta.env.MODE,
  ROLLBAR_ENABLED:
    import.meta.env.PROD || import.meta.env.VITE_ROLLBAR_ENABLED === 'true',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
};
