import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { mswResolver } from '@graphql-mocks/network-msw';
import { graphqlHandler } from '../graphql-handler';

export async function setup() {
  const worker = setupWorker(http.post('/graphql', mswResolver(graphqlHandler)));
  await worker.start();
  return worker;
}
