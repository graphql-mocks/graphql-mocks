import { GraphQLHandler, embed } from 'graphql-mocks';
import { Paper } from 'graphql-paper';
import { extractDependencies } from 'graphql-mocks/resolver';
import { logWrapper } from 'graphql-mocks/wrapper';
import graphqlSchema from './schema';
import { field } from 'graphql-mocks/highlight';

const paper = new Paper(graphqlSchema);

paper.mutate(({ create }) => {
  // create characters
  const mike = create('Character', { name: 'Mike Wazowski' });
  const boo = create('Character', { name: 'Boo' });
  const joe = create('Character', { name: 'Joe Gardner' });
  const moonwind = create('Character', { name: 'Moonwind' });

  // create films with characters
  create('Movie', {
    name: 'Monsters, Inc.',
    characters: [boo, mike],
    year: '2001',
  });

  create('Movie', {
    name: 'Soul',
    characters: [joe, moonwind],
    year: '2020',
  });
});

// Check the console to see logging applied to only root-query resolvers!
const loggerMiddleware = embed({ wrappers: [logWrapper], highlight: (h) => h.include(field(['*', '*'])) });

// can be used for overrides or Mutations
const resolverMap = {
  Query: {
    movies(_root, args, context) {
      const { paper } = extractDependencies(context, ['paper']);
      let movies = paper.data.Movie;

      if (args.name) {
        movies = movies.filter((movie) => movie?.name?.startsWith(args.name));
      }

      return movies;
    },
  },

  Mutation: {
    create(_root, { name, year, characterIds }, context) {
      const { paper } = extractDependencies(context, ['paper']);
      return paper.mutate(({ create, getStore }) => {
        const store = getStore();

        const characters = characterIds
          .map((id) => store.data.Character.find((character) => character.id === id))
          .filter(Boolean);

        return create('Movie', { name, year, characters });
      });
    },

    createCharacter(_root, { name }, context) {
      const { paper } = extractDependencies(context, ['paper']);
      return paper.mutate(({ create }) => create('Character', { name }));
    },
  },
};

// export the composed GraphQL Handler
export default new GraphQLHandler({
  resolverMap,
  middlewares: [loggerMiddleware],
  dependencies: {
    graphqlSchema,
    paper,
  },
});
