import { useMemo } from 'react';
import assets from './assets';
import env from './env';
import {
  RhinoConfigAttributeComponentMap,
  RhinoConfigGlobalComponentMap,
  RhinoConfigModelComponentMap
} from './components';
import { merge } from 'lodash-es';

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
  /**
   * Version number of the config file format
   * @default 1.0
   */
  version: number;

  /**
   * The app name, displayed in places like the title bar
   * @default 'RhinoProject'
   */
  appName: string;

  /**
   * Whether or not to enable the default model routes
   * @default true
   */
  enableModelRoutes: boolean;

  /**
   * The path relative to assets for the dark logo
   * @default 'images/logo-dark.svg'
   */
  darkLogo: string;

  /**
   * The path relative to assets for the light logo
   * @default 'images/logo-light.svg'
   */
  lightLogo: string;

  /**
   * All assets available under assets.  Use `useRhinoAsset` to access the urls
   */
  assets: typeof assets;

  /**
   * All available environment variables
   */
  env: typeof env;

  /**
   * Configure global, model and attribute components
   */
  components:
    | RhinoConfigGlobalComponent
    | Record<string, RhinoConfigModelComponent>
    | Record<string, Record<string, RhinoConfigAttributeComponent>>;
}

export const defaultConfig: RhinoConfig = {
  version: 1,
  appName: 'RhinoProject',
  enableModelRoutes: true,
  darkLogo: 'images/logo-dark.svg',
  lightLogo: 'images/logo-light.svg',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  assets,
  env,
  components: {}
};

/**
 * Retrieves the Rhino configuration.
 * * @returns {RhinoConfig} The Rhino configuration object.
 */
export const getRhinoConfig = (): RhinoConfig => {
  // FIXME: Is there a better way to get rhinoConfig as RhinoConfig?
  const mergedConfig = merge({}, defaultConfig, rhinoConfig as RhinoConfig);

  return mergedConfig;
};

/**
 * Hook to retrieve the Rhino configuration.
 * @returns {RhinoConfig} The Rhino configuration object.
 */
export const useRhinoConfig = (): RhinoConfig =>
  useMemo(() => getRhinoConfig(), []);

/**
 * Retrieves the url of a Rhino asset.
 * @param asset - The name of the asset relative to `assets`.
 * @returns The path of the asset, or undefined if the asset is not found.
 */
export const useRhinoAsset = (asset: string): string | undefined => {
  const { assets } = useRhinoConfig();
  const assetPath = `/src/assets/${asset}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return assets[assetPath]?.default;
};
