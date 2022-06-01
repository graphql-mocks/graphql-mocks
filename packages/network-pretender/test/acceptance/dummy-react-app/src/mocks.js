import Pretender from 'pretender';
import { pretenderHandler } from '@graphql-mocks/network-pretender';
import { graphqlHandler } from './browser-handler';

export function setup() {
  const server = new Pretender(function () {
    this.post('/graphql', pretenderHandler(graphqlHandler));
  });

  server.handledRequest = function (verb, path, request) {
    console.log(`[${verb}] @ ${path}`);
    console.log({ request });
  };

  return server;
}
