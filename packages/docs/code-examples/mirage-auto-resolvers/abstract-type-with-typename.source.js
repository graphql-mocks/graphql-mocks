import { GraphQLHandler } from 'graphql-mocks';
import { mirageMiddleware } from '@graphql-mocks/mirage';
import { createServer, Model, hasMany } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';
import graphqlSchema from './abstract-type-schema.source';

const mirageServer = createServer({
  models: {
    Person: Model.extend({
      favoriteMedium: hasMany('media'),
    }),

    // using a single model to represent _all_ the concrete types
    Media: Model.extend(),
  },
});

// All models created are for "media", but have their
// concrete type specified via __typename

const movie = mirageServer.schema.create('media', {
  title: 'The Darjeeling Limited',
  durationInMinutes: 104,
  director: 'Wes Anderson',
  __typename: 'Movie',
});

const tvShow = mirageServer.schema.create('media', {
  title: 'Malcolm in the Middle',
  episode: 'Rollerskates',
  network: 'Fox',
  durationInMinutes: 24,
  __typename: 'TV',
});

const book = mirageServer.schema.create('media', {
  title: 'The Hobbit, or There and Back Again',
  author: 'J.R.R. Tolkien',
  pageCount: 310,
  __typename: 'Book',
});

const magazine = mirageServer.schema.create('media', {
  title: 'Lighthouse Digest',
  issue: 'May/June 2020',
  pageCount: 42,
  __typename: 'Magazine',
});

mirageServer.schema.create('person', { favoriteMedium: [movie, tvShow, book, magazine] });

const graphqlHandler = new GraphQLHandler({
  resolverMap: {
    Query: {
      person(_parent, _args, context) {
        const { mirageServer } = extractDependencies(context, ['mirageServer']);
        return mirageServer.schema.people.first();
      },
    },
  },
  middlewares: [mirageMiddleware()],
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});

const query = graphqlHandler.query(`
  {
    person {
      favoriteMedium {
        __typename

        ... on MovingPicture {
          title
          durationInMinutes
        }

        ... on Movie {
          director
        }

        ... on TV {
          episode
          network
        }

        ... on WrittenMedia {
          title
          pageCount
        }

        ... on Book {
          author
        }

        ... on Magazine {
          issue
        }
      }
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
