import { Paper } from 'graphql-paper';
import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    films: [Film!]!
  }

  type Film {
    title: String!
    year: String!
    actors: [Actor!]!
  }

  type Actor {
    name: String!
  }
`;

const paper = new Paper(graphqlSchema);

// seed with some data about the film "The Notebook"
paper.mutate(({ create }) => {
  const rachel = create('Actor', {
    name: 'Rachel McAdams',
  });

  const ryan = create('Actor', {
    name: 'Ryan Gosling',
  });

  create('Film', {
    title: 'The Notebook',
    year: '2004',
    actors: [rachel, ryan],
  });
});

const resolverMap = {
  Query: {
    films(root, args, context, info) {
      const { paper } = extractDependencies(context, ['paper']);

      // return all Documents of type `Film`
      return paper.data.Film;
    },
  },
};

const handler = new GraphQLHandler({ resolverMap, dependencies: { graphqlSchema, paper } });

const result = handler.query(`
    query {
      films {
        title
        year
        actors {
          name
        }
      }
    }
  `);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports.result = result;", "console.log(await result);");
`);
