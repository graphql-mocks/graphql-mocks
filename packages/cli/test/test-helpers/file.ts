import { existsSync, copyFileSync } from 'fs';
import { tmpdir } from 'os';
import { resolve, parse } from 'path';
import { before, after, beforeEach, afterEach } from 'mocha';

export function backup(file: string | string[], { eachTest } = { eachTest: false }): () => void {
  const _before = eachTest ? beforeEach : before;
  const _after = eachTest ? afterEach : after;

  const tempDir = tmpdir();

  const backupFilePath = (file: string) => resolve(tempDir, file);

  const backupFile = (file: string) => {
    const { base: filename } = parse(file);
    if (!existsSync(file)) {
      throw Error(`${file} does not exist, cannot backup`);
    }

    copyFileSync(file, backupFilePath(filename));
  };

  const restoreFile = (file: string) => {
    const { base: filename } = parse(file);
    copyFileSync(backupFilePath(filename), file);
  };

  function restoreAll() {
    const files = Array.isArray(file) ? file : [file];
    files.forEach((file) => restoreFile(file));
  }

  _before(() => {
    const files = Array.isArray(file) ? file : [file];
    files.forEach((file) => backupFile(file));
  });

  _after(restoreAll);

  return restoreAll;
}
