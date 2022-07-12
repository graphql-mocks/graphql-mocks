import type { GraphQLHandler } from 'graphql-mocks';
import type { RouteHandlerController } from 'cypress/types/net-stubbing';

export function cypressHandler(graphqlHandler: GraphQLHandler): RouteHandlerController {
  return async (request) => {
    const { body } = request;

    if (!body) {
      return request.reply({
        statusCode: 400,
        body: {
          errors: [
            {
              message: `No request body provided in the request but it's required for querying with graphql-mocks`,
            },
          ],
        },
      });
    }

    const { query, variables, operationName } = body;

    if (!query) {
      return request.reply({
        statusCode: 400,
        body: {
          errors: [
            {
              message: `No "query" provided in request body but it's required for querying with graphql-mocks`,
            },
          ],
        },
      });
    }

    const result = await graphqlHandler.query(query, variables, { cypress: { request } }, { operationName });
    request.reply(200, result);
  };
}
