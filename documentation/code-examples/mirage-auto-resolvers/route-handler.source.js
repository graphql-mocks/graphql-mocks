import { createServer } from 'miragejs';
import { createRouteHandler } from 'graphql-mocks/mirage';
import { patchAutoFieldResolvers } from 'graphql-mocks/mirage';

codegen(`
  const {output} = require('../helpers');
  module.exports = output("const graphqlSchema = 'schema { query: Query } type Query { noop: String }'", "");
`);

createServer({
  routes() {
    // capture mirageServer dependency
    const mirageServer = this;

    // create a route handler for POSTs to `/graphql`
    // using `createRouteHandler`
    this.post(
      'graphql',
      createRouteHandler({
        middlewares: [patchAutoFieldResolvers()],
        dependencies: {
          mirageServer,
          graphqlSchema,
        },
      }),
    );
  },
});
