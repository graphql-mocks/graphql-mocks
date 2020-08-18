module.exports = {
  parser: '@typescript-eslint/parser',

  env: {
    es2017: true,
    'shared-node-browser': true,
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:mocha/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  plugins: ['mocha'],

  rules: {
    'mocha/no-hooks-for-single-case': 'off'
  },
};
