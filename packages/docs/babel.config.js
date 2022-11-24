module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 16 }, modules: 'commonjs' }],
    require.resolve('@docusaurus/core/lib/babel/preset'),
  ],
  plugins: ['codegen', '@babel/plugin-transform-modules-commonjs'],
};
