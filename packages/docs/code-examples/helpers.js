const process = require('process');

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
  if (isTestEnv()) {
    return testOutput != null ? testOutput : '';
  } else if (isDocsEnv()) {
    return docsOutput != null ? docsOutput : '';
  } else {
    throw new Error(
      `No CODE_EXAMPLE_ENV environment variable set. Valid options are 'docs' or 'test'.
      Use docs when running documentation and test when running tests`,
    );
  }
};

module.exports = {
  output,
};
