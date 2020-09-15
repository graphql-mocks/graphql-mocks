/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs-extra');
const process = require('process');

function cleanPackageJson(pjson) {
  const copy = {
    ...pjson,
  };

  delete copy.devDependencies;
  delete copy.scripts;

  return copy;
}

// assumes all packages are going to be putting their
// compiled output in `dist`
const DIST_DIR = 'dist';

const copyPackageJson = async () => {
  console.log(`Copying clean package.json to dist...`);
  const root = path.resolve(process.cwd());

  const packageJson = path.resolve(root, './package.json');
  if (!fs.existsSync(packageJson)) {
    console.error('[!] no package.json found, ensure script is ran from the package root');
    return;
  }

  const pkg = require(packageJson);
  const cleanedPjson = cleanPackageJson(pkg);

  const targetDir = path.resolve(root, DIST_DIR);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirpSync(targetDir);
  }

  const targetPjsonPath = path.resolve(targetDir, 'package.json');
  await fs.writeFile(targetPjsonPath, JSON.stringify(cleanedPjson, null, 2) + '\n');
};

(async () => {
  await copyPackageJson();
})();
