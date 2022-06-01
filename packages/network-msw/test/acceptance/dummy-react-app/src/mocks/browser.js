import { setupWorker, rest } from 'msw';
import { mswResolver } from '@graphql-mocks/network-msw';
import { graphqlHandler } from './browser-handler';

export const worker = setupWorker(rest.post('/graphql', mswResolver(graphqlHandler)));
