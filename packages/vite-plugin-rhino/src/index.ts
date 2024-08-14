import path from 'node:path';
import fs from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
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
// This plugin is used to handle jsx in js
const esbuildRhinoPlugin = {
  name: 'esbuild-rhino-plugin',
  // @ts-ignore
  setup(build) {
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

export function RhinoProjectVite({
  enableJsxInJs = true,
  enableStaticCheck = true,
  staticCheckInterval = 10000,
  staticCheckExcludedBranches = ['main']
}: {
  enableJsxInJs?: boolean;
  enableStaticCheck?: boolean;
  staticCheckInterval?: number;
  staticCheckExcludedBranches?: Array<string>;
} = {}): Plugin {
  let CONFIG: ResolvedConfig;
  let previousContent = '';

  const esBuildPlugins = enableJsxInJs ? [esbuildRhinoPlugin] : [];

  return {
    name: 'vite-plugin-rhino',
    enforce: 'pre',
    config: () => ({
      // Backwards compatibility with create-react-app
      envPrefix: ['REACT_APP_', 'VITE_'],

      optimizeDeps: {
        esbuildOptions: {
          plugins: esBuildPlugins
        },

        // Exclude the modules that are replaced by local files or virtual modules
        exclude: [
          'virtual:@rhino-project/config/assets',
          'rhino.config',
          'virtual:@rhino-project/config/env',
          'models/static',
          'routes/custom',
          'components/app/CustomPrimaryNavigation',
          'components/app/CustomSecondaryNavigation'
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

      // If we are not in development mode or the serve command, do not proceed unless static check is enabled
      // This is to prevent the static check from running in production builds and under vitest
      if (
        config.command !== 'serve' ||
        config.mode !== 'development' ||
        !enableStaticCheck
      )
        return;

      const apiRootPath = config.env.VITE_API_ROOT_PATH;
      const logger = config.logger;

      if (!apiRootPath) {
        logger.error('VITE_API_ROOT_PATH environment variable is not defined.');
        return;
      }

      async function checkUrl() {
        const url = apiRootPath + '/api/info/openapi';

        try {
          // Get the current Git branch
          const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
            .toString()
            .trim();

          // Check if the current branch is in the excludedBranches list
          if (staticCheckExcludedBranches.includes(currentBranch)) {
            logger.info(`Skipping URL check on branch: ${currentBranch}`);
            return;
          }

          const response = await fetch(url);
          if (!response.ok) {
            logger.error(`Error fetching ${url}: ${response.status}`);
            return;
          }

          const content = await response.text();

          if (!previousContent) {
            try {
              const staticFileContent = await readFile(
                'src/models/static.js',
                'utf-8'
              );
              // Extract the content between const api = and ;
              const match = staticFileContent.match(/const api = (\{.*\});/s);
              if (match && match[1]) {
                previousContent = match[1];
              }
            } catch (readError: any) {
              logger.warn(
                'Failed to read initial content from src/models/static.js:',
                readError
              );
            }
          }

          // Compare only the JSON content, not the entire file
          if (content !== previousContent) {
            const jsContent = `const api = ${content};\n\nexport default api;\n`;
            await writeFile('src/models/static.js', jsContent);
            previousContent = content;
            logger.info('Updated src/models/static.js with new OpenAPI data.', {
              timestamp: true
            });
          }
        } catch (error) {
          logger.error(`Error fetching or writing OpenAPI data: ${error}`);
        }
      }

      checkUrl(); // Initial fetch
      setInterval(checkUrl, staticCheckInterval);
    },

    resolveId(id) {
      const checkExtensions = (basePath: string) => {
        const extensions = ['.tsx', '.jsx', '.ts', '.js'];
        for (const ext of extensions) {
          const fullPath = basePath + ext;
          if (fs.existsSync(fullPath)) {
            return fullPath;
          }
        }
        return null;
      };

      if (id === CONFIG_MODULE_ID) {
        // Replace 'rhino.config' with the path to the local file
        // FIXME: Allow the location to be configured
        return checkExtensions(path.join(CONFIG.root, 'src/rhino.config'));
      } else if (id === CUSTOM_PRIMARY_NAVIGATION_MODULE_ID) {
        // Replace 'components/app/CustomPrimaryNavigation' with the path to the local file
        return checkExtensions(
          path.join(CONFIG.root, 'src/components/app/CustomPrimaryNavigation')
        );
      } else if (id === CUSTOM_SECONDARY_NAVIGATION_MODULE_ID) {
        // Replace 'components/app/CustomSecondaryNavigation' with the path to the local file
        return checkExtensions(
          path.join(CONFIG.root, 'src/components/app/CustomSecondaryNavigation')
        );
      } else if (id === MODELS_STATIC_MODULE_ID) {
        // Replace 'models/static' with the path to the local file
        return checkExtensions(path.join(CONFIG.root, 'src/models/static'));
      } else if (id === CUSTOM_ROUTES_MODULE_ID) {
        // Replace 'routes/custom' with the path to the local file
        return checkExtensions(path.join(CONFIG.root, 'src/routes/custom'));
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
      // Ignore Rollup virtual modules and js files if jsx in js is disabled
      if (!enableJsxInJs || id.startsWith('\0')) {
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
