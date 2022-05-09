import { existsSync } from 'fs';
import { resolve } from 'path';
import { restoreCwd, setMockCwd } from '../../src/lib/cwd';
import { before, after, beforeEach, afterEach } from 'mocha';

// sets up the command internally to use the cwd as if it's being
// using the test-package
export function useTestPackage(packageFolder: string, { eachTest } = { eachTest: false }): () => void {
  let disabled = false;

  const _before = eachTest ? beforeEach : before;
  const _after = eachTest ? afterEach : after;

  _before(() => {
    if (!disabled) {
      setMockCwd(testPackagePath(packageFolder));
    }
  });

  _after(() => {
    if (!disabled) {
      restoreCwd();
    }
  });

  return function disable() {
    disabled = true;
    restoreCwd();
  };
}

export function testPackagePath(packageFolder: string): string {
  const path = resolve(__dirname, packageFolder);
  if (!existsSync(path)) {
    throw new Error(`test package does not exist at ${path}`);
  }

  return path;
}
