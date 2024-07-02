import { GraphQLHandler } from 'graphql-mocks';
import { HttpResponse, ResponseResolver } from 'msw';

export function mswResolver(graphqlHandler: GraphQLHandler): ResponseResolver {
  const responseResolver: ResponseResolver = async ({ request: req }) => {
    let body = req.body;

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

    const result = await graphqlHandler.query(query, variables, { msw: { req } }, { operationName });
    return HttpResponse.json(result, { status: 200 });
  };

  return responseResolver;
}
