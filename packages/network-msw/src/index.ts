import { GraphQLHandler } from 'graphql-mocks';
import { MswResponseResolver } from './types';

export function mswResolver(graphqlHandler: GraphQLHandler): MswResponseResolver {
  const responseResolver: MswResponseResolver = async (req, res, ctx) => {
    let body = req.body;

    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (!body) {
      throw new Error(`No request body provided, received "${typeof body}" with:\n ${JSON.stringify(body)}`);
    }

    const { query, variables, operationName } = body as any;

    if (!query) {
      throw new Error(
        'No "query" provided in request body but is required for querying with graphql-mocks graphql handler',
      );
    }

    const result = await graphqlHandler.query(query, variables, { msw: { req, res, ctx } }, { operationName });
    return res(ctx.status(200), ctx.json(result));
  };

  return responseResolver;
}
