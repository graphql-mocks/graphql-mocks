import { GraphQLHandler, embed } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { logWrapper } from 'graphql-mocks/wrapper';
import { mirageMiddleware } from '@graphql-mocks/mirage';
import { createServer, Model, hasMany } from 'miragejs';
import graphqlSchema from './schema';

// Using Mirage JS and the `mirageMiddlware` Resolver Map Middleware
// to setup stateful Auto Resolvers
const mirageServer = createServer({
  models: {
    Film: Model.extend({
      characters: hasMany('character'),
    }),

    Character: Model,
  },
});

// Create some initial data
const mike = mirageServer.create('character', {
  name: 'Mike Wazowski',
});

const monstersInc = mirageServer.create('film', {
  name: 'Monsters, Inc.',
  characters: [mike],
});

// Check the console to see logging applied to only root-query resolvers!
const loggerMiddleware = embed({ include: ['Query', '*'], wrappers: [logWrapper] });

// can be used for overrides or Mutations
const resolverMap = {
  Mutation: {
    createFilm(_root, args, context) {
      const { mirageServer } = extractDependencies(['mirageServer'], context);
      return mirageServer.create('film', { name: args.name });
    },

    createCharacter(_root, args, context) {
      const { mirageServer } = extractDependencies(['mirageServer'], context);
      const film = mirageServer.find('film', args.filmId);

      if (!film) throw new Error(`Unable to find film by filmId: ${args.filmId}`);

      const character = mirageServer.create('character', { name: args.character });
      film.characters.push(character);

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
