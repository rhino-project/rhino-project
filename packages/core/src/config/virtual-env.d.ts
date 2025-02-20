declare module 'virtual:@rhino-project/core/config/env' {
  interface RhinoVirtualEnv extends ImportMetaEnv {
    readonly DESIGN_SYSTEM_ENABLED: string;
    readonly ROLLBAR_ACCESS_TOKEN: string;
    readonly ROLLBAR_ENV: string;
    readonly ROLLBAR_ENABLED: string;
    readonly STRIPE_PUBLISHABLE_KEY: string;
  }

  declare const _default: RhinoVirtualEnv;
  export default _default;
}
