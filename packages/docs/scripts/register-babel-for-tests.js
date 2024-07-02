/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

console.log('Loading babel/register with codegen plugin for doc tests...');
require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['codegen'],
  configFile: false,
  targets: {
    node: 'current',
  },
});
console.log('Finished loading babel/register');
