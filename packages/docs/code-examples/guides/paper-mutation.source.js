import { Paper } from 'graphql-paper';
import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';
import { v4 as uuid } from 'uuid';

const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    noop: Boolean
  }

  type Mutation {
    addFilm(input: AddFilmInput): Film!
  }

  type Film {
    id: ID!
    title: String!
    year: String!
    actors: [Actor!]!
  }

  type Actor {
    id: ID!
    name: String!
  }

  input AddFilmInput {
    title: String!
    year: String!
    actorIds: [ID!]
  }
`;

const paper = new Paper(graphqlSchema);

const { tomHanks, wilson } = paper.mutate(({ create }) => {
  const tomHanks = create('Actor', {
    id: uuid(),
    name: 'Tom Hanks',
  });

  const wilson = create('Actor', {
    id: uuid(),
    name: 'Wilson the Volleyball',
  });

  return { tomHanks, wilson };
});

const resolverMap = {
  Mutation: {
    addFilm(root, args, context, info) {
      const { paper } = extractDependencies(context, ['paper']);

      // find Actor documents based on args.input.actorIds
      const filmActors = (args.input.actorIds ?? [])
        .map((actorId) => paper.data.Actor.find((actor) => actor.id === actorId))
        .filter(Boolean);

      // return created Film document, matching `addFilm` return type: Film!
      const newFilm = paper.mutate(({ create }) => {
        return create('Film', {
          id: uuid(),
          title: args.input.title,
          year: args.input.year,
          actors: filmActors,
        });
      });

      return newFilm;
    },
  },
};

const handler = new GraphQLHandler({ resolverMap, dependencies: { graphqlSchema, paper } });

const result = handler.query(
  `
    mutation($addFilmInput: AddFilmInput) {
      addFilm(input: $addFilmInput) {
        title
        year
        actors {
          name
        }
      }
    }
  `,
  {
    addFilmInput: {
      title: 'Cast Away',
      year: '2000',
      actorIds: [tomHanks.id, wilson.id],
    },
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports.result = result;", "console.log(await result);");
`);
