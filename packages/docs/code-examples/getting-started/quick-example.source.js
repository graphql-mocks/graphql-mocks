import { GraphQLHandler, embed } from 'graphql-mocks';
import { spyWrapper } from 'graphql-mocks/wrapper';

// this string represents our schema formatted in
// GraphQL SDL (Schema Definition Language), but
// a GraphQL Instance or SDL String can be used
const graphqlSchema = `
schema {
  query: Query
}

type Query {
  helloWorld: String!
}
`;

const resolverMap = {
  Query: {
    helloWorld: () => {
      return 'Hello from our test resolver!';
    },
  },
};

// `embed` returns a Middleware that will apply wrappers
const SpyResolverMapMiddleware = embed({
  wrappers: [spyWrapper],
});

// Create a query handler with the GraphQL Schema, Resolver Map, and middleware
const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [SpyResolverMapMiddleware],
  dependencies: {
    graphqlSchema,
  },
});

// Send the query
const query = handler.query(`
  {
    helloWorld
  }
`);

// console.log the result and the sinon spies that were applied to
// the resolver
codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query, handler }",
\`query.then(result => {
  console.log(result);
  console.log(handler.state.spies.Query.helloWorld)
})\`
);`);
