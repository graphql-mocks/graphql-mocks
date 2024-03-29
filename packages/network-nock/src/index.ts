import { GraphQLHandler } from 'graphql-mocks';
import { ReplyFnContext, ReplyFnResult, Body } from 'nock/types/index';

type ReplyFn = (this: ReplyFnContext, uri: string, body: Body) => ReplyFnResult | Promise<ReplyFnResult>;

export function nockHandler(
  graphqlHandler: GraphQLHandler,
  options?: {
    checkRequest?: (request: ReplyFnContext['req'], body: Body) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkGraphQLResult?: (result: Record<string, any>) => void;
  },
): ReplyFn {
  const internalHandler: ReplyFn = async function (_uri, requestBody) {
    const checkRequest = options?.checkRequest;
    const checkGraphQLResult = options?.checkGraphQLResult;
    const { query, operationName, variables } = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;

    const request = this.req;

    if (checkRequest) {
      checkRequest(request, requestBody);
    }

    const context = { nock: { request } };
    const result = await graphqlHandler.query(query, variables, context, { operationName });

    if (checkGraphQLResult) {
      checkGraphQLResult(result);
    }

    return [200, result];
  };

  return internalHandler;
}
