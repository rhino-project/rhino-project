module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:deprecation/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended'
  ],
  plugins: ['react', 'react-hooks'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  globals: {
    vi: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    test: 'readonly',
    afterEach: 'readonly'
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
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
