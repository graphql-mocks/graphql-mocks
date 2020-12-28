import { GraphQLHandler } from 'graphql-mocks';
import { createServer, Model } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';

const mirageServer = createServer({
  models: {
    movie: Model,
  },
});

// Create the movie "The Royal Tenenbaums" in Mirage JS
// Whoops! It's been assigned the wrong year but we can
// fix this via a GraphQL Mutation
const royalTenenbaums = mirageServer.schema.create('movie', {
  name: 'The Royal Tenenbaums',
  year: '2020',
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
    # Update
    updateYear(movieId: ID!, year: String!): Movie!
  }

  type Movie {
    id: ID!
    name: String!
    year: String!
  }
`;

const resolverMap = {
  Mutation: {
    updateYear(_root, args, context, _info) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);

      // lookup and update the year on the movie with args
      const movie = mirageServer.schema.movies.find(args.movieId);
      movie.year = args.year;
      movie.save();

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
    mutation($movieId: ID!, $year: String!) {
      updateYear(movieId: $movieId, year: $year) {
        id
        name
        year
      }
    }
  `,

  // Pass external variables for the mutation
  {
    movieId: royalTenenbaums.id, // corresponds with the model we created above
    year: '2001',
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { mutation }", "mutation.then(result => console.log(result))");
`);
