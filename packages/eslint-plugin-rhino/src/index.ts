import type {} from '@typescript-eslint/eslint-plugin';

export { rules } from './rules';

export const configs = {
  recommended: {
    plugins: ['@rhino-project/rhino'],
    rules: {
      '@rhino-project/rhino/no-empty-actions': 'warn',
      '@rhino-project/rhino/no-hooks-get-model': 'warn'
    }
  }
};
