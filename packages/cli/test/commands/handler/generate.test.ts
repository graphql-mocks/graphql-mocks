import { test } from '@oclif/test';
import { expect } from 'chai';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';
import { backup } from '../../test-helpers/file';
import { resolve } from 'path';
import { existsSync, unlinkSync as rm, writeFileSync } from 'fs';
import { tmpdir } from 'os';

describe('handler/generate', function () {
  describe('within a package with a gqlmocks config and handler.path entry', () => {
    const testPackage = 'test-package';
    useTestPackage(testPackage, { eachTest: true });

    const testPackageDir = testPackagePath(testPackage);
    const packageHandlerFile = resolve(testPackageDir, 'graphql-mocks/handler.ts');
    backup(packageHandlerFile, { eachTest: true });

    beforeEach(() => {
      rm(packageHandlerFile);
    });

    test
      .stdout()
      .command(['handler:generate'])
      .it('generates a handler within a project', (ctx) => {
        expect(existsSync(packageHandlerFile)).to.be.true;
        expect(ctx.stdout).includes('✅ Wrote handler file');
      });

    test
      .stdout()
      .do(() => {
        writeFileSync(packageHandlerFile, '');
      })
      .command(['handler:generate'])
      .catch((e) => expect(e.message).includes('Bailing, file already exists'))
      .it('throws an error when the handler file already exists');

    test
      .stdout()
      .do(() => {
        writeFileSync(packageHandlerFile, '');
      })
      .command(['handler:generate', '--force'])
      .it('overwrites the handler file with --force', (ctx) => {
        expect(existsSync(packageHandlerFile)).to.be.true;
        expect(ctx.stdout).includes('✅ Wrote handler file');
      });
  });

  describe('specifying the output location with the --save-handler flag', () => {
    const outHandlerPath = resolve(tmpdir(), 'test-graphql-handler.js');

    beforeEach(() => {
      if (existsSync(outHandlerPath)) {
        rm(outHandlerPath);
      }
    });

    test
      .stdout()
      .command(['handler:generate', '--save-handler', outHandlerPath])
      .it('generates a handler at the path specified by the --save-handler flag', (ctx) => {
        expect(existsSync(outHandlerPath)).to.be.true;
        expect(ctx.stdout).includes('✅ Wrote handler file');
      });

    test
      .stdout()
      .do(() => {
        writeFileSync(outHandlerPath, '');
      })
      .command(['handler:generate', '--save-handler', outHandlerPath])
      .catch((e) => expect(e.message).includes('Bailing, file already exists'))
      .it('shows an error when the file already exists');

    test
      .stdout()
      .do(() => {
        writeFileSync(outHandlerPath, '');
      })
      .command(['handler:generate', '--save-handler', outHandlerPath, '--force'])
      .it('overwrites the handler file with --force', (ctx) => {
        expect(existsSync(outHandlerPath)).to.be.true;
        expect(ctx.stdout).includes('✅ Wrote handler file');
      });
  });
});
