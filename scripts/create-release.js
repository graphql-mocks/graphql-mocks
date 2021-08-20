/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { env, exit } = require('process');

if (!env.GH_TOKEN) {
  console.error('Ensure that GH_TOKEN environment variable is set for github release');
  exit(-1);
}

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
  execSync('yarn lerna version --conventional-commits --create-release github --yes');
  execSync('git add .');
  execSync(`git commit -m "Creating release from ${commit}"`);
  execSync(`git push -u origin release-${commit}`);
} catch (e) {
  console.log(e.message);
  exit(-1);
}
