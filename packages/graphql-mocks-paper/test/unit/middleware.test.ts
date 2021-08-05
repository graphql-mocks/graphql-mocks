import { expect } from 'chai';
import { paperMiddleware } from '../../src/middleware';
import { buildSchema, GraphQLSchema } from 'graphql';
import { PackOptions } from 'graphql-mocks/pack/types';
import { fieldResolver } from '../../src/field-resolver';
import { typeResolver } from '../../src/type-resolver';
import { FieldResolver } from 'graphql-mocks/types';
import { TypeResolver } from 'graphql-mocks/types';

describe('paper-middleware', function () {
  let graphqlSchema: GraphQLSchema;
  let packOptions: PackOptions;

  this.beforeEach(() => {
    graphqlSchema = buildSchema(`
    schema {
      query: Query
      mutation: Mutation
    }

    type Mutation {
      addUser(name: String): User
    }

    type Query {
      user: User
    }

    type User {
      name: String
    }

    type Team {
      name: String
    }

    union Owner = Team | User
  `);

    packOptions = { dependencies: { graphqlSchema }, state: {} };
  });

  it('highlights non-query, non-mutuation, field and type resolvers by default', async function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolverMap: any = {};
    const middleware = paperMiddleware();
    await middleware(resolverMap, packOptions);
    expect(resolverMap.Query?.user, 'it skips adding resolvers to Query fields').to.not.exist;
    expect(resolverMap.Mutation?.addUser, 'it skips adding resolvers to the Mutation fields').to.not.exist;
    expect(resolverMap.User?.name).to.equal(fieldResolver);
    expect(resolverMap.Owner.__resolveType).to.equal(typeResolver);
  });

  context('replace option', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolverMap: any;
    let userNameResolver: FieldResolver;
    let ownerUnionResolver: TypeResolver;

    beforeEach(() => {
      ownerUnionResolver = () => 'owner __resolveType resolver';
      userNameResolver = () => 'user name resolver';

      const queryUserResolver = () => 'query user resolver';
      const mutationAddUserResolver = () => 'mutation adduser resolver';

      resolverMap = {
        Query: {
          user: queryUserResolver,
        },
        Mutation: {
          addUser: mutationAddUserResolver,
        },
        User: {
          name: userNameResolver,
        },
        Owner: {
          __resolveType: ownerUnionResolver,
        },
      };
    });

    describe('when replace = true', () => {
      const replace = true;

      it('replaces field and type resolvers', async function () {
        const middleware = paperMiddleware({ replace });
        expect(resolverMap.User?.name).to.equal(userNameResolver);
        expect(resolverMap.Owner.__resolveType).to.equal(ownerUnionResolver);
        await middleware(resolverMap, packOptions);
        expect(resolverMap.User?.name, 'it replaces the field resolver').to.equal(fieldResolver);
        expect(resolverMap.Owner.__resolveType, 'it replaces the type resolver').to.equal(typeResolver);
      });

      it('replaces only the highlighted resolvers', async function () {
        const middleware = paperMiddleware({ replace, highlight: (h) => h.include(['User', 'name']) });
        expect(resolverMap.User?.name).to.equal(userNameResolver);
        expect(resolverMap.Owner.__resolveType).to.equal(ownerUnionResolver);
        await middleware(resolverMap, packOptions);
        expect(resolverMap.User?.name, 'it replaces the highlighted resolver').to.equal(fieldResolver);
        expect(resolverMap.Owner.__resolveType, 'it skips the unhighlighted resolver').to.equal(ownerUnionResolver);
      });
    });

    describe('when replace = false', () => {
      const replace = false;

      it('skips replacing field and type resolvers when false', async function () {
        const middleware = paperMiddleware({ replace });
        expect(resolverMap.User?.name).to.equal(userNameResolver);
        expect(resolverMap.Owner.__resolveType).to.equal(ownerUnionResolver);
        await middleware(resolverMap, packOptions);
        expect(resolverMap.User?.name, 'it skips replacing existing field resolver').to.equal(userNameResolver);
        expect(resolverMap.Owner.__resolveType, 'it skips replacing existing type resolver').to.equal(
          ownerUnionResolver,
        );
      });
    });
  });
});
