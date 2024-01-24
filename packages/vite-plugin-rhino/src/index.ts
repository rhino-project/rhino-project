import path from 'path'
import { Plugin, ResolvedConfig } from 'vite'

const CONFIG_MODULE_ID = 'rhino.config'

const ENV_MODULE_ID = 'virtual:@rhino-project/config/env'
const RESOLVED_ENV_MODULE_ID = '\0' + ENV_MODULE_ID

export function RhinoProjectVite(): Plugin {
  let CONFIG: ResolvedConfig

  return {
    name: 'vite-plugin-rhino',
    config: () => ({
      optimizeDeps: {
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: ['@rhino-project/config'],
      },
    }),

    configResolved(vite) {
      CONFIG = vite
    },

    resolveId(id) {
      if (id === CONFIG_MODULE_ID) {
        // Replace 'rhino.config' with the path to the local file
        // FIXME: Allow the location to be configured
        return path.join(CONFIG.root, 'src/rhino.config.js')
      } else if (id === ENV_MODULE_ID) {
        // Map the import to a virtual module ID
        return RESOLVED_ENV_MODULE_ID
      }

      return null // Other imports are handled as usual
    },

    load(id) {
      if (id === RESOLVED_ENV_MODULE_ID) {
        let envExports = `export const env = {`
        Object.keys(CONFIG.env).forEach((key) => {
          const baseKey = key.replace(/^VITE_/, '')

          envExports = envExports + `${baseKey}: import.meta.env.${key},`
        })
        envExports = envExports + `}`

        console.log('Vite Config in load hook:', envExports)

        return envExports
      }

      return null
    },
  }
}
