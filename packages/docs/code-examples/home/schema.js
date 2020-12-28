export default `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    movies(name: String): [Movie!]!
    characters: [Character!]!
  }

  type Mutation {
    createFilm(name: String!): Movie!
    createCharacter(name: String!, movieId: ID!): Character!
  }

  type Movie {
    id: ID!
    name: String!
    year: String!
    characters: [Character!]!
  }

  type Character {
    id: ID!
    name: String!
  }

  type AddCharacterToMoviePayload {
    character: Character!
    Movie: Movie!
  }
`;
