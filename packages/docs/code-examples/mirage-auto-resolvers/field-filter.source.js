import { GraphQLHandler } from 'graphql-mocks';
import { MirageGraphQLMapper, patchAutoFieldResolvers } from 'graphql-mocks/mirage';
import { createServer, Model } from 'miragejs';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    wizard(name: String!): Wizard!
  }

  type Wizard {
    name: String!
    house: String!
  }
`;

const mirageMapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'wizard'], (wizards, _parent, args) => {
  return wizards.find((wizard) => wizard.name === args.name);
});

const mirageServer = createServer({
  models: {
    Wizard: Model,
  },
});

mirageServer.schema.create('wizard', {
  name: 'Hermione',
  house: 'Gryffindor',
});

mirageServer.schema.create('wizard', {
  name: 'Harry',
  house: 'Gryffindor',
});

mirageServer.schema.create('wizard', {
  name: 'Draco',
  house: 'Slytherin',
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
    wizard(name: "Draco") {
      name
      house
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
