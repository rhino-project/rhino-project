import { TSESTree } from '@typescript-eslint/utils'
import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils'

type Create = Parameters<
  ReturnType<typeof ESLintUtils.RuleCreator>
>[0]['create']

type Context = Parameters<Create>[0]
type Options = Parameters<Create>[1]
type Helpers = {
  isSpecificRhinoImport: (node: TSESTree.Identifier, source: string) => boolean
  isRhinoImport: (node: TSESTree.Identifier) => boolean
}

export type EnhancedCreate = (
  context: Context,
  options: Options,
  helpers: Helpers,
) => ReturnType<Create>

export function detectRhinoImports(create: EnhancedCreate): Create {
  return (context, optionsWithDefault) => {
    const rhinoImportSpecifiers: Array<TSESTree.ImportClause> = []

    const helpers: Helpers = {
      isSpecificRhinoImport(node, source) {
        return !!rhinoImportSpecifiers.find((specifier) => {
          if (
            specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier &&
            specifier.parent?.type ===
              TSESTree.AST_NODE_TYPES.ImportDeclaration &&
            specifier.parent.source.value === source
          ) {
            return node.name === specifier.local.name
          }

          return false
        })
      },
      isRhinoImport(node) {
        return !!rhinoImportSpecifiers.find((specifier) => {
          if (specifier.type === TSESTree.AST_NODE_TYPES.ImportSpecifier) {
            return node.name === specifier.local.name
          }

          return false
        })
      },
    }

    const detectionInstructions: TSESLint.RuleListener = {
      ImportDeclaration(node) {
        if (
          node.specifiers.length > 0 &&
          node.importKind === 'value' &&
          node.source.value.includes('rhino')
        ) {
          rhinoImportSpecifiers.push(...node.specifiers)
        }
      },
    }

    // Call original rule definition
    const ruleInstructions = create(context, optionsWithDefault, helpers)
    const enhancedRuleInstructions: TSESLint.RuleListener = {}

    const allKeys = new Set(
      Object.keys(detectionInstructions).concat(Object.keys(ruleInstructions)),
    )

    // Iterate over ALL instructions keys so we can override original rule instructions
    // to prevent their execution if conditions to report errors are not met.
    allKeys.forEach((instruction) => {
      enhancedRuleInstructions[instruction] = (node) => {
        if (instruction in detectionInstructions) {
          detectionInstructions[instruction]?.(node)
        }

        // TODO: canReportErrors()
        if (ruleInstructions[instruction]) {
          return ruleInstructions[instruction]?.(node)
        }

        return undefined
      }
    })

    return enhancedRuleInstructions
  }
}
