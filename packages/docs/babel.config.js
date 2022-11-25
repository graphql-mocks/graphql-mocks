module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 16 } }], require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: ['codegen'],
};
