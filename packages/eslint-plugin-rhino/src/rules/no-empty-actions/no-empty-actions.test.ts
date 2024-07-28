import { RuleTester } from '@typescript-eslint/rule-tester';
import { normalizeIndent } from '../../utils/test-utils';
import { rule } from './no-empty-actions.rule';

const ruleTester = new RuleTester();

ruleTester.run('no-empty-actions', rule, {
  valid: [],
  invalid: [
    {
      filename: 'rhino.config.js',
      code: normalizeIndent`
      /** @type {import('rhino/config').RhinoConfig} */

      const rhinoConfig = {
        version: 1,
        components: {
          blog: {
            ModelIndexActions: {
              props: {
                actions: []
              }
            },
          }
        }
      };
      
      export default rhinoConfig;
      `,
      output: normalizeIndent`
      /** @type {import('rhino/config').RhinoConfig} */

      const rhinoConfig = {
        version: 1,
        components: {
          blog: {
            ModelIndexActions: null,
          }
        }
      };
      
      export default rhinoConfig;
      `,
      errors: [
        {
          messageId: 'emptyActions'
        }
      ]
    }
  ]
});
