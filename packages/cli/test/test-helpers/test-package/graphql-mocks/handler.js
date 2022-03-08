const { GraphQLHandler } = require('graphql-mocks');
const graphqlSchema = require('./schema.graphql');

module.exports = new GraphQLHandler({
  resolverMap: {
    Query: {
      hello() {
        return 'Hello World from a custom graphql handler';
      },
    },
  },
  dependencies: {
    graphqlSchema,
  },
});
