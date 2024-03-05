module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true },
  parserOptions: {
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['.eslintrc.cjs']
};
