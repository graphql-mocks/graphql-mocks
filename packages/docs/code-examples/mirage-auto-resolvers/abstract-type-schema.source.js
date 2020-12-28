export default `
  schema {
    query: Query
  }

  type Query {
    person: Person!
  }

  type Person {
    favoriteMedium: [Media]!
  }

  union Media = Movie | TV | Book | Magazine

  interface MovingPicture {
    title: String!
    durationInMinutes: Int!
  }

  interface WrittenMedia {
    title: String!
    pageCount: String!
  }

  type Movie implements MovingPicture {
    title: String!
    durationInMinutes: Int!
    director: String!
  }

  type TV implements MovingPicture {
    title: String!
    episode: String!
    durationInMinutes: Int!
    network: String!
  }

  type Book implements WrittenMedia {
    title: String!
    author: String!
    pageCount: String!
  }

  type Magazine implements WrittenMedia {
    title: String!
    issue: String!
    pageCount: String!
  }
`;
