import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { ResolverMapMiddleware, ResolverMap } from '../../../src/types';
import { pack } from '../../../src/pack';

describe('pack/pack', function () {
  it('reduces a set of resolvers', async function () {
    const graphqlSchema = buildSchema(`
      type Type {
        field: String!
      }

      type OtherType {
        noFieldResolver: String!
      }
    `);

    const resolvers = {};
    const middlewares: ResolverMapMiddleware[] = [
      async function (resolvers): Promise<ResolverMap> {
        resolvers.Type = {};
        resolvers.Type.field = (): string => 'noop';
        return resolvers;
      },
    ];

    const { resolverMap: wrappedResolvers } = await pack(resolvers, middlewares, { dependencies: { graphqlSchema } });

    expect(resolvers).to.deep.equal({}, 'original resolvers are untouched');
    expect(wrappedResolvers).to.have.property('Type');
    expect(wrappedResolvers.Type).to.have.property('field');
    expect(wrappedResolvers.OtherType).to.equal(undefined, 'type without a field resolver remains untouched');
  });
});
