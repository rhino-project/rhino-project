import { Plugin } from 'vite'
import path from 'path'

export function RhinoProjectVite(): Plugin {
  return {
    name: 'vite-plugin-rhino',
    config: () => ({
      optimizeDeps: {
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: ['@rhino-project/config'],
      },
    }),
    resolveId(source) {
      if (source === 'rhino.config') {
        // Replace 'rhino.config' with the path to the local file
        // FIXME: Allow the location to be configured
        return path.resolve(__dirname, 'src/rhino.config.js')
      }
      return null // Other imports are handled as usual
    },
  }
}
