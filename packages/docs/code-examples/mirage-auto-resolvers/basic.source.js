import { GraphQLHandler } from 'graphql-mocks';
import { mirageMiddleware } from '@graphql-mocks/mirage';
import { createServer, Model, hasMany } from 'miragejs';

// Define GraphQL Schema
const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    movies: [Movie!]!
  }

  type Movie {
    title: String!
    actors: [Actor!]!
  }

  type Actor {
    name: String!
  }
`;

// Create the mirage server and schema
const mirageServer = createServer({
  models: {
    Actor: Model,
    Movie: Model.extend({
      actors: hasMany(),
    }),
  },
});

// Create model instances
const meryl = mirageServer.schema.create('actor', { name: 'Meryl Streep' });
const bill = mirageServer.schema.create('actor', { name: 'Bill Murray' });
const anjelica = mirageServer.schema.create('actor', { name: 'Anjelica Huston' });

mirageServer.schema.create('movie', { title: 'Fantastic Mr. Fox', actors: [meryl, bill] });
mirageServer.schema.create('movie', { title: 'The Life Aquatic with Steve Zissou', actors: [bill, anjelica] });

const graphqlHandler = new GraphQLHandler({
  middlewares: [mirageMiddleware()],
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const query = graphqlHandler.query(`
  {
    movies {
      title
      actors {
        name
      }
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
