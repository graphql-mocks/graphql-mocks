import { expect, test } from '@oclif/test';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import { resolve } from 'path';
import { backup, writeInvalidSchema } from '../../test-helpers/file';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';

describe('schema:info', () => {
  const testPackage = 'test-package';
  const packagePath = testPackagePath(testPackage);

  describe('when the schema is specified by the --schema flag', () => {
    const schemaFilePath = resolve(packagePath, 'graphql-mocks/schema.graphql');

    test
      .stdout()
      .command(['schema:info', '--schema', schemaFilePath])
      .it('shows info about the schema', (ctx) => {
        expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/graphql-mocks/schema.graphql');
        expect(ctx.stdout).to.contain('✅ No errors');
        expect(ctx.stdout).to.contain('Query');
      });

    const errorSchemaFile = resolve(tmpdir(), 'error-schema.graphql');
    test
      .stdout()
      .do(() => {
        writeInvalidSchema(errorSchemaFile);
      })
      .command(['schema:info', '--schema', errorSchemaFile])
      .it('shows an error when the schema is invalid', (ctx) => {
        expect(ctx.stdout).to.contain('error-schema.graphql');
        expect(ctx.stdout).to.contain('Syntax Error: Expected Name, found "}"');
      });
  });

  describe('within a project with a graphql config', () => {
    const packageSchemaFile = resolve(packagePath, 'graphql-mocks/schema.graphql');
    backup(packageSchemaFile, { eachTest: true });
    useTestPackage(testPackage, { eachTest: true });

    test
      .stdout()
      .command(['schema:info'])
      .it('shows info about the schema', (ctx) => {
        expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/graphql-mocks/schema.graphql');
        expect(ctx.stdout).to.contain('✅ No errors');
        expect(ctx.stdout).to.contain('Query');
      });

    test
      .stdout()
      .do(() => {
        writeInvalidSchema(packageSchemaFile);
      })
      .command(['schema:info'])
      .it('shows an error when the schema is invalid', (ctx) => {
        expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/graphql-mocks/schema.graphql');
        expect(ctx.stdout).to.contain('Syntax Error: Expected Name, found "}"');
      });
  });
});
