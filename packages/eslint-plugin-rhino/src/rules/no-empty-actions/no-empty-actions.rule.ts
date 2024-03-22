// File: rules/no-empty-actions.ts
import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

const RuleCreator = ESLintUtils.RuleCreator(
  (name) => `https://yourdomain.com/rules/${name}`
);

export const rule = RuleCreator({
  name: 'no-empty-actions',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow empty actions array for model configurations',
      recommended: 'warn'
    },
    fixable: 'code',
    schema: [],
    hasSuggestions: true,
    messages: {
      emptyActions:
        '{{ name }} should be set to null instead of an empty actions array'
    }
  },
  defaultOptions: [],
  create(context) {
    const filename = context.getFilename();
    if (!filename.endsWith('rhino.config.js')) {
      // If the filename does not match, don't apply the rule
      return {};
    }

    return {
      Property(node: TSESTree.Property) {
        const targetKeys = [
          'ModelIndexActions',
          'ModelEditActions',
          'ModelShowActions',
          'ModelCreateActions'
        ];
        if (
          node.key.type === 'Identifier' &&
          targetKeys.includes(node.key.name) &&
          node.value.type === 'ObjectExpression'
        ) {
          const propsProperty = node.value.properties.find(
            (property): property is TSESTree.Property =>
              property.type === 'Property' &&
              property.key.type === 'Identifier' &&
              property.key.name === 'props'
          );

          if (
            propsProperty &&
            propsProperty.value.type === 'ObjectExpression'
          ) {
            const actionsProperty = propsProperty.value.properties.find(
              (property): property is TSESTree.Property =>
                property.type === 'Property' &&
                property.key.type === 'Identifier' &&
                property.key.name === 'actions'
            );

            if (
              actionsProperty &&
              actionsProperty.value.type === 'ArrayExpression' &&
              actionsProperty.value.elements.length === 0
            ) {
              context.report({
                node: node,
                messageId: 'emptyActions',
                data: {
                  name: node.key.name
                },
                fix(fixer) {
                  return node.key.type === 'Identifier'
                    ? fixer.replaceText(node, `${node.key.name}: null`)
                    : null;
                },
                suggest: [
                  // Provide suggestions array
                  {
                    messageId: 'emptyActions',
                    fix(fixer) {
                      return node.key.type === 'Identifier'
                        ? fixer.replaceText(node, `${node.key.name}: null`)
                        : null;
                    }
                  }
                ]
              });
            }
          }
        }
      }
    };
  }
});
