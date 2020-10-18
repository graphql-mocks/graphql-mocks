import { GraphQLHandler } from 'graphql-mocks';
import { MirageGraphQLMapper, patchAutoFieldResolvers } from 'graphql-mocks/mirage';
import { createServer, Model } from 'miragejs';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    wizard: Wizard!
  }

  type Wizard {
    firstName: String!
    lastName: String!
  }
`;

const mirageMapper = new MirageGraphQLMapper().addTypeMapping('Wizard', 'Person');

const mirageServer = createServer({
  models: {
    Person: Model,
  },
});

mirageServer.schema.create('person', {
  firstName: 'Hermione',
  lastName: 'Granger',
});

const handler = new GraphQLHandler({
  middlewares: [patchAutoFieldResolvers()],
  dependencies: {
    mirageMapper,
    mirageServer,
    graphqlSchema,
  },
});

const query = handler.query(`
  {
    wizard {
      firstName
      lastName
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
