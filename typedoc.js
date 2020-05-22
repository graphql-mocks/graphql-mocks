module.exports = {
  inputFiles: ['./src'],
  mode: 'modules',
  out: './documentation/docs/typedoc',
  plugins: ['markdown'],
  theme: 'docusaurus2',
  excludePrivate: true,
  excludeNotExported: true,
};
