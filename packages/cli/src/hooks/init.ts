module.exports = async function () {
  // load babel to support dynamically loading and parsing
  // typescript and graphql files
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@babel/register')({
    plugins: ['import-graphql'],
    presets: ['@babel/preset-typescript'],
    extensions: ['.ts', '.graphql', '.gql'],
  });
};
