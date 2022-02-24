const { GraphQLHandler } = require('graphql-mocks');
const graphqlSchema = require('./schema.graphql');

module.exports = new GraphQLHandler({
  dependencies: {
    graphqlSchema,
  },
});
