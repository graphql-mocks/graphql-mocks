import { buildSchema, GraphQLResolveInfo } from 'graphql';
import { expect } from 'chai';
import { ResolverMapMiddleware, ResolverMap } from '../../../src/types';
import sinon from 'sinon';
import { pack } from '../../../src/pack';

describe('pack/pack', () => {
  it('reduces a set of resolvers', async () => {
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

  it('includes the packOptions in resolver context by default', async () => {
    const graphqlSchema = buildSchema(`type Query {
      hello: String!
    }`);

    const queryHelloSpy = sinon.spy();
    const middlewares: ResolverMapMiddleware[] = [];

    const resolvers = {
      Query: {
        hello: queryHelloSpy,
      },
    };

    const packOptions = {
      state: { value: 'hello world' },
      dependencies: {
        commonDependency: {},
        graphqlSchema,
      },
    };

    const { resolverMap: wrappedResolvers } = await pack(resolvers, middlewares, packOptions);
    wrappedResolvers.Query.hello({}, {}, {}, {} as GraphQLResolveInfo);

    expect(queryHelloSpy.called).to.be.true;
    const [, , context] = queryHelloSpy.firstCall.args;
    expect(context.pack).to.deep.equal(packOptions);
  });
});
