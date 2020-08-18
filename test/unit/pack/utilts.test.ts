import { expect } from 'chai';
import sinon from 'sinon';
import { wrapResolver } from '../../../src/resolver/wrap';
import { embedPackOptionsWrapper } from '../../../src/pack/utils';

describe('pack/utils', function () {
  describe('#embedPackOptionsWrapper', function () {
    it('creates a wrapped function with embedded packOptions', async function () {
      const resolver = sinon.spy();

      const wrappedResolver = await wrapResolver(resolver, [embedPackOptionsWrapper], {
        resolverMap: {},
        packOptions: {
          state: {},
          dependencies: {
            dependency: 'here-is-a-dependency',
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      wrappedResolver(null, { arg: '' }, { existing: 'other-existing-context' }, {} as any);
      const [, , context] = resolver.firstCall.args;
      expect(context).to.deep.equal({
        existing: 'other-existing-context',
        pack: {
          state: {},
          dependencies: {
            dependency: 'here-is-a-dependency',
          },
        },
      });
    });
  });
});
