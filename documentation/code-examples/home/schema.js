export default `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    films: [Film!]!
    film(name: String!): Film!
    characters: [Character!]!
  }

  type Mutation {
    createFilm(name: String!): Film!
    createCharacter(name: String!, filmId: ID!): Character!
  }

  type Film {
    id: ID!
    name: String!
    characters: Character!
  }

  type Character {
    id: ID!
    name: String!
  }

  type AddCharacterToFilmPayload {
    character: Character!
    Film: Film!
  }
`;
