import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    movie: Model,
  },
});

const grandBudapestHotel = mirageServer.schema.create('movie', {
  title: 'The Grand Budapest Hotel',
});

const hamilton = mirageServer.schema.create('movie', {
  title: 'Hamilton',
});

const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    movies: [Movie!]!
  }

  type Mutation {
    # Remove
    removeMovie(movieId: ID!): Movie!
  }

  type Movie {
    id: ID!
    title: String!
  }
`;

const resolverMap = {
  Mutation: {
    removeMovie(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);

      const movie = mirageServer.schema.movies.find(args.movieId);
      movie.destroy();

      return movie;
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

const mutation = handler.query(
  `
    mutation($movieId: ID!) {
      removeMovie(movieId: $movieId) {
        id
        title
      }
    }
  `,

  // Pass external variables for the mutation
  {
    movieId: hamilton.id,
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);
