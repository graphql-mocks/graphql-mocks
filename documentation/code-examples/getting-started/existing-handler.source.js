// This example is assuming you already have a GraphQL resolver map and have an
// existing handler (in this case via graphql-tools). If this is not the case
// check out the "Creating a GraphQL Handler" documentation section to create a GraphQL
// handler with `graphql-mocks`.
import { makeExecutableSchema } from 'graphql-tools';
import { buildSchema, graphql, printSchema } from 'graphql';
import { pack } from 'graphql-mocks';

async function run() {
  const graphqlSchema = buildSchema(`
    schema {
      query: Query
    }

    type Query {
      helloWorld: String!
    }
  `);

  // This represents the original resolver map being used by your existing GraphQL
  // handler and is needed for the `pack` function to apply Resolver Map
  // Middlewares and Resolver Wrappers.
  const resolverMap = {
    Query: {
      helloWorld() {
        return 'Hello from my first GraphQL resolver!';
      },
    },
  };

  // using an array of middlewares to apply
  const middlewares = [];

  // any dependencies that might be required by the Resolver Map Middlewares or
  // Resolver Wrappers. `graphqlSchema` is a required dependency;
  const dependencies = {
    graphqlSchema,
  };

  const packed = await pack(resolverMap, middlewares, {
    dependencies,
  });

  // the packed result includes a `resolverMap` field that would have applied any
  // middlewares. These can then be applied in place of where you would have used
  // your previous resolverMap
  const packedResolverMap = packed.resolverMap;

  // `makeExecutableSchema` is how graphql-tools creates applies a Resolver Map
  // to a Schema so that it can accept queries
  const executableSchema = makeExecutableSchema({
    typeDefs: printSchema(graphqlSchema),

    // BEFORE using `graphql-mocks` this would have uses the original resolver map
    // resolvers: resolverMap,

    // AFTER, it uses the packed Resolver Map which includes the application of
    // Resolver Map Middlewares and any Resolver Wrappers
    resolvers: packedResolverMap,
  });

  const result = await graphql(
    executableSchema,
    `
      query {
        helloWorld
      }
    `,
  );

  return result;
}

// kick everything off
codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports.run = run", "run();");
`);
