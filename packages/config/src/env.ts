import env from 'virtual:@rhino-project/config/env';

const RhinoRuntimeEnv: RhinoEnv = {
  ...env,

  // Compound env vars
  DESIGN_SYSTEM_ENABLED:
    process.env.NODE_ENV === 'development' ||
    env.DESIGN_SYSTEM_ENABLED === 'true',
  ROLLBAR_ENV: env.ROLLBAR_ENV || process.env.NODE_ENV || 'development',
  ROLLBAR_ENABLED:
    process.env.NODE_ENV === 'production' || env.ROLLBAR_ENABLED === 'true'
};
export default RhinoRuntimeEnv;
