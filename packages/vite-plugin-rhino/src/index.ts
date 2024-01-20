import { Plugin } from 'vite'

export function RhinoProjectVite(): Plugin {
  return {
    name: 'vite-plugin-rhino',
    config: async () => ({
      resolve: {
        alias: [
          {
            find: '@rhino-project/rhino.config',
            replacement: 'rhino.config',
          },
        ],
      },
    }),
  }
}
