import { GraphQLHandler } from 'graphql-mocks';
import { mirageMiddleware } from '@graphql-mocks/mirage';
import { createServer, Model, hasMany } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver';
import graphqlSchema from './abstract-type-schema.source';

const mirageServer = createServer({
  models: {
    Person: Model.extend({
      // represent the abstract type with a polymorphic relationship
      favoriteMedium: hasMany({ polymorphic: true }),
    }),

    // model definition exists for each discrete type
    Movie: Model.extend(),
    TV: Model.extend(),
    Book: Model.extend(),
    Magazine: Model.extend(),
  },
});

const movie = mirageServer.schema.create('movie', {
  title: 'The Darjeeling Limited',
  durationInMinutes: 104,
  director: 'Wes Anderson',
});

const tv = mirageServer.schema.create('tv', {
  title: 'Malcolm in the Middle',
  episode: 'Rollerskates',
  network: 'Fox',
  durationInMinutes: 24,
});

const book = mirageServer.schema.create('book', {
  title: 'The Hobbit, or There and Back Again',
  author: 'J.R.R. Tolkien',
  pageCount: 310,
});

const magazine = mirageServer.schema.create('magazine', {
  title: 'Lighthouse Digest',
  issue: 'May/June 2020',
  pageCount: 42,
});

mirageServer.schema.create('person', { favoriteMedium: [movie, tv, book, magazine] });

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
