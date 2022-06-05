import { expect, test } from '@oclif/test';
import { resolve } from 'path';
import * as sinon from 'sinon';
import Serve from '../../src/commands/serve';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');

describe('serve', function () {
  let server: any = null;
  let listenSpy: any = null;
  let axiosPostSpy: any = null;

  this.timeout(10000);

  beforeEach(function spyOnExpress() {
    Serve.express = (() => {
      const app = express();
      const listen = app.listen.bind(app);

      listenSpy = sinon.spy((...args) => {
        server = listen(...args);
        return server;
      });

      app.listen = listenSpy;
      return app;
    }) as any;
  });

  beforeEach(function spyOnAxios() {
    axiosPostSpy = sinon.spy(Serve.axios, 'post');
  });

  afterEach(async function () {
    await new Promise((resolve) => (console.log('Stopping server...'), server.close(resolve)));
    Serve.express = express;
    axiosPostSpy.restore();
  });

  test
    .stdout()
    .command([
      'serve',
      '--fake',
      '--schema',
      resolve(__dirname, '../test-helpers/test-package/graphql-mocks/schema.graphql'),
    ])
    .it('serves with a fake middleware', async (ctx) => {
      expect(ctx.stdout).to.contain('Press Ctrl+C');
      expect(listenSpy.called).to.be.true;
      const result: any = await axios.post(`http://localhost:4444/graphql`, { query: `{ hello }` });
      expect(typeof result.data.data.hello).to.equal('string');
    });

  test
    .stdout()
    .command([
      'serve',
      '--schema',
      resolve(__dirname, '../test-helpers/test-package/graphql-mocks/schema.graphql'),
      '--handler',
      resolve(__dirname, '../test-helpers/test-package/graphql-mocks/handler.js'),
    ])
    .it('serves with a loaded graphql handler', async (ctx) => {
      expect(ctx.stdout).to.contain('Press Ctrl+C');
      expect(listenSpy.called).to.be.true;
      const result: any = await axios.post(`http://localhost:4444/graphql`, { query: `{ hello }` });
      expect(result.data.data.hello).to.equal('Hello World from a custom graphql handler');
    });

  test
    .stdout()
    .command([
      'serve',
      '--port',
      '8383',
      '--fake',
      '--schema',
      resolve(__dirname, '../test-helpers/test-package/graphql-mocks/schema.graphql'),
    ])
    .it('serves on a custom port', async (ctx) => {
      const customPort = '8383';
      expect(ctx.stdout).to.contain('Press Ctrl+C');
      expect(listenSpy.called).to.be.true;
      const result: any = await axios.post(`http://localhost:${customPort}/graphql`, { query: `{ hello }` });
      expect(typeof result.data.data.hello).to.equal('string');
    });

  test
    .stdout()
    .command([
      'serve',
      '--fake',
      '--schema',
      'https://api.spacex.land/graphql',
      '--header',
      'Authorization=Bearer Token',
      '--header',
      'OtherHeader=Other Value',
    ])
    .it('serves with fetching a custom schema with custom headers', async (ctx) => {
      expect(ctx.stdout).to.contain('Press Ctrl+C');
      expect(listenSpy.called).to.be.true;
      const result: any = await axios.post(`http://localhost:4444/graphql`, { query: `{ ships { id } }` });
      const axiosCallArgs = (axios.post as any).firstCall.args;
      expect(axiosCallArgs[0]).to.equal('https://api.spacex.land/graphql');
      expect(axiosCallArgs[1].Headers).to.deep.equal({ OtherHeader: 'Other Value', Authorization: 'Bearer Token' });
      // using the public api space x api with fake, should generate some fake ships data
      expect(Array.isArray(result.data.data.ships)).to.be.true;
    });
});
