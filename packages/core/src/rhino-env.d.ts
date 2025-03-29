interface RhinoEnv {
  readonly DESIGN_SYSTEM_ENABLED: boolean;
  readonly ROLLBAR_ACCESS_TOKEN?: string;
  readonly ROLLBAR_ENV: string;
  readonly ROLLBAR_ENABLED: boolean;
  readonly STRIPE_PUBLISHABLE_KEY?: string;
}
