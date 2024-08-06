/* eslint-disable no-undef */

const process = require('process');
const path = require('path');
const { strict: assert } = require('assert');
const { existsSync } = require('fs');

const CJS_INDEX_FILE = 'index.js';
const MJS_INDEX_FILE = 'index.mjs';
const TYPES_INDEX_FILE = 'index.d.ts';

async function checkExportsMap() {
  console.log('🕵️   package.json exports map check start...');

  const { globby } = await import('globby');
  const root = path.resolve(process.cwd());
  const distDir = path.resolve(root, 'dist');
  const pjsonFile = path.resolve(distDir, 'package.json');

  assert(existsSync(distDir), 'dist directory exists');
  assert(existsSync(pjsonFile), 'dist package.json exists');

  const pjson = require(pjsonFile);
  assert.ok(pjson.exports, 'exports property exists in package.json');
  assert.ok(Object.keys(pjson.exports).length > 0, 'exports map has at least one entry');

  let exportMapIndexFiles = [];
  Object.entries(pjson.exports).forEach(([importPath, moduleTypeMap]) => {
    assert.ok(moduleTypeMap.import, `has "import" entry for "${importPath}"`);
    assert.ok(moduleTypeMap.require, `has "require" entry for "${importPath}"`);

    let expectedRequireIndex = path.resolve(distDir, importPath, CJS_INDEX_FILE);
    let expectedImportIndex = path.resolve(distDir, 'es', importPath, MJS_INDEX_FILE);
    let expectedTypesIndex = path.resolve(distDir, importPath, TYPES_INDEX_FILE);
    assert.ok(existsSync(expectedRequireIndex), `"require" file ${expectedRequireIndex} exsits at expected location`);
    assert.ok(existsSync(expectedImportIndex), `"import" file ${expectedImportIndex} exsits at expected location`);
    assert.ok(existsSync(expectedTypesIndex), `"types" file ${expectedTypesIndex} exsits at expected location`);

    let expectedModuleTypeMapRequire = './' + path.join(importPath, CJS_INDEX_FILE);
    let expectedModuleTypeMapImport = './' + path.join('es', importPath, MJS_INDEX_FILE);
    let expectedModuleTypeMapTypes = './' + path.join(importPath, TYPES_INDEX_FILE);

    assert.equal(moduleTypeMap.require, expectedModuleTypeMapRequire);
    assert.equal(moduleTypeMap.import, expectedModuleTypeMapImport);
    assert.equal(moduleTypeMap.types, expectedModuleTypeMapTypes);
    exportMapIndexFiles.push(expectedRequireIndex, expectedImportIndex, expectedTypesIndex);
  });

  const onDiskIndexJavascriptFiles = await globby(distDir, {
    expandDirectories: {
      files: [MJS_INDEX_FILE, CJS_INDEX_FILE],
    },
  });

  const onDiskIndexTypesFiles = (
    await globby(distDir, {
      ignore: ['es'],
      expandDirectories: {
        files: [TYPES_INDEX_FILE],
      },
    })
  )
    // purposefully exclude checking additional es-module .d.ts files
    .filter((filepath) => !filepath.startsWith(path.join(distDir, 'es')));

  const onDiskIndexFiles = [...onDiskIndexJavascriptFiles, ...onDiskIndexTypesFiles];

  const missingExportMapIndexFiles = exportMapIndexFiles.filter((file) => !onDiskIndexFiles.includes(file));
  const missingOnDiskIndexFiles = onDiskIndexFiles.filter((file) => !exportMapIndexFiles.includes(file));
  const pretty = (obj) => JSON.stringify(obj, null, 2);

  assert.equal(
    missingExportMapIndexFiles.length,
    0,
    `None missing in export map index files:\n${pretty(missingExportMapIndexFiles)}`,
  );
  assert.equal(
    missingOnDiskIndexFiles.length,
    0,
    `None missing on disk index files:\n${pretty(missingOnDiskIndexFiles)}`,
  );

  console.log('🎉  package.json exports map done!');
}

checkExportsMap().catch((e) => {
  console.error('**************************');
  console.error(' EXPORTS MAP CHECK FAILED ');
  console.error('**************************');
  console.error(e);
});
