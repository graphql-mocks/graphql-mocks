import { expect } from 'chai';
import sinon from 'sinon';
import { applyWrappers } from '../../../src/resolver/apply-wrappers';
import { embedPackOptionsWrapper } from '../../../src/pack/utils';
import { GraphQLObjectType, GraphQLAbstractType, GraphQLInterfaceType, GraphQLResolveInfo } from 'graphql';
import { FieldResolver, TypeResolver } from '../../../src/types';

describe('pack/utils', function () {
  describe('#embedPackOptionsWrapper', function () {
    it('creates a wrapped field resolver with embedded packOptions', async function () {
      const resolver = sinon.spy();

      const wrappedResolver = await applyWrappers(resolver as FieldResolver, [embedPackOptionsWrapper], {
        resolverMap: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: {} as any,
        type: new GraphQLObjectType({ name: 'Query', fields: {} }),
        packOptions: {
          state: {},
          dependencies: {
            dependency: 'here-is-a-dependency',
          },
        },
      });

      wrappedResolver(null, { arg: '' }, { existing: 'other-existing-context' }, ({} as unknown) as GraphQLResolveInfo);

      // pulled from third arg
      const context = resolver.firstCall.args[2];

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

    it('creates a wrapped type resolver with embedded packOptions', async function () {
      const resolver = sinon.spy();

      const wrappedResolver = await applyWrappers(resolver as TypeResolver, [embedPackOptionsWrapper], {
        resolverMap: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        schema: {} as any,
        type: new GraphQLInterfaceType({ name: 'NameableInterface', fields: {} }),
        packOptions: {
          state: {},
          dependencies: {
            dependency: 'here-is-a-dependency',
          },
        },
      });

      wrappedResolver(
        { value: 'value' },
        { existing: 'other-existing-context' },
        ({ info: 'info' } as unknown) as GraphQLResolveInfo,
        ({} as unknown) as GraphQLAbstractType,
      );

      // pulled from second arg
      const context = resolver.firstCall.args[1];

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
