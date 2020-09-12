module.exports = {
  extends: [
    '../../../.eslintrc',
    'plugin:mocha/recommended'
  ],


  plugins: ['mocha'],

  env: {
    mocha: true,
    es2017: true,
    'shared-node-browser': true,
  },

  rules: {
    'mocha/no-hooks-for-single-case': 'off'
  }
};
