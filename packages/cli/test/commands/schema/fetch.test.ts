import { expect, test } from '@oclif/test';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { closeSync, openSync, existsSync, unlinkSync as rm, writeFileSync } from 'fs';
import { testPackagePath, useTestPackage } from '../../test-helpers/package';
import { describe } from 'mocha';
import { backup } from '../../test-helpers/file';

function makeEmptyFile(filePath: string) {
  closeSync(openSync(filePath, 'w'));
}

describe('schema:fetch', () => {
  describe('using --save-schema to specify the location', () => {
    const tempDir = tmpdir();
    const tempFile = 'schema.temp.graphql';
    const tempFilePath = resolve(tempDir, tempFile);

    afterEach(() => {
      rm(tempFilePath);
    });

    test
      .stdout()
      .command(['schema:fetch', '--source', 'https://swapi-graphql.netlify.app/graphql', '--save-schema', tempFilePath])
      .it('fetches a schema', (ctx) => {
        expect(ctx.stdout).to.contain(`✅ Saved GraphQL Schema to ${tempFilePath}`);
      });

    test
      .do(() => {
        if (!existsSync(tempFilePath)) {
          makeEmptyFile(tempFilePath);
        }
      })
      .stdout()
      .command(['schema:fetch', '--source', 'https://swapi-graphql.netlify.app/graphql', '--save-schema', tempFilePath])
      .catch((e) => {
        expect(e.message).to.contain(`Bailing, file already exists at ${tempFilePath}`);
        expect(e.message).to.contain('Re-run with `force` flag to overwrite.');
      })
      .it('fails to fetch a schema when the file already exists');

    test
      .do(() => {
        if (!existsSync(tempFilePath)) {
          makeEmptyFile(tempFilePath);
        }
      })
      .stdout()
      .command([
        'schema:fetch',
        '--source',
        'https://swapi-graphql.netlify.app/graphql',
        '--save-schema',
        tempFilePath,
        '--force',
      ])
      .it('fetches a schema when the file already exists using --force', (ctx) => {
        expect(ctx.stdout).to.contain(`✅ Saved GraphQL Schema to ${tempFilePath}`);
      });
  });

  describe('with a package and its gqlmocks config', () => {
    const testPackage = 'test-package';
    const packagePath = testPackagePath(testPackage);
    const absolutePackageConfigPath = resolve(packagePath, 'gqlmocks.config.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageConfig = require(absolutePackageConfigPath);
    const schemaPath = packageConfig.schema.path;
    const absoluteSchemaPath = resolve(packagePath, schemaPath);

    useTestPackage(testPackage, { eachTest: true });
    backup([absoluteSchemaPath, absolutePackageConfigPath], { eachTest: true });

    let newPackageConfig;
    beforeEach(() => {
      newPackageConfig = {
        ...packageConfig,
        schema: {
          ...packageConfig.schema,
          url: 'https://swapi-graphql.netlify.app/graphql',
        },
      };

      delete require.cache[absolutePackageConfigPath];
      writeFileSync(absolutePackageConfigPath, `module.exports = ${JSON.stringify(newPackageConfig)}`);
    });

    test
      .stdout()
      .command(['schema:fetch'])
      .catch((e) => {
        expect(e.message).to.contain(`Bailing, file already exists at ${schemaPath}`);
        expect(e.message).to.contain('Re-run with `force` flag to overwrite.');
      })
      .it('fails to fetch a schema when the file already exists');

    test
      .stdout()
      .command(['schema:fetch', '--force'])
      .it('fetches a schema when the file already exists using --force', (ctx) => {
        expect(ctx.stdout).to.contain(`✅ Saved GraphQL Schema to ${resolve(packagePath, schemaPath)}`);
      });
  });
});
