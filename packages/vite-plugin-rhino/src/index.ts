import path from 'node:path';
import fs from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { exec, execSync } from 'node:child_process';
import { loadEnv, transformWithEsbuild } from 'vite';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { promisify } from 'node:util';

const CONFIG_MODULE_ID = 'rhino.config';
const MODELS_STATIC_MODULE_ID = 'models/static';

const ASSETS_MODULE_ID = 'virtual:@rhino-project/core/config/assets';
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

const execAsync = promisify(exec);

export function RhinoProjectVite({
  enableJsxInJs = true,
  enableStaticCheck = true,
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

  // Check if the environment variable RHINO_VITE_STATIC_CHECK_EXCLUDED_BRANCHES is set
  const excludedBranchesFromEnv =
    process.env.RHINO_VITE_STATIC_CHECK_EXCLUDED_BRANCHES;
  const finalExcludedBranches =
    excludedBranchesFromEnv !== undefined
      ? excludedBranchesFromEnv.trim() === ''
        ? []
        : excludedBranchesFromEnv.split(',').map((branch) => branch.trim())
      : staticCheckExcludedBranches;

  const intermediatePath = () =>
    fs.existsSync(path.join(CONFIG.root, 'src')) ? 'src' : '';
  const resolvePath = (relativePath: string) => {
    return path.join(
      ...[CONFIG.root, intermediatePath(), relativePath].filter(Boolean)
    );
  };

  return {
    name: 'vite-plugin-rhino',
    enforce: 'pre',
    config: () => ({
      resolve: {
        dedupe: ['@tanstack/react-query', '@tanstack/react-router']
      },

      // Backwards compatibility with create-react-app
      envPrefix: ['REACT_APP_', 'VITE_'],

      optimizeDeps: {
        esbuildOptions: {
          plugins: esBuildPlugins
        },

        // Exclude the modules that are replaced by local files or virtual modules
        exclude: [
          'virtual:@rhino-project/core/config/assets',
          'rhino.config',
          'models/static'
        ]
      },

      test: {
        server: {
          deps: {
            inline: ['@rhino-project/core']
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
      const requiredEnv = [] as Array<string>;
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

    configureServer(server: ViteDevServer) {
      if (!enableStaticCheck) return;

      // https://main.vitejs.dev/config/#using-environment-variables-in-config
      const env = loadEnv(CONFIG.mode, process.cwd(), '');

      const apiRootPath = env.RHINO_APP_URL;
      const logger = server.config.logger;

      if (!apiRootPath) {
        logger.error('RHINO_APP_URL environment variable is not defined.');
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
          if (finalExcludedBranches.includes(currentBranch)) {
            logger.info(
              `Skipping static.js update on branch: ${currentBranch}`,
              {
                timestamp: true
              }
            );
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
                resolvePath('models/static.js'),
                'utf-8'
              );
              // Extract the content between const api = and ;
              const match = staticFileContent.match(/const api = (\{.*\});/s);
              if (match && match[1]) {
                previousContent = match[1];
              }
            } catch (readError: any) {
              logger.warn(
                'Failed to read initial content from models/static.js:',
                readError
              );
            }
          }

          // Compare only the JSON content, not the entire file
          if (content !== previousContent) {
            const jsContent = `const api = ${content};\n\nexport default api;\n`;
            await writeFile(resolvePath('models/static.js'), jsContent);
            previousContent = content;
            logger.info('Updated models/static.js with new OpenAPI data.', {
              timestamp: true
            });
          }
        } catch (error) {
          logger.error(`Error fetching or writing OpenAPI data: ${error}`);
        }
      }

      // Initial API check on startup
      checkUrl();

      // Watch app/models, db directories, and config/routes.rb for changes
      const watchPaths = [
        path.join(process.cwd(), 'app', 'models'),
        path.join(process.cwd(), 'db'),
        path.join(process.cwd(), 'config', 'routes.rb'),
        path.join(process.cwd(), 'app', 'frontend', 'models', 'static.js')
      ];

      watchPaths.forEach((watchPath) => {
        if (fs.existsSync(watchPath)) {
          server.watcher.add(watchPath);
        } else {
          logger.warn(`${watchPath} directory not found for watching`);
        }
      });

      server.watcher.on('change', async (changedPath: string) => {
        if (changedPath.endsWith('app/frontend/models/static.js')) {
          console.log('📝 Generating TypeScript definitions from OpenAPI...');
          try {
            await execAsync(
              `npx openapi-typescript ${apiRootPath}/api/info/openapi -o app/frontend/models/models.d.ts`
            );
            console.log('✅ TypeScript definitions generated successfully');
          } catch (error) {
            console.error('❌ Error generating TypeScript definitions:', error);
          }
        } else if (
          watchPaths.some((watchPath) => changedPath.startsWith(watchPath))
        ) {
          logger.info(`File changed: ${changedPath}`, {
            timestamp: true
          });
          checkUrl();
        }
      });
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
        return checkExtensions(resolvePath('rhino.config'));
      } else if (id === MODELS_STATIC_MODULE_ID) {
        // Replace 'models/static' with the path to the local file
        return checkExtensions(resolvePath('models/static'));
      } else if (id === ASSETS_MODULE_ID) {
        // Map the import to a virtual module ID
        return RESOLVED_ASSETS_MODULE_ID;
      }

      return null; // Other imports are handled as usual
    },

    load(id) {
      if (id === RESOLVED_ASSETS_MODULE_ID) {
        return `export default import.meta.glob("${intermediatePath() ? '/' + intermediatePath() : ''}/assets/**/*", { eager: true })`;
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
