import { merge } from 'lodash';
import { useMemo } from 'react';
import rhinoConfig from 'rhino.config';

export interface RhinoConfig {
  version: number;
  appName: string;
  enableModelRoutes: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Record<string, any>;
}

export const API_ROOT_PATH =
  import.meta.env.VITE_API_ROOT_PATH || import.meta.env.REACT_APP_API_ROOT_PATH;

export const DESIGN_SYSTEM_ENABLED =
  import.meta.env.DEV ||
  import.meta.env.REACT_APP_DESIGN_SYSTEM_ENABLED === 'true';

export const defaultConfig: RhinoConfig = {
  version: 1,
  appName: 'BoilerPlate',
  enableModelRoutes: true,
  components: {}
};

export const getRhinoConfig = (): RhinoConfig => {
  const mergedConfig = merge({}, defaultConfig, rhinoConfig);

  return mergedConfig;
};

export const useRhinoConfig = (): RhinoConfig =>
  useMemo(() => getRhinoConfig(), []);
