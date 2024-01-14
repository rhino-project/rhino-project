import { rules } from './rules'
import type { TSESLint } from '@typescript-eslint/utils'

function generateRecommendedConfig(
  allRules: Record<string, TSESLint.RuleModule<any, any>>,
) {
  return Object.entries(allRules).reduce(
    (memo, [name, rule]) => {
      const { recommended } = rule.meta.docs || {}

      return {
        ...memo,
        ...(recommended
          ? { [`@rhino-project/rhino/${name}`]: recommended }
          : {}),
      }
    },
    {} as Record<string, 'strict' | 'error' | 'warn'>,
  )
}

export const configs = {
  recommended: {
    plugins: ['@rhino-project/eslint-plugin-rhino'],
    rules: generateRecommendedConfig(rules),
  },
}
