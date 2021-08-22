require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['codegen'],
  configFile: false,
});
