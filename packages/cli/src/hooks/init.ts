// load node registers to support dynamically loading and parsing
// typescript and graphql files

module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@babel/register')({
    presets: ['@babel/preset-typescript', ['@babel/preset-env', { targets: { node: 16 }, modules: 'cjs' }]],
    plugins: ['@babel/plugin-proposal-class-properties'],
    // ignore with an empty array is key for allowing transpilation outside of
    // the current working directory. This is needed because the cli makes
    // use of putting files in tmp directories and sometimes needs to require
    // them from there and they might be in a .ts format
    // see https://github.com/babel/babel/issues/8321
    ignore: [],
    extensions: ['.js', '.ts'],
  });

  require('graphql-import-node/register');
};
