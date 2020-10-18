const process = require('process');

// TODO swap to CODE_CODE_EXAMPLE_ENV
const CODE_EXAMPLE_ENV_VAR = 'CODE_EXAMPLE_ENV';
const TEST_ENV = 'test';
const DOCS_ENV = 'docs';

const isTestEnv = () => {
  return process.env[CODE_EXAMPLE_ENV_VAR] === TEST_ENV;
};

const isDocsEnv = () => {
  return process.env[CODE_EXAMPLE_ENV_VAR] === DOCS_ENV;
};

const output = (testOutput, docsOutput) => {
  if (testOutput && isTestEnv()) return testOutput;
  if (docsOutput && isDocsEnv()) return docsOutput;
  return '';
};

module.exports = {
  output,
};
