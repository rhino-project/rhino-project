import env from 'virtual:@rhino-project/config/env';

export default {
  ...env,

  // Compound env vars
  DESIGN_SYSTEM_ENABLED: env.DEV || env.DESIGN_SYSTEM_ENABLED === 'true',
  ROLLBAR_ENV: env.ROLLBAR_ENV || env.MODE,
  ROLLBAR_ENABLED: env.PROD || env.ROLLBAR_ENABLED === 'true'
};
