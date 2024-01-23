import { tanstackBuildConfig } from '@tanstack/config/build'
import { defineConfig, mergeConfig } from 'vitest/config'

const config = defineConfig({
  build: {
    rollupOptions: {
      external: ['rhino.config'],
      output: {
        preserveModulesRoot: 'src',
      },
    },
  },
})

export default mergeConfig(
  config,
  tanstackBuildConfig({
    entry: './src/index.ts',
    srcDir: './src',
  }),
)
