import { GraphQLHandler } from 'graphql-mocks';
import { RequestHandler, json } from 'express';

export function expressMiddleware(graphqlHandler: GraphQLHandler): RequestHandler {
  return function expressGraphQLHandler(req, res, next) {
    return json({ strict: false, type: ['application/json', 'text/plain'] })(
      req,
      res,
      function _expressGraphQLHandler() {
        if (req.method !== 'POST') {
          const error = new Error('Only requests with a method of "POST" are accepted');
          console.error(error);
          next(error);
          return;
        }

        if (typeof req.body !== 'object') {
          const error = new Error(`Expected request body to be an object, got ${req.body}`);
          console.error(error);
          next(error);
          return;
        }

        const { query, variables, operationName } = req.body;

        if (typeof query !== 'string') {
          const error = new Error(
            `The request body requires a "query" of type string for querying the graphql-mocks GraphQLHandler\nReceived "${typeof query}"`,
          );
          console.error(error);
          next(error);
          return;
        }

        if (variables && typeof variables !== 'object') {
          const error = new Error(
            `The request body contains "variables" of type "${typeof variables}" but should be an object"`,
          );
          console.error(error);
          next(error);
          return;
        }

        const context = { express: { req, res } };
        graphqlHandler.query(query, variables, context, { operationName }).then((result) => {
          res.json(result);
          next();
        });
      },
    );
  };
}
