import { buildSchema, GraphQLResolveInfo } from 'graphql';
import { expect } from 'chai';
import { pack } from '../../../src/resolver-map/pack';
import { ResolverMapWrapper } from '../../../src/types';
import sinon from 'sinon';

describe('resolver-map/pack', function () {
  it('reduces a set of resolvers', function () {
    const graphqlSchema = buildSchema(`
      type Type {
        field: String!
      }
    `);

    const resolvers = {};
    const wrappers: ResolverMapWrapper[] = [
      function (resolvers) {
        resolvers.Type = {};
        // eslint-disable-next-line
        resolvers.Type.field = () => {};

        return resolvers;
      },
    ];

    const { resolvers: wrappedResolvers } = pack(resolvers, wrappers, { dependencies: { graphqlSchema } });

    expect(resolvers).to.deep.equal({}, 'original resolvers are untouched');
    expect(wrappedResolvers).to.have.property('Type');
    expect(wrappedResolvers.Type).to.have.property('field');
  });

  it('includes the packOptions in resolver context by default', function () {
    const graphqlSchema = buildSchema(`type Query {
      hello: String!
    }`);

    const queryHelloSpy = sinon.spy();
    const wrappers: ResolverMapWrapper[] = [];

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

    const { resolvers: wrappedResolvers } = pack(resolvers, wrappers, packOptions);
    wrappedResolvers.Query.hello({}, {}, {}, {} as GraphQLResolveInfo);

    expect(queryHelloSpy.called).to.be.true;
    const [, , context] = queryHelloSpy.firstCall.args;
    expect(context.pack).to.deep.equal(packOptions);
  });
});
