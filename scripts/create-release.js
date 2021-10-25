/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { exit } = require('process');

const currentBranch = execSync('git branch --show-current').toString().trim();
if (currentBranch !== 'main') {
  console.error('');
  console.error('***************************************************');
  console.error('');
  console.error(' Ensure create-release is ran from the main branch ');
  console.error('');
  console.error('***************************************************');
  console.error('');
  exit(-1);
}

// run yarn, if there are changes to yarn.lock then
// the clean working directory check will fail
console.log('Running yarn, to ensure no uncommitted changes to yarn.lock');
execSync('yarn', { stdio: 'ignore' });

const cleanWorkingDirectory = execSync('git status --porcelain').toString().trim() === '';
if (!cleanWorkingDirectory) {
  console.error('');
  console.error('******************************************************************');
  console.error('');
  console.error(' Error: Ensure clean working directory before creating release pr ');
  console.error('');
  console.error('******************************************************************');
  console.error('');
  exit(-1);
}

try {
  const commit = execSync('git rev-parse --short HEAD').toString().trim();
  execSync(`git checkout -b release-${commit}`);
  execSync(`git push -u origin release-${commit}`);

  execSync('yarn lerna version --no-push', {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
} catch (e) {
  console.log(e.message);
  exit(-1);
}
