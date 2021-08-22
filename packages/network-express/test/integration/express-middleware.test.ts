import { expect } from 'chai';
import { ResolverMap } from 'graphql-mocks/types';
import { Server } from 'http';
import { makeRequest } from '../test-helpers/make-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createApp } = require('../test-helpers/express-app');

describe('express-middleware', function () {
  const port = 3000;
  let server: Server;

  afterEach(() => {
    const serverClosed = new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });

    return serverClosed;
  });

  context('making queries', () => {
    beforeEach(() => {
      const app = createApp();
      const serverStarted = new Promise<void>((resolve) => {
        server = app.listen(port, () => {
          resolve();
        });
      });

      return serverStarted;
    });

    it('can handle basic queries', async function () {
      const result = await makeRequest(
        'http://localhost:3000/graphql',
        `
          query {
            helloWorld
          }
        `,
      );

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world... from operation name undefined',
        },
      });
    });

    it('can handle queries with variables', async function () {
      const result = await makeRequest(
        'http://localhost:3000/graphql',
        `
          query($ending: String!) {
            helloWorld(ending: $ending)
          }
        `,
        {
          ending: '<!!!>',
        },
      );

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world<!!!> from operation name undefined',
        },
      });
    });

    it('can handle queries with a specific operation name', async function () {
      const result = await makeRequest(
        'http://localhost:3000/graphql',
        `
          query DoThisQuery {
            helloWorld
          }

          query DoNotDoThisQuery {
            helloWorld
          }
        `,
        undefined,
        'DoThisQuery',
      );

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world... from operation name DoThisQuery',
        },
      });
    });

    it('can send errors', async function () {
      const result = await makeRequest(
        'http://localhost:3000/graphql',
        `
            query {
              ** MALFORMED QUERY **
            }
          `,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result as any).errors[0].message).to.equal('Syntax Error: Cannot parse the unexpected character "*".');
    });
  });

  it('has access to the express req and res objects', async function () {
    let expressContext: any;

    const serverStarted = new Promise<void>((resolve) => {
      const app = createApp({
        Query: {
          helloWorld(_root, _args, { express }, _info) {
            expressContext = express;
          },
        },
      } as ResolverMap);

      server = app.listen(port, () => {
        resolve();
      });
    });

    await serverStarted;
    await makeRequest(
      'http://localhost:3000/graphql',
      `
        query {
          helloWorld
        }
      `,
    );

    expect(expressContext.req).to.exist;
    expect(expressContext.res).to.exist;
    expect(expressContext.next).to.exist;
  });
});
