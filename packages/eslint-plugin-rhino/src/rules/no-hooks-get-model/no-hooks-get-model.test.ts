import { ESLintUtils } from '@typescript-eslint/utils';
import { normalizeIndent } from '../../utils/test-utils';
import { rule } from './no-hooks-get-model.rule';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  settings: {}
});

ruleTester.run('no-hooks-get-model', rule, {
  valid: [
    {
      name: 'should pass when model is a string',
      code: normalizeIndent`
      import { getModel } from '../../rhino/utils/models';
      const { model } = useModelIndex("model", { queryOptions: { disabled: true } });
      `
    },
    {
      name: 'should not fail when getModel is used without rhino import',
      code: normalizeIndent`
      import { getModel } from 'other-package';

      const { model } = useModelIndex(getModel("model"), { queryOptions: { disabled: true } });
      `
    }
  ],
  invalid: [
    {
      name: 'should fail when getModel is used',
      code: normalizeIndent`
      import { getModel } from '../../rhino/utils/models';

      const { model } = useModelIndex(getModel("model"), { queryOptions: { disabled: true } });
      `,
      errors: [
        {
          messageId: 'replaceGetModel',
          suggestions: [
            {
              messageId: 'replaceGetModel',
              output: normalizeIndent`
                import { getModel } from '../../rhino/utils/models';

                const { model } = useModelIndex("model", { queryOptions: { disabled: true } });
                `
            }
          ]
        }
      ]
    }
  ]
});
