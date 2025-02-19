import { rules } from './rules';
import type { ESLint, Linter } from 'eslint';
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';

type RuleKey = keyof typeof rules;

export interface Plugin extends Omit<ESLint.Plugin, 'rules'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules: Record<RuleKey, RuleModule<any, any, any>>;
  configs: {
    recommended: Array<Linter.Config>;
  };
}

const plugin: Plugin = {
  meta: {
    name: '@rhino-project/eslint-plugin-rhino'
  },
  configs: {} as Plugin['configs'],
  rules
};

// Assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: {
    name: 'rhino-project/eslint-plugin-rhino/recommended',
    plugins: {
      '@rhino-project/eslint-plugin-rhino': plugin
    },
    rules: {
      '@rhino-project/eslint-plugin-rhino/no-empty-actions': 'warn',
      '@rhino-project/eslint-plugin-rhino/no-hooks-get-model': 'warn'
    }
  }
});

export default plugin;
