import path from 'node:path';
import { Plugin, ResolvedConfig } from 'vite';

const CONFIG_MODULE_ID = 'rhino.config';
const CUSTOM_PRIMARY_NAVIGATION_MODULE_ID =
  'components/app/CustomPrimaryNavigation';
const CUSTOM_SECONDARY_NAVIGATION_MODULE_ID =
  'components/app/CustomSecondaryNavigation';
const MODELS_STATIC_MODULE_ID = 'models/static';
const CUSTOM_ROUTES_MODULE_ID = 'routes/custom';
const DARK_LOGO_MODULE_ID = 'assets/images/logo-dark.svg';
const LIGHT_LOGO_MODULE_ID = 'assets/images/logo-light.svg';

const ENV_MODULE_ID = 'virtual:@rhino-project/config/env';
const RESOLVED_ENV_MODULE_ID = '\0' + ENV_MODULE_ID;

const jsPattern =
  /components\/app\/CustomPrimaryNavigation|components\/app\/CustomSecondaryNavigation|models\/static|routes\/custom/;

const svgPattern =
  /assets\/images\/logo-dark.svg|assets\/images\/logo-light.svg/;

// ESBuild is used to pre-bundle modules in dev mode
// This plugin is used to resolve the virtual/local import paths for Rhino
// in @rhino-project/core - at some point we should support @rhino-project/config as well
const esbuildRhinoPlugin = {
  name: 'esbuild-rhino-plugin',
  // @ts-ignore
  setup(build) {
    // We use the Vite technique of marking them as external so that they are not pre-bundled
    //https://github.com/vitejs/vite/blob/42fd11c1c6d37402bd15ba816fbf65dbed3abe55/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L166

    // @ts-ignore
    build.onResolve({ filter: jsPattern }, async (args) => {
      return {
        path: path.resolve(process.cwd(), 'src', `${args.path}.js`),
        external: true
      };
    });

    // @ts-ignore
    build.onResolve({ filter: svgPattern }, async (args) => {
      return {
        path: path.resolve(process.cwd(), 'src', args.path),
        external: true
      };
    });
  }
};

export function RhinoProjectVite(): Plugin {
  let CONFIG: ResolvedConfig;

  return {
    name: 'vite-plugin-rhino',
    enforce: 'pre',
    config: () => ({
      optimizeDeps: {
        esbuildOptions: {
          plugins: [esbuildRhinoPlugin]
        },
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: ['@rhino-project/config']
      }
    }),

    configResolved(vite) {
      CONFIG = vite;
    },

    resolveId(id) {
      if (id === CONFIG_MODULE_ID) {
        // Replace 'rhino.config' with the path to the local file
        // FIXME: Allow the location to be configured
        return path.join(CONFIG.root, 'src/rhino.config.js');
      } else if (id === CUSTOM_PRIMARY_NAVIGATION_MODULE_ID) {
        // Replace 'components/app/CustomPrimaryNavigation' with the path to the local file
        return path.join(
          CONFIG.root,
          'src/components/app/CustomPrimaryNavigation.js'
        );
      } else if (id === CUSTOM_SECONDARY_NAVIGATION_MODULE_ID) {
        // Replace 'components/app/CustomSecondaryNavigation' with the path to the local file
        return path.join(
          CONFIG.root,
          'src/components/app/CustomSecondaryNavigation.js'
        );
      } else if (id === MODELS_STATIC_MODULE_ID) {
        // Replace 'models/static' with the path to the local file
        return path.join(CONFIG.root, 'src/models/static.js');
      } else if (id === CUSTOM_ROUTES_MODULE_ID) {
        // Replace 'routes/custom' with the path to the local file
        return path.join(CONFIG.root, 'src/routes/custom.js');
      } else if (id === DARK_LOGO_MODULE_ID) {
        // Replace 'assets/images/logo-dark.svg' with the path to the local file
        return path.join(CONFIG.root, 'src/assets/images/logo-dark.svg');
      } else if (id === LIGHT_LOGO_MODULE_ID) {
        // Replace 'assets/images/logo-light.svg' with the path to the local file
        return path.join(CONFIG.root, 'src/assets/images/logo-light.svg');
      } else if (id === ENV_MODULE_ID) {
        // Map the import to a virtual module ID
        return RESOLVED_ENV_MODULE_ID;
      }

      return null; // Other imports are handled as usual
    },

    load(id) {
      if (id === RESOLVED_ENV_MODULE_ID) {
        let envExports = `export default {`;
        Object.keys(CONFIG.env).forEach((key) => {
          const baseKey = key.replace(/^VITE_/, '');

          envExports = envExports + `${baseKey}: import.meta.env.${key},`;
        });
        envExports = envExports + `}`;

        return envExports;
      }

      return null;
    }
  };
}
