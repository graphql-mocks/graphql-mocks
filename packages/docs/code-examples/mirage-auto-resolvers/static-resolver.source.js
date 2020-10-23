import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { createServer, Model } from 'miragejs';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    wizards: [Wizard!]!
  }

  type Wizard {
    name: String!
  }
`;

const mirageServer = createServer({
  models: {
    Person: Model,
  },
});

mirageServer.schema.create('person', {
  name: 'Hermione',
});

mirageServer.schema.create('person', {
  name: 'Harry',
});

mirageServer.schema.create('person', {
  name: 'Draco',
});

const resolverMap = {
  Query: {
    wizards: (parent, args, context, info) => {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);
      return mirageServer.schema.all('person').models;
    },
  },
};

const handler = new GraphQLHandler({
  resolverMap,
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const query = handler.query(`
  {
    wizards {
      name
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
