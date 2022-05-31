import Pretender from 'pretender';
import { pretenderHandler } from '@graphql-mocks/network-pretender';
import { GraphQLHandler } from 'graphql-mocks';

export function setup() {
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

  const server = new Pretender(function () {
    this.post('/graphql', pretenderHandler(graphqlHandler));
  });

  server.handledRequest = function (verb, path, request) {
    console.log(`[${verb}] @ ${path}`);
    console.log({ request });
  };

  return server;
}
