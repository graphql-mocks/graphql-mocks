import { expect, test } from '@oclif/test';
import { resolve } from 'path';

describe('config:info', () => {
  test
    .stdout()
    .command(['config:info', '--config', resolve(__dirname, '../../test-helpers/test-package')])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('Location');
      expect(ctx.stdout).to.contain('packages/cli/test/test-helpers/test-package/gqlmocks.config.js');
      expect(ctx.stdout).to.contain('Validations');
      expect(ctx.stdout).to.contain('✅ Passed all validations');
      expect(ctx.stdout).to.contain('Config contents');
      expect(ctx.stdout).to.contain('"path": "graphql-mocks/schema"');
      expect(ctx.stdout).to.contain('"format": "SDL"');
    });
});
