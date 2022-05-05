import { setupWorker, rest } from 'msw';
import { mswResolver } from '@graphql-mocks/network-msw';
import { GraphQLHandler } from 'graphql-mocks';

const graphqlHandler = new GraphQLHandler({
  resolverMap: {
    Query: {
      helloWorld(parent, args) {
        return `Hello ${args?.ending}`;
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
export const worker = setupWorker(rest.post('/graphql', mswResolver(graphqlHandler)));
