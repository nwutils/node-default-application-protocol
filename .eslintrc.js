module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    jsdom: true,
    Promise: true,
    nw: true
  },
  plugins: [
    'jest'
  ],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'tjw-base'
  ],
  rules: {
    'no-restricted-syntax': [
      'error',
      'Property[method="true"]'
    ]
  }
};
