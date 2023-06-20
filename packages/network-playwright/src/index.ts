import type { Request, Route } from '@playwright/test';
import type { GraphQLHandler } from 'graphql-mocks';

export function playwrightHandler(graphqlHandler: GraphQLHandler) {
  return async (route: Route, request: Request): Promise<void> => {
    const body = request.postDataJSON();

    if (!body) {
      return route.fulfill({
        status: 400,
        json: {
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
      return route.fulfill({
        status: 400,
        json: {
          errors: [
            {
              message: `No "query" provided in request body but it's required for querying with graphql-mocks`,
            },
          ],
        },
      });
    }

    const result = await graphqlHandler.query(query, variables, { playwright: { request, route } }, { operationName });

    return route.fulfill({
      status: 200,
      json: result,
    });
  };
}
