import { RhinoEnv } from './rhino-env';

const RhinoRuntimeEnv: RhinoEnv = {
  ...window.rhino.env,

  // Compound env vars
  DESIGN_SYSTEM_ENABLED:
    process.env.NODE_ENV === 'development' ||
    String(window.rhino.env.DESIGN_SYSTEM_ENABLED) === 'true',
  ROLLBAR_ENV:
    window.rhino.env.ROLLBAR_ENV || process.env.NODE_ENV || 'development',
  ROLLBAR_ENABLED:
    process.env.NODE_ENV === 'production' ||
    String(window.rhino.env.ROLLBAR_ENABLED) === 'true'
};
export default RhinoRuntimeEnv;
