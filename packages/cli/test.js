require('@babel/register')({
  presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: 'commonjs' }]],
  extensions: ['.js', '.ts'],
});
require('graphql-import-node/register');

require('./load');
