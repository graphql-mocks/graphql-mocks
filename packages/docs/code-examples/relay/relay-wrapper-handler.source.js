import { GraphQLHandler } from 'graphql-mocks';
codegen(`
  const {output} = require('../helpers');
  module.exports = output(
    "const { graphqlSchema } = require('./relay-wrapper-schema.source')",
    "import { graphqlSchema } from './graphql-schema'"
  );
`);
codegen(`
  const {output} = require('../helpers');
  module.exports = output(
    "const { relayMiddleware } = require('./relay-wrapper-embed.source')",
    ""
  );
`);

const handler = new GraphQLHandler({
  resolverMap: {
    Query: {
      actors() {
        return [
          { id: '1', name: 'Suzy Bishop' },
          { id: '2', name: 'Eli Cash' },
          { id: '3', name: 'Margot Tenenbaum' },
        ];
      },
    },
  },
  middlewares: [relayMiddleware],
  dependencies: { graphqlSchema },
});

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { handler }", "");
`);
