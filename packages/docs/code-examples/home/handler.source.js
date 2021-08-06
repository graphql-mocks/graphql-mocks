import { GraphQLHandler, embed } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { logWrapper } from 'graphql-mocks/wrapper';
import graphqlSchema from './schema';
import { field } from 'graphql-mocks/highlight';
import { Paper } from 'paper';

const paper = new Paper(graphqlSchema);

paper.mutate(({ create }) => {
  // create characters
  const mike = create('Character', { name: 'Mike Wazowski' });
  const boo = create('Character', { name: 'Boo' });
  const moana = create('Character', { name: 'Moana' });
  const tui = create('Character', { name: 'Chief Tui' });

  // create films with characters
  const
});

// Create some initial data
// const mike = mirageServer.create('character', {
//   name: 'Mike Wazowski',
// });

// const boo = mirageServer.create('character', {
//   name: 'Boo',
// });

mirageServer.create('movie', {
  name: 'Monsters, Inc.',
  characters: [boo, mike],
  year: '2001',
});

const moana = mirageServer.create('character', {
  name: 'Moana',
});

const tui = mirageServer.create('character', {
  name: 'Chief Tui',
});

mirageServer.create('movie', {
  name: 'Moana',
  characters: [moana, tui],
  year: '2016',
});

// Check the console to see logging applied to only root-query resolvers!
const loggerMiddleware = embed({ wrappers: [logWrapper], highlight: (h) => h.include(field(['*', '*'])) });

// can be used for overrides or Mutations
const resolverMap = {
  Query: {
    movies(_root, args, context) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);
      let movies = mirageServer.schema.movies.all().models;
      if (args.name) {
        movies = movies.filter((movie) => movie?.name?.startsWith(args.name));
      }

      return movies;
    },
  },

  Mutation: {
    create(_root, args, context) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);
      return mirageServer.create('movie', { name: args.name });
    },

    createCharacter(_root, args, context) {
      const { mirageServer } = extractDependencies(context, ['mirageServer']);
      const movie = mirageServer.find('movie', args.movieId);

      if (!movie) throw new Error(`Unable to find movie by movieId: ${args.movieId}`);

      const character = mirageServer.create('character', { name: args.character });
      movie.characters.push(character);

      return character;
    },
  },
};

// export the composed GraphQL Handler
export default new GraphQLHandler({
  resolverMap,
  middlewares: [mirageMiddleware(), loggerMiddleware],
  dependencies: {
    graphqlSchema,
    mirageServer,
  },
});
