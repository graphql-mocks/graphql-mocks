import { GraphQLHandler } from 'graphql-mocks';
import { patchAutoResolvers } from 'graphql-mocks/mirage';
import { createServer, Model, hasMany } from 'miragejs';

// Define GraphQL Schema
const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    wizards: [Wizard!]!
  }

  type Wizard {
    name: String!
    spells: [Spell!]!
  }

  type Spell {
    incantation: String!
  }
`;

// Create the mirage server and schema
const mirageServer = createServer({
  models: {
    Spell: Model,
    Wizard: Model.extend({
      spells: hasMany(),
    }),
  },
});

// Create model instances
const makeWaterSpell = mirageServer.schema.create('spell', { incantation: 'Aguamenti' });
const makeDisappearSpell = mirageServer.schema.create('spell', { incantation: 'Evanesco' });
const makeFireSpell = mirageServer.schema.create('spell', { incantation: 'Incendio' });

mirageServer.schema.create('wizard', { name: 'Harry Potter', spells: [makeWaterSpell, makeDisappearSpell] });
mirageServer.schema.create('wizard', { name: 'Hermione Granger', spells: [makeDisappearSpell, makeFireSpell] });

const graphqlHandler = new GraphQLHandler({
  middlewares: [patchAutoResolvers()],
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const query = graphqlHandler.query(`
  {
    wizards {
      name
      spells {
        incantation
      }
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
