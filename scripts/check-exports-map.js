/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const process = require('process');
const path = require('path');
const { strict: assert } = require('assert');
const { existsSync } = require('fs');

async function checkExportsMap() {
  const { globby } = await import('globby');
  const root = path.resolve(process.cwd());
  const distDir = path.resolve(root, 'dist');
  const pjsonFile = path.resolve(distDir, 'package.json');

  assert(existsSync(distDir), 'dist directory exists');
  assert(existsSync(pjsonFile), 'dist package.json exists');

  const pjson = require(pjsonFile);

  let exportMapIndexFiles = [];
  Object.entries(pjson.exports).forEach(([importPath, moduleTypeMap]) => {
    assert.ok(moduleTypeMap.import, `has "import" entry for "${importPath}"`);
    assert.ok(moduleTypeMap.require, `has "require" entry for "${importPath}"`);

    let expectedRequireIndex = path.resolve(distDir, importPath, 'index.js');
    let expectedImportIndex = path.resolve(distDir, importPath, '/es/', 'index.js');

    assert.ok(existsSync(expectedRequireIndex), `"require" file ${expectedRequireIndex} exsits at expected location`);
    assert.ok(existsSync(expectedImportIndex), `"import" file ${expectedImportIndex} exsits at expected location`);

    exportMapIndexFiles.push(expectedRequireIndex, expectedImportIndex);
  });

  const onDiskIndexFiles = await globby(distDir, {
    expandDirectories: {
      files: ['index.js'],
    },
  });

  assert.deepEqual(
    exportMapIndexFiles.sort(),
    onDiskIndexFiles.sort(),
    'export map index files sand on disk index files match',
  );
}

checkExportsMap().catch(e => {
  console.error('exports map check failed:');
  console.error(e);
});
