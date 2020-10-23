import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    Movie: Model,
  },
});

const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    Movie: [Movie!]!
  }

  type Mutation {
    # Create mutation
    addMovie(input: AddMovieInput): Movie!
  }

  type Movie {
    id: ID!
    title: String!
    style: MovieStyle!
  }

  input AddMovieInput {
    title: String!
    style: MovieStyle!
  }

  enum MovieStyle {
    LiveAction
    StopMotion
    Animated
  }
`;

// Represents the resolverMap with our static Resolver Function
// using `extractDependencies` to handle the input args and
// return the added Movie
const resolverMap = {
  Mutation: {
    addMovie(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);

      const addedMovie = mirageServer.schema.movies.create({
        title: args.input.title,
        style: args.input.style,
      });

      return addedMovie;
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
    mutation($movie: AddMovieInput) {
      addMovie(input: $movie) {
        id
        title
        style
      }
    }
  `,

  // Pass external variables for the mutation
  {
    movie: {
      title: 'Isle of Dogs',
      style: 'StopMotion',
    },
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);
