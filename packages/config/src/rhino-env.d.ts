export interface RhinoEnv {
  readonly DESIGN_SYSTEM_ENABLED: boolean;
  readonly ROLLBAR_ACCESS_TOKEN?: string;
  readonly ROLLBAR_ENV: string;
  readonly ROLLBAR_ENABLED: boolean;
  readonly STRIPE_PUBLISHABLE_KEY?: string;
}

// Convert RhinoEnv to a type that can be used in the browser
export type RhinoWindowEnv = {
  readonly [K in keyof RhinoEnv]?: string;
};

declare global {
  interface Window {
    rhino: {
      env: RhinoWindowEnv;
    };
  }
}
