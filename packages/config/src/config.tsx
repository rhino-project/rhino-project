import { useMemo } from 'react';
import env from './env';
import {
  RhinoConfigAttributeComponentMap,
  RhinoConfigGlobalComponentMap,
  RhinoConfigModelComponentMap
} from './components';
import merge from 'lodash-es/merge';

// We expect the user to create a file called rhino.config.js in the root of their project
// @ts-ignore
import rhinoConfig from 'rhino.config';

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
