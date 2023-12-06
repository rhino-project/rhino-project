import { merge } from 'lodash';
import { useMemo } from 'react';
import rhinoConfig from 'rhino.config';
import {
  RhinoConfigAttributeComponentMap,
  RhinoConfigGlobalComponentMap,
  RhinoConfigModelComponentMap
} from './components';

export type RhinoConfigGlobalComponent =
  | RhinoConfigGlobalComponentMap
  | RhinoConfigModelComponentMap
  | RhinoConfigAttributeComponentMap;

export type RhinoConfigModelComponent =
  | RhinoConfigModelComponentMap
  | RhinoConfigAttributeComponentMap;

export type RhinoConfigAttributeComponent = RhinoConfigAttributeComponentMap;

export interface RhinoConfig {
  version: number;
  appName: string;
  enableModelRoutes: boolean;

  // Config for global, model and attribute components
  components:
    | RhinoConfigGlobalComponent
    | Record<string, RhinoConfigModelComponent>
    | Record<string, Record<string, RhinoConfigAttributeComponent>>;
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
