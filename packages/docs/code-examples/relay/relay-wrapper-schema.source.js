export const graphqlSchema = `
type Query {
  actors(first: Int, last: Int, before: String, after: String): ActorConnection!
}

type ActorConnection {
  edges: [ActorEdge!]!
  pageInfo: PageInfo!
}

type ActorEdge {
  node: Actor!
  cursor: String!
}

type Actor {
  id: ID!
  name: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
`;
