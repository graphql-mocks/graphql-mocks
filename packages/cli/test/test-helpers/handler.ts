import { readFileSync } from 'fs';
import { GraphQLHandler } from 'graphql-mocks';

export default new GraphQLHandler({
  resolverMap: {
    Query: {
      hello() {
        return `Hello World from a custom graphql handler`;
      },
    },
  },
  dependencies: {
    graphqlSchema: readFileSync(`${__dirname}/schema.graphql`).toString(),
  },
});
