import { GraphQLHandler } from 'graphql-mocks';

const schemaString = `
  schema {
    query: Query
  }

  type Query {
    helloWorld: String!
  }
`;

const resolverMap = {
  Query: {
    helloWorld() {
      return 'Hello from my first GraphQL resolver!';
    },
  },
};

const handler = new GraphQLHandler({
  resolverMap,
  dependencies: {
    graphqlSchema: schemaString,
  },
});

const query = handler.query(
  `
    {
      helloWorld
    }
  `,
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
