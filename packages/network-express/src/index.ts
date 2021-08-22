import { GraphQLHandler } from 'graphql-mocks';
import { RequestHandler, json } from 'express';

export function expressMiddleware(graphqlHandler: GraphQLHandler): RequestHandler {
  return function expressGraphQLHandler(req, res, next) {
    return json({ strict: false, type: ['application/json', 'text/plain'] })(
      req,
      res,
      function _expressGraphQLHandler() {
        if (req.method !== 'POST') {
          next(new Error('Only requests with a method of "POST" are accepted'));
          return;
        }

        if (typeof req.body !== 'object') {
          next(new Error(`Expected request body to be an object, got ${req.body}`));
          return;
        }

        const { query, variables, operationName } = req.body;

        if (typeof query !== 'string') {
          next(
            new Error(
              `The request body requires a "query" of type string for querying the graphql-mocks GraphQLHandler\nReceived "${typeof query}"`,
            ),
          );
          return;
        }

        if (variables && typeof variables !== 'object') {
          next(
            new Error(`The request body contains "variables" of type "${typeof variables}" but should be an object"`),
          );
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
