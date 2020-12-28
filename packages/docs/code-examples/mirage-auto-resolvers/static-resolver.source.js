import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { mirageMiddleware } from '@graphql-mocks/mirage';
import { createServer, Model } from 'miragejs';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    movies: [Movie!]!
  }

  type Movie {
    name: String!
  }
`;

const mirageServer = createServer({
  models: {
    Movie: Model,
  },
});

mirageServer.schema.create('movie', {
  name: 'Moonrise Kingdom',
});

mirageServer.schema.create('movie', {
  name: 'The Darjeeling Limited',
});

mirageServer.schema.create('movie', {
  name: 'Bottle Rocket',
});

const resolverMap = {
  Query: {
    movies: (_parent, _args, context, _info) => {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);
      return mirageServer.schema.movies.all().models;
    },
  },
};

const handler = new GraphQLHandler({
  resolverMap,

  // Note: the `mirageMiddleware` is only required for handling downstream
  // mirage relationships from the returned models. Non-relationship
  // attributes on the model will "just work"
  middlewares: [mirageMiddleware()],

  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const query = handler.query(`
  {
    movies {
      name
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
