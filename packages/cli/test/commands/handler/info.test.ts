import { test } from '@oclif/test';
import { expect } from 'chai';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';
import { resolve } from 'path';
import { copyFileSync, existsSync, unlinkSync as rm } from 'fs';

describe('handler/info', function () {
  const testPackage = 'test-package';
  const testPackageDir = testPackagePath(testPackage);
  const packageHandlerFile = resolve(testPackageDir, 'graphql-mocks/handler.js');

  describe('within a package with a gqlmocks config and handler.path entry', () => {
    useTestPackage(testPackage, { eachTest: true });

    test
      .stdout()
      .command(['handler:info'])
      .it('outputs info about the handler', (ctx) => {
        expect(ctx.stdout).includes('test-helpers/test-package/graphql-mocks/handler.js');
        expect(ctx.stdout).includes('✅ No errors.');
      });
  });

  describe('specifying the location with the --handler flag', () => {
    const tempHandlerFile = resolve(testPackageDir, 'graphql-mocks/test-graphql-handler.ts');

    before(() => {
      if (existsSync(tempHandlerFile)) {
        rm(tempHandlerFile);
      }

      copyFileSync(packageHandlerFile, tempHandlerFile);
    });

    after(() => {
      rm(tempHandlerFile);
    });

    test
      .stdout()
      .command(['handler:info', '--handler', tempHandlerFile])
      .it('outputs info about the handler', (ctx) => {
        expect(ctx.stdout).includes('test/test-helpers/test-package/graphql-mocks/test-graphql-handler.ts');
        expect(ctx.stdout).includes('✅ No errors.');
      });
  });
});
