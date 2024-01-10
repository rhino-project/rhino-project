import { merge } from 'lodash';
import { useMemo } from 'react';
import rhinoConfig from 'rhino.config';
import env from 'rhino/config/env';
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

  // Config for env variables
  env: typeof env;

  // Config for global, model and attribute components
  components:
    | RhinoConfigGlobalComponent
    | Record<string, RhinoConfigModelComponent>
    | Record<string, Record<string, RhinoConfigAttributeComponent>>;
}

export const defaultConfig: RhinoConfig = {
  version: 1,
  appName: 'BoilerPlate',
  enableModelRoutes: true,
  env,
  components: {}
};

export const getRhinoConfig = (): RhinoConfig => {
  const mergedConfig = merge({}, defaultConfig, rhinoConfig);

  return mergedConfig;
};

export const useRhinoConfig = (): RhinoConfig =>
  useMemo(() => getRhinoConfig(), []);
