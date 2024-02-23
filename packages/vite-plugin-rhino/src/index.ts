import path from 'path';
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

export function RhinoProjectVite(): Plugin {
  let CONFIG: ResolvedConfig;

  return {
    name: 'vite-plugin-rhino',
    config: () => ({
      optimizeDeps: {
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: ['@rhino-project/config', '@rhino-project/core', 'qs'],
        // FIXME: Horrible hack to get around the fact @rhino-project/core is very broad in its imports
        // and we need many of them processed as they are CJS.  This is a temporary solution until
        // we can get rid of the external deps in core
        include: [
          'qs',
          'classnames',
          'tiny-case',
          'property-expr',
          'toposort',
          'hoist-non-react-statics',
          'react-simple-animate',
          'lodash',
          'lodash/get',
          'lodash/isObject',
          'lodash/each',
          'lodash/isUndefined',
          'fast-deep-equal/react',
          'js-cookie/**',
          'copy-to-clipboard',
          'nano-css/addon/cssom',
          'nano-css/addon/vcssom',
          'nano-css',
          'nano-css/addon/vcssom/cssToTree',
          'screenfull/dist/*.js',
          'react-universal-interface/lib/*.js',
          'fast-shallow-equal',
          'ts-easing/lib/*.js',
          'invariant/*.js',
          'warning/*.js',
          'fast-deep-equal',
          'lodash.debounce',
          'react-fast-compare',
          'react-dom',
          'react-phone-input-2'
        ]
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
