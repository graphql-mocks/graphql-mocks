import { setupWorker, rest } from 'msw';
import { mswResolver } from '@graphql-mocks/network-msw';
import { graphqlHandler } from '../graphql-handler';

export function setup() {
  const worker = setupWorker(rest.post('/graphql', mswResolver(graphqlHandler)));
  worker.start();
  return worker;
}
