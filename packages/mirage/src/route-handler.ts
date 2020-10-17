import { Response } from 'miragejs';
import { CreateGraphQLHandlerOptions } from 'graphql-mocks/graphql/types';
import { MirageRouteHandler } from './types';
import { GraphQLHandler } from 'graphql-mocks';

export function createRouteHandler(handlerOrOptions: CreateGraphQLHandlerOptions | GraphQLHandler): MirageRouteHandler {
  const graphqlHandler =
    handlerOrOptions instanceof GraphQLHandler ? handlerOrOptions : new GraphQLHandler(handlerOrOptions);

  return async function graphQLHandler(_mirageSchema, request): Promise<ReturnType<MirageRouteHandler>> {
    try {
      const { query, variables } = JSON.parse(request.requestBody);
      const result = await graphqlHandler.query(query, variables, { request });
      return new Response(200, {}, result);
    } catch (error) {
      return new Response(
        500,
        {},
        {
          errors: [JSON.stringify(error)],
        },
      );
    }
  };
}
