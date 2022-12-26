/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const fs = require('fs-extra');
const process = require('process');

function removeDist(path) {
  if (typeof path !== 'string') {
    return path;
  }

  if (path.startsWith('dist/')) {
    return path.replace('dist/', '');
  }

  if (path.startsWith('./dist/')) {
    return path.replace('./dist/', './');
  }

  return path;
}

function cleanPackageJson(pjson) {
  const copy = {
    ...pjson,
  };

  delete copy.devDependencies;
  delete copy.scripts;
  delete copy.publishConfig;

  copy.main = removeDist(copy.main);
  copy.module = removeDist(copy.module);
  copy.types = removeDist(copy.types);

  Object.values(copy.exports).forEach((map) => {
    if (map.require) {
      map.require = removeDist(map.require);
    }

    if (map.import) {
      map.import = removeDist(map.import);
    }
  });

  return copy;
}

function checkEntryPoints(dir, pjson) {
  const entryPoints = ['main', 'module', 'types'];

  entryPoints.forEach((entryPoint) => {
    const entryPointRelativePath = pjson[entryPoint];

    if (!entryPointRelativePath) {
      return;
    }

    const entryPointPath = path.resolve(dir, entryPointRelativePath);

    if (!fs.existsSync(entryPointPath)) {
      console.error('**************************');
      console.error('FAILED TO FIND ENTRY POINT');
      console.error('**************************');
      console.error(`Entry point ${entryPoint} does not exist at: ${entryPointPath}`);
      process.exit(1);
    }
  });
}

// assumes all packages are going to be putting their
// compiled output in `dist`
const DIST_DIR = 'dist';

const copyPackageJson = async () => {
  console.log(`starting copying clean package.json to dist...`);
  const root = path.resolve(process.cwd());

  const packageJson = path.resolve(root, './package.json');
  if (!fs.existsSync(packageJson)) {
    console.error('[!] no package.json found, ensure script is ran from the package root');
    return;
  }

  const pkg = require(packageJson);
  const cleanedPkg = cleanPackageJson(pkg);

  const targetDir = path.resolve(root, DIST_DIR);
  console.log('checking entry points on package.json...');
  checkEntryPoints(targetDir, cleanedPkg);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirpSync(targetDir);
  }

  const targetPjsonPath = path.resolve(targetDir, 'package.json');
  await fs.writeFileSync(targetPjsonPath, JSON.stringify(cleanedPkg, null, 2) + '\n');
  console.log('finished copying cleaned package.json');
};

(async () => {
  await copyPackageJson();
})();
