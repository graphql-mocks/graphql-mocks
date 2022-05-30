import { GraphQLHandler } from 'graphql-mocks';
import { ResponseHandler } from 'pretender';

export const pretenderHandler = (graphqlHandler: GraphQLHandler): ResponseHandler => {
  return async function (req) {
    let body = req.requestBody;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (!body) {
      throw new Error(`No request body provided, received "${typeof body}" with:\n ${JSON.stringify(body)}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { query, variables, operationName } = body as any;

    if (!query) {
      throw new Error(
        'No "query" provided in request body but is required for querying with graphql-mocks graphql handler',
      );
    }

    const result = await graphqlHandler.query(query, variables, { pretender: { req } }, { operationName });
    return [200, { 'Content-Type': 'application/json' }, JSON.stringify(result)];
  };
};
