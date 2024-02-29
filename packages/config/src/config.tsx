import { useMemo } from 'react';
import assets from './assets';
import env from './env';
import {
  RhinoConfigAttributeComponentMap,
  RhinoConfigGlobalComponentMap,
  RhinoConfigModelComponentMap
} from './components';
import merge from 'lodash-es/merge';

// @ts-expect-error - We expect the user to create a file called rhino.config.js in the root of their project
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
  darkLogo: string;
  lightLogo: string;

  // Config for assets
  assets: typeof assets;

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
  darkLogo: 'images/logo-dark.svg',
  lightLogo: 'images/logo-light.svg',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  assets,
  env,
  components: {}
};

export const getRhinoConfig = (): RhinoConfig => {
  // FIXME: Is there a better way to get rhinoConfig as RhinoConfig?
  const mergedConfig = merge({}, defaultConfig, rhinoConfig as RhinoConfig);

  return mergedConfig;
};

export const useRhinoConfig = (): RhinoConfig =>
  useMemo(() => getRhinoConfig(), []);

export const useRhinoAsset = (asset: string): string | undefined => {
  const { assets } = useRhinoConfig();
  const assetPath = `/src/assets/${asset}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return assets[assetPath]?.default;
};
