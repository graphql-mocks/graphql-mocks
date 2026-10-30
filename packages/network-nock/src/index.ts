import type { ClientRequest } from 'node:http';
import { GraphQLHandler } from 'graphql-mocks';
import type nock from 'nock';

type Body = nock.Body;
type ReplyFnResult = nock.ReplyFnResult;

/**
 * The request nock gives to a reply function. This is a Node `ClientRequest` in nock 14
 * and a Fetch API `Request` in nock 15.
 */
export type NockRequest = ClientRequest | Request;

type ReplyFn = (
  this: { req?: ClientRequest },
  ...args: [uri: string, body: Body] | [request: Request]
) => Promise<ReplyFnResult>;

export function nockHandler(
  graphqlHandler: GraphQLHandler,
  options?: {
    checkRequest?: (request: NockRequest, body: Body) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkGraphQLResult?: (result: Record<string, any>) => void;
  },
): ReplyFn {
  // Declared with rest args so the function has a `length` of 0. nock 15 runs any reply
  // function with exactly two declared parameters through `util.promisify` and then waits
  // on a callback that never comes.
  const internalHandler: ReplyFn = async function (...args) {
    const checkRequest = options?.checkRequest;
    const checkGraphQLResult = options?.checkGraphQLResult;
    const [first, second] = args as [string | Request, Body?];

    let request: NockRequest;
    let requestBody: Body;

    if (typeof first === 'string') {
      // nock 14: called with `(uri, body)` and the Node request on `this.req`
      request = this.req as ClientRequest;
      requestBody = second as Body;
    } else {
      // nock 15: called with a Fetch `Request` as the only argument
      request = first;
      requestBody = await first.clone().text();
    }

    const { query, operationName, variables } = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;

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
