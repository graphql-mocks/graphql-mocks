import { expect, test } from '@oclif/test';
import { describe } from 'mocha';
import { resolve } from 'path';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';

describe('schema:info', () => {
  describe('when the schema is specified by the --schema-file flag', () => {
    const testPackage = 'test-package';
    const packagePath = testPackagePath(testPackage);
    const schemaFilePath = resolve(packagePath, 'graphql-mocks/schema.graphql');

    test
      .stdout()
      .command(['schema:info', '--schema-file', schemaFilePath])
      .it('shows info about a schema in a project', (ctx) => {
        expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/graphql-mocks/schema.graphql');
        expect(ctx.stdout).to.contain('✅ No errors');
        expect(ctx.stdout).to.contain('Query');
      });
  });

  describe('within a project with a graphql config', () => {
    const testPackage = 'test-package';
    useTestPackage(testPackage, { eachTest: true });

    test
      .stdout()
      .command(['schema:info'])
      .it('shows info about a schema in a project', (ctx) => {
        expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/graphql-mocks/schema.graphql');
        expect(ctx.stdout).to.contain('✅ No errors');
        expect(ctx.stdout).to.contain('Query');
      });
  });
});
