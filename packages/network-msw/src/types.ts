import { ResponseResolver, RestContext, MockedRequest } from 'msw';

export type MswResponseResolver = ResponseResolver<MockedRequest, RestContext>;
