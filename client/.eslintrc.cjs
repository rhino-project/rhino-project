module.exports = {
  root: true,
  env: { browser: true, es2020: true, 'cypress/globals': true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:deprecation/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:@rhino-project/rhino/recommended'
  ],
  plugins: [
    'jsx-a11y',
    'react',
    'react-hooks',
    'react-refresh',
    '@tanstack/query',
    '@rhino-project/rhino'
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    // These are helper scripts that are not part of the codebase
    'copyAndReplace.js',
    'copyAndReplaceDisplay.js',
    'extractComponents.js'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      './tsconfig.json',
      './tsconfig.node.json',
      './tsconfig.cypress.json'
    ],
    tsconfigRootDir: __dirname
  },
  globals: {
    vi: 'readonly'
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended-type-checked']
    },
    {
      files: ['src/__tests__/**'],
      plugins: ['vitest', 'testing-library'],
      extends: ['plugin:vitest/recommended', 'plugin:testing-library/react']
    },
    {
      files: ['cypress/**'],
      plugins: ['cypress'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['assert', 'error', 'warn']
      }
    ],
    'no-restricted-globals': 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'react/jsx-key': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
        checkJS: true
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
