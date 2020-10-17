module.exports = {
  parser: '@typescript-eslint/parser',

  env: {
    es2017: true,
    'shared-node-browser': true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint'],

  rules: {
    'no-dupe-class-members': 'off',
  },
};
