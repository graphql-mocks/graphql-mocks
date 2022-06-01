import { GraphQLHandler } from 'graphql-mocks';

export const graphqlHandler = new GraphQLHandler({
  resolverMap: {
    Query: {
      helloWorld(parent, args) {
        return `Hello ${args.ending}`;
      },
    },
  },

  dependencies: {
    graphqlSchema: `
        schema {
          query: Query
        }

        type Query {
          helloWorld(ending: String): String!
        }
      `,
  },
});
