import { Plugin } from 'vite'

export function RhinoProjectVite(): Plugin {
  return {
    name: 'vite-plugin-rhino',
    config: async () => ({
      optimizeDeps: {
        // Don't process with esbuild so that we can use resolveId for rhino.config
        exclude: ['@rhino-project/config'],
      },
    }),
  }
}
