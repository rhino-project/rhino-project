import js from '@eslint/js';
import globals from 'globals';
import cypress from 'eslint-plugin-cypress/flat';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      ...tseslint.configs.recommended
    ],
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'always' }
      ],
      'no-console': [
        'warn',
        {
          allow: ['assert', 'error', 'warn']
        }
      ],
      'no-restricted-globals': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'react/prop-types': 'off',
      ...reactHooks.configs.recommended.rules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettier,
  {
    files: ['src/__tests__/**/*.{ts,tsx,js,jsx}'],
    ...testingLibrary.configs['flat/react']
  },
  {
    files: ['app/frontend/__tests__/**'], // or any other pattern
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules
    }
  },
  cypress.configs.recommended
);
