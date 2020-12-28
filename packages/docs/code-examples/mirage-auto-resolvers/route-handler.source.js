import { createServer } from 'miragejs';
import { createRouteHandler, mirageMiddleware } from '@graphql-mocks/mirage';

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
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema,
        },
      }),
    );
  },
});
