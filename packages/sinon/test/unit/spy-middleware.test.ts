import { expect } from 'chai';
import { spyMiddleware } from '../../src/spy-middleware';
import { buildSchema, GraphQLResolveInfo } from 'graphql';

describe('spy-middleware', function () {
  const schema = buildSchema(`
    schema {
      query: Query
    }

    type Query {
      user: User
    }

    type User {
      name: String
    }
  `);

  it('provides accesss to spies on resolvers via the middleware', async function () {
    const packOptions = { dependencies: { graphqlSchema: schema }, state: {} };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = packOptions.state as any;

    const resolverMap = {
      User: {
        name: () => 'User.name',
      },

      Query: {
        user: () => 'Query.user',
      },
    };

    const middleware = spyMiddleware([['User', 'name']]);
    const postResolverMap = await middleware(resolverMap, packOptions);

    expect(state.spies?.Query?.user).to.not.exist;
    expect(state.spies?.User?.name).to.exist;

    const resolverSpy = state.spies.User.name;
    expect(resolverSpy.called).to.equal(false);

    postResolverMap.User.name({}, {}, {}, {} as unknown as GraphQLResolveInfo);
    expect(resolverSpy.called).to.equal(true);
    expect(resolverSpy.firstCall.returnValue).to.equal('User.name');
  });
});
