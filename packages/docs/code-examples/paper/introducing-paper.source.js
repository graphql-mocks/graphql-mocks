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

async function run() {
  const westSideStory = await paper.mutate(({ create }) => {
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

  // pull results off the returned result
  const { title, actors } = westSideStory;

  // FIRST console.log
  console.log(title);

  // SECOND console.log
  console.log(actors);

  // can lookup results on the `Paper` instance, too
  const richard = paper.data.Actor.find(({ name }) => name === 'Richard Beymer');

  // THIRD console.log
  console.log(richard);

  codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports.actual = { title, actors, richard }", "");
  `);
}

// kick off async function
codegen(`
const {output} = require('../helpers');
module.exports = output("module.exports.run = run ", "run();");
`);
