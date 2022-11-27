module.exports = {
  presets: [['@babel/preset-env', { modules: 'commonjs', targets: { node: 16 } }], require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: ['codegen'],
};
