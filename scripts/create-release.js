/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { exit } = require('process');

const currentBranch = execSync('git branch --show-current').toString().trim();
if (currentBranch !== 'main') {
  console.error('Ensure create-release is ran from the main branch');
  exit(-1);
}

const cleanWorkingDirectory = execSync('git status --porcelain').toString().trim() === '';
if (!cleanWorkingDirectory) {
  console.error('Ensure clean working directory before creating release pr');
  exit(-1);
}

try {
  const commit = execSync('git rev-parse --short HEAD').toString().trim();
  execSync(`git checkout -b release-${commit}`);
  execSync(`git push -u origin release-${commit}`);

  execSync('yarn lerna version', {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
} catch (e) {
  console.log(e.message);
  exit(-1);
}
