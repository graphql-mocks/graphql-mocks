import { expect } from 'chai';
import sinon from 'sinon';
import { wrapResolver } from '../../../src/resolver/wrap';
import { embedPackOptionsWrapper } from '../../../src/pack/utils';
import { GraphQLObjectType } from 'graphql';

describe('pack/utils', function () {
  describe('#embedPackOptionsWrapper', function () {
    it('creates a wrapped function with embedded packOptions', async function () {
      const resolver = sinon.spy();

      const wrappedResolver = await wrapResolver(resolver, [embedPackOptionsWrapper], {
        resolverMap: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: {} as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: new GraphQLObjectType({ name: 'Query', fields: [] as any }),
        packOptions: {
          state: {},
          dependencies: {
            dependency: 'here-is-a-dependency',
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      });

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
