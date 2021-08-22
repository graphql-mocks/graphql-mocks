module.exports = {
  presets: ['@babel/preset-env', require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: ['codegen', '@babel/plugin-transform-modules-commonjs'],
};
