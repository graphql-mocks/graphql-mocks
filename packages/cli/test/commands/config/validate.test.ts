import { expect, test } from '@oclif/test';
import { resolve } from 'path';
import { useTestPackage } from '../../test-helpers/package';

describe('config:validate', () => {
  useTestPackage('test-package', { eachTest: true });

  test
    .stdout()
    .command(['config:validate', '--config', resolve(__dirname, '../../test-helpers/test-package')])
    .it('finds a config file by flag when specified by directory', async (ctx) => {
      expect(ctx.stdout).to.include('gqlmocks config is valid');
    });

  test
    .stdout()
    .command(['config:validate', '--config', resolve(__dirname, '../../test-helpers/test-package/gqlmocks.config')])
    .it('finds a config file by flag when specified by filename', async (ctx) => {
      expect(ctx.stdout).to.include('gqlmocks config is valid');
    });

  test
    .stdout()
    .command(['config:validate', '--config', resolve(__dirname, '../../test-helpers/test-package/gqlmocks.config.js')])
    .it('finds a config file by flag when specified by filename with extension', async (ctx) => {
      expect(ctx.stdout).to.include('gqlmocks config is valid');
    });

  test
    .stdout()
    .command(['config:validate'])
    .it('finds a config file by cwd', async (ctx) => {
      expect(ctx.stdout).to.include('gqlmocks config is valid');
    });

  test
    .stdout()
    .command(['config:validate', '--config', resolve(__dirname, '../../test-helpers/invalid-gqlmocks.config.js')])
    .catch((e) => expect(e.message).includes('config.schema is a required entry'))
    .it('finds a config file by cwd');
});
