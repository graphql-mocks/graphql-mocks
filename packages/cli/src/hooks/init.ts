// load node registers to support dynamically loading and parsing
// typescript and graphql files

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@babel/register')({
    presets: ['@babel/preset-typescript', ['@babel/preset-env', { modules: 'commonjs' }]],
    extensions: ['.js', '.ts'],
  });

  require('graphql-import-node/register');
};
