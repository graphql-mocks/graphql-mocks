/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

export class MockPretender {
  handler: any;

  async handleRequest(request: any): Promise<any> {
    return this.handler(request);
  }

  async post(_: any, requestHandler: any): Promise<any> {
    this.handler = requestHandler;
  }
}

export function createMockRequest(query: string, variables?: Record<string, any>): any {
  return {
    url: '/graphql',
    requestBody: JSON.stringify({
      query,
      variables,
    }),
  };
}
