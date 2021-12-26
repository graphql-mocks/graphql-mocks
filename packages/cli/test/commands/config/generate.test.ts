import { expect, test } from '@oclif/test';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { setMockCwd, restoreCwd } from '../../../src/lib/cwd';
import { normalizeAbsolutePath } from '../../../src/lib/normalize-absolute-path';
import { unlinkSync as rm } from 'fs';

describe('config/generate', function () {
  this.timeout(10000);

  const generateTestPkgDir = resolve(__dirname, '../../test-helpers/test-package-generate');
  const findGeneratedConfig = () =>
    normalizeAbsolutePath(resolve(generateTestPkgDir, 'gqlmocks.config'), {
      extensions: ['js', 'json', 'ts'],
    });

  beforeEach(() => setMockCwd(generateTestPkgDir));
  afterEach(() => restoreCwd());
  afterEach(() => {
    const generatedConfig = findGeneratedConfig();
    if (generatedConfig && existsSync(generatedConfig)) {
      console.log(`Removing file after test ${generatedConfig}`);
      rm(generatedConfig);
    }
  });

  const configContentFlags = [
    '--schema.path',
    '/schema/path',
    '--schema.format',
    'SDL',
    '--handler.path',
    '/handler/path',
  ];

  test
    .stdout()
    .stderr()
    .command(['config:generate', ...configContentFlags])
    .it('generates a config', (ctx) => {
      expect(ctx.stdout).to.contain('Wrote gqlmock config');
      const generatedConfig = findGeneratedConfig();
      expect(generatedConfig!.endsWith('ts'), 'it finds typescript in the package.json of the test project').to.be.true;
    });

  test
    .stdout()
    .stderr()
    .do(() => {
      const existingConfig = resolve(generateTestPkgDir, 'gqlmocks.config.ts');
      writeFileSync(existingConfig, '');
    })
    .command(['config:generate', ...configContentFlags])
    .catch((e) => expect(e.message).include('Bailing, file already exists'))
    .it('fails with error when config already exists');

  test
    .stdout()
    .stderr()
    .do(() => {
      const existingConfig = resolve(generateTestPkgDir, 'gqlmocks.config.ts');
      writeFileSync(existingConfig, '');
    })
    .command(['config:generate', '--force', ...configContentFlags])
    .it('overwrites a file that already exists with the --force flag', (ctx) => {
      expect(ctx.stdout).to.contain('Wrote gqlmock config');
    });

  test
    .stdout()
    .stderr()
    .command(['config:generate', '--out', resolve(generateTestPkgDir, 'custom-config.hello'), ...configContentFlags])
    .it('generates a config file at the location specified by the --out flag', (ctx) => {
      expect(ctx.stdout).to.contain('Wrote gqlmock config');
      expect(existsSync(resolve(generateTestPkgDir, 'custom-config.hello'))).to.exist;

      // test clean up
      rm(resolve(generateTestPkgDir, 'custom-config.hello'));
    });

  test
    .stdout()
    .stderr()
    .command(['config:generate', '--format', 'json', ...configContentFlags])
    .it('writes a config file in format specified by --format', (ctx) => {
      expect(ctx.stdout).to.contain('Wrote gqlmock config');
      expect(existsSync(resolve(generateTestPkgDir, 'gqlmocks.config.json'))).to.exist;
    });
});
