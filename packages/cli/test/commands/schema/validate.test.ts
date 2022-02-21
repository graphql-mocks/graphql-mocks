import { expect, test } from '@oclif/test';
import { describe } from 'mocha';
import { tmpdir } from 'os';
import { resolve } from 'path';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';
import { backup, writeInvalidSchema } from '../../test-helpers/file';


describe('schema:validate', () => {
  const testPackage = 'test-package';
  const packagePath = testPackagePath(testPackage);

  describe('when the schema is specified by the --schema flag', () => {
    const schemaFilePath = resolve(packagePath, 'graphql-mocks/schema.graphql');

    test
      .stdout()
      .command(['schema:validate', '--schema', schemaFilePath])
      .it('validates the schema', (ctx) => {
        expect(ctx.stdout).to.contain('✅ Schema is valid.');
      });

    const errorSchemaFile = resolve(tmpdir(), 'error-schema.graphql');
    test
      .stdout()
      .do(() => {
        writeInvalidSchema(errorSchemaFile);
      })
      .command(['schema:validate', '--schema', errorSchemaFile])
      .catch((e) => {
        expect(e.message).to.contain('❌ Invalid schema.');
        expect(e.message).to.contain('Syntax Error: Expected Name, found "}"');
      })
      .it('shows an error when the schema is invalid');
  });

  describe('within a project with a graphql config', () => {
    const packageSchemaFile = resolve(packagePath, 'graphql-mocks/schema.graphql');
    useTestPackage(testPackage, { eachTest: true });
    backup(packageSchemaFile, { eachTest: true });

    test
      .stdout()
      .command(['schema:validate'])
      .it('validates the schema', (ctx) => {
        expect(ctx.stdout).to.contain('✅ Schema is valid.');
      });

    test
      .stdout()
      .do(() => {
        writeInvalidSchema(packageSchemaFile);
      })
      .command(['schema:validate'])
      .catch((e) => {
        expect(e.message).to.contain('❌ Invalid schema.');
        expect(e.message).to.contain('Syntax Error: Expected Name, found "}"');
      })
      .it('shows an error when the schema is invalid');
  });
});
