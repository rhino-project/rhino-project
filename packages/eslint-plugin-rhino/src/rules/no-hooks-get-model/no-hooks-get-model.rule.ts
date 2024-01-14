import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createRule } from '../../utils/create-rule'
import { ASTUtils } from '../../utils/ast-utils'

export const name = 'no-hooks-get-model'

const queryHooks = [
  'useModelIndex',
  'useModelCreate',
  'useModelUpdate',
  'useModelDelete',
]

export const rule = createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "suggest replacing `getModel('...')` with `'...'` for hooks.",
      recommended: 'warn',
    },
    messages: {
      replaceGetModel:
        "Replace `getModel('...'))` usage with direct string usage for hooks.",
    },
    hasSuggestions: true,
    fixable: 'code', // Indicates that the rule is automatically fixable
    schema: [], // no options
  },
  defaultOptions: [],

  create(context, _, helpers) {
    return {
      CallExpression(node) {
        if (
          !ASTUtils.isIdentifierWithOneOfNames(node.callee, queryHooks) ||
          node.parent?.type !== AST_NODE_TYPES.VariableDeclarator
        ) {
          return
        }
        const firstArgument = node.arguments[0]

        // Check if the first argument is a `getModel` call
        if (
          !(
            firstArgument &&
            firstArgument.type === 'CallExpression' &&
            firstArgument.callee.type === 'Identifier' &&
            firstArgument.callee.name === 'getModel'
          ) ||
          !helpers.isRhinoImport(firstArgument.callee)
        ) {
          return
        }
        // Ensure `getModel` is called with a string literal
        const getModelArg = firstArgument.arguments[0]
        if (
          !(
            getModelArg &&
            getModelArg.type === 'Literal' &&
            typeof getModelArg.value === 'string'
          )
        ) {
          return
        }

        context.report({
          node: node,
          messageId: 'replaceGetModel',
          suggest: [
            {
              messageId: 'replaceGetModel',
              fix(fixer) {
                const sourceCode = context.getSourceCode()
                const getModelText = sourceCode.getText(getModelArg)
                let replacementText = `useModelIndex(${getModelText}`

                if (node.arguments.length > 1) {
                  // Include additional arguments, correctly handling commas
                  const argsAfterGetModel = sourceCode.text
                    .slice(firstArgument.range[1], node.range[1])
                    .trim()

                  const additionalArgs = argsAfterGetModel.startsWith(',')
                    ? argsAfterGetModel
                    : ', ' + argsAfterGetModel

                  replacementText += additionalArgs
                } else {
                  replacementText += ')'
                }

                return fixer.replaceText(node, replacementText)
              },
            },
          ],
        })
      },
    }
  },
})
