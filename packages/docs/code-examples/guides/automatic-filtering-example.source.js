import { GraphQLHandler } from 'graphql-mocks';
import { embed } from 'graphql-mocks/resolver-map';
import { automaticFilterWrapper } from './automatic-filtering-filter.source';

codegen(`
  const {output} = require('../helpers');
  module.exports = output("const resolverMap = require('./automatic-filtering-resolver-map').resolverMap;", "import { resolverMap } from './resolver-map';");
`);

const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [
    embed({
      wrappers: [automaticFilterWrapper],
    }),
  ],
  dependencies: {
    graphqlSchema: `
      schema {
        query: Query
      }

      type Query {
        movies(title: String, year: String): [Movie!]!
      }

      type Movie {
        title: String!
        year: String!
      }
    `,
  },
});

const query = handler.query(
  `
  query FilteredMovies($year: String) {
    movies(year: $year) {
      title
      year
    }
  }
`,
  {
    year: '2001',
  },
);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then(result => console.log(result))");
`);
