import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { transformWithEsbuild } from 'vite';
import type { Plugin, ResolvedConfig } from 'vite';

const CONFIG_MODULE_ID = 'rhino.config';
const CUSTOM_PRIMARY_NAVIGATION_MODULE_ID =
  'components/app/CustomPrimaryNavigation';
const CUSTOM_SECONDARY_NAVIGATION_MODULE_ID =
  'components/app/CustomSecondaryNavigation';
const MODELS_STATIC_MODULE_ID = 'models/static';
const CUSTOM_ROUTES_MODULE_ID = 'routes/custom';

const ENV_MODULE_ID = 'virtual:@rhino-project/config/env';
const RESOLVED_ENV_MODULE_ID = '\0' + ENV_MODULE_ID;
const ASSETS_MODULE_ID = 'virtual:@rhino-project/config/assets';
const RESOLVED_ASSETS_MODULE_ID = '\0' + ASSETS_MODULE_ID;

// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
// $& means the whole matched string
const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ESBuild is used to pre-bundle modules in dev mode
// This plugin is used to resolve the virtual/local import paths for Rhino and to handle jsx in js
// in @rhino-project/core - at some point we should support @rhino-project/config as well
const esbuildRhinoPlugin = {
  name: 'esbuild-rhino-plugin',
  // @ts-ignore
  setup(build) {
    // We use the Vite technique of marking them as external so that they are not pre-bundled
    //https://github.com/vitejs/vite/blob/42fd11c1c6d37402bd15ba816fbf65dbed3abe55/packages/vite/src/node/optimizer/esbuildDepPlugin.ts#L166
    const jsPattern =
      /components\/app\/CustomPrimaryNavigation|components\/app\/CustomSecondaryNavigation|models\/static|routes\/custom/;
    // @ts-ignore
    build.onResolve({ filter: jsPattern }, async (args) => {
      return {
        path: path.resolve(process.cwd(), 'src', `${args.path}.js`),
        external: true
      };
    });

    // Handle js in jsx
    // See: https://github.com/vitejs/vite/discussions/3448#discussioncomment-749919
    // NOTE: Since ESBuild evaluates this regex using Go's engine, it is not
    // clear whether the JS-specific regex escape logic is sound.
    const jsFilter = new RegExp(`^${escapeRegExp(process.cwd())}.*[.]js$`);
    // @ts-ignore
    build.onLoad({ filter: jsFilter }, async (args) => {
      if (args.path.endsWith('.js')) {
        return {
          contents: await readFile(args.path),
          loader: 'jsx'
        };
      }

      return undefined;
    });
  }
};

export function RhinoProjectVite(): Plugin {
  let CONFIG: ResolvedConfig;

  return {
    name: 'vite-plugin-rhino',
    enforce: 'pre',
    config: () => ({
      // Backwards compatibility with create-react-app
      envPrefix: ['REACT_APP_', 'VITE_'],

      optimizeDeps: {
        esbuildOptions: {
          plugins: [esbuildRhinoPlugin]
        },
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: [
          'virtual:@rhino-project/config/assets',
          'rhino.config',
          'virtual:@rhino-project/config/env'
        ]
      },

      test: {
        server: {
          deps: {
            inline: ['@rhino-project/config', '@rhino-project/core']
          }
        }
      }
    }),

    configResolved(config) {
      CONFIG = config;

      // Check for deprecated environment variables
      Object.keys(config.env).forEach((key) => {
        if (key.startsWith('REACT_APP_')) {
          const viteKey = key.replace(/^REACT_APP_/, 'VITE_');
          if (!config.env[viteKey]) {
            throw new Error(
              `Environment variable ${key} should be converted to ${viteKey}`
            );
          } else {
            console.warn(
              `Environment variable ${key} can be removed in favor of ${viteKey}`
            );
          }
        }
      });

      // Check for required environment variables
      const requiredEnv = ['VITE_API_ROOT_PATH'];
      requiredEnv.forEach((key) => {
        if (!config.env[key]) {
          throw new Error(
            `Environment variable ${key} is required${
              config.env['DEV'] ? ' does .env exist?' : ''
            }`
          );
        }
      });
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
      } else if (id === ENV_MODULE_ID) {
        // Map the import to a virtual module ID
        return RESOLVED_ENV_MODULE_ID;
      } else if (id === ASSETS_MODULE_ID) {
        // Map the import to a virtual module ID
        return RESOLVED_ASSETS_MODULE_ID;
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
      } else if (id === RESOLVED_ASSETS_MODULE_ID) {
        return 'export default import.meta.glob("/src/assets/**/*", { eager: true })';
      }

      return null;
    },

    // Handle js in jsx for builds
    async transform(code, id) {
      // Ignore Rollup virtual modules.
      if (id.startsWith('\0')) {
        return;
      }

      // Strip off any "proxy id" component before testing against path.
      // See: https://github.com/vitejs/vite-plugin-react-swc/blob/a1bfc313612a8143a153ce87f52925059459aeb2/src/index.ts#L89
      // See: https://rollupjs.org/plugin-development/#inter-plugin-communication
      // @ts-ignore
      [id] = id.split('?');
      if (id.startsWith(CONFIG.root) && id.endsWith('.js')) {
        return await transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
          jsxDev: !(CONFIG.env.MODE === 'production')
        });
      }

      return undefined;
    }
  };
}
