/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const { GraphQLHandler } = require('graphql-mocks');
const { expressMiddleware } = require('../../src/index');

function createApp(resolverMap) {
  resolverMap = resolverMap ?? {
    Query: {
      helloWorld(_root, args, _context, info) {
        const operationName = info.operation.name?.value;
        return `hello world${args.ending ?? '...'} from operation name ${operationName}`;
      },
    },
  };

  const schemaString = `
  schema {
    query: Query
  }

  type Query {
    helloWorld(ending: String): String!
  }
`;

  const graphqlHandler = new GraphQLHandler({
    resolverMap,
    dependencies: { graphqlSchema: schemaString },
  });

  const app = express();
  app.post('/graphql', expressMiddleware(graphqlHandler));

  return app;
}

module.exports.createApp = createApp;
