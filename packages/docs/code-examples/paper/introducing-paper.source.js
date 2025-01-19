import { Paper } from 'graphql-paper';

const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    films: [Film!]!
  }

  type Film {
    title: String!
    year: Int!
    actors: [Actor!]!
  }

  type Actor {
    name: String!
  }
`;

const paper = new Paper(graphqlSchema);

const westSideStory = paper.mutate(({ create }) => {
  // Create a Film with several actors
  const film = create('Film', {
    title: 'West Side Story',
    year: 1961,
    actors: [
      { name: 'Rita Moreno' },
      { name: 'Natalie Wood' },
      { name: 'George Chakiris' },
      { name: 'Richard Beymer' },
    ],
  });

  // return film to be available outside the `mutate`
  return film;
});

// pull properties off the returned `Film` document
const { title, actors } = westSideStory;

// FIRST console.log
codegen(`
const {output} = require('../helpers');
module.exports = output("", "console.log(title);");
`);

// SECOND console.log
codegen(`
const {output} = require('../helpers');
module.exports = output("", "console.log(actors);");
`);

// lookup results via the `data` property on the `Paper` instance
const richard = paper.data.Actor.find(({ name }) => name === 'Richard Beymer');

// THIRD console.log
codegen(`
const {output} = require('../helpers');
module.exports = output("module.exports.result = { title, actors, richard }", "console.log(richard);");
`);
