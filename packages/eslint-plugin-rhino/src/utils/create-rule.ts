import { ESLintUtils } from '@typescript-eslint/utils'
import { detectRhinoImports } from './detect-rhino-imports'
import type { EnhancedCreate } from './detect-rhino-imports'

const getDocsUrl = (ruleName: string): string =>
  `https://www.rhino-project.org/docs/reference/front_end/eslint#${ruleName}`

type EslintRule = Omit<
  Parameters<ReturnType<typeof ESLintUtils.RuleCreator>>[0],
  'create'
> & {
  create: EnhancedCreate
}

export function createRule({ create, ...rest }: EslintRule) {
  return ESLintUtils.RuleCreator(getDocsUrl)({
    ...rest,
    create: detectRhinoImports(create),
  })
}
