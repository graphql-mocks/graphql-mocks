const graphqlSchema = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    films: [Film!]!
    film(filmId: ID!): Film
  }

  type Mutation {
    addFilm(input: AddFilmInput!): Film!
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
    actors: [AddFilmActorInput!]!
  }

  input AddFilmActorInput {
    name: String!
  }
`;

// kick everything off
codegen(`
const {output} = require('../helpers');
module.exports = output("module.exports = graphqlSchema", "export default graphqlSchema;");
`);
