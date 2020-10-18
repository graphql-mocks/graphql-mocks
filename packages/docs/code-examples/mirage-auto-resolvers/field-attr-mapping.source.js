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
    name: String!
    dwelling: String!
  }
`;

const mirageMapper = new MirageGraphQLMapper().addFieldMapping(['Wizard', 'dwelling'], ['Person', 'location']);

const mirageServer = createServer({
  models: {
    Person: Model,
  },
});

mirageServer.schema.create('person', {
  name: 'Hermione Granger',
  location: 'Hogwarts School of Witchcraft and Wizardry',
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
        name
        dwelling
      }
    }
  `);

// kick everything off
codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
