declare module 'virtual:@rhino-project/config/env' {
  interface RhinoEnv extends ImportMetaEnv {
    readonly API_ROOT_PATH: string;
    readonly DESIGN_SYSTEM_ENABLED: string;
    readonly ROLLBAR_ACCESS_TOKEN: string;
    readonly ROLLBAR_ENV: string;
    readonly ROLLBAR_ENABLED: string;
    readonly STRIPE_PUBLISHABLE_KEY: string;
  }

  declare const _default: RhinoEnv;
  export default _default;
}
