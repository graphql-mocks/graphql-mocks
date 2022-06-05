import { expect } from 'chai';
import { resolve } from 'path';
import { browserAcceptanceTests } from './browser-tests';
import { serveReactApp } from './serve-react-app';

describe('browser-acceptance-tests', function () {
  const PACKAGE_ROOT = resolve(__dirname, '..');
  const PORT = '3232';
  let disconnectServer;

  before(async function () {
    this.timeout(1000 * 60 * 3);
    disconnectServer = await serveReactApp(PORT);
  });

  after(function () {
    disconnectServer();
  });

  it('it is configured to serve on the correct port', function () {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pJson = require(resolve(PACKAGE_ROOT, 'package.json'));
    expect(pJson.scripts.serve.includes(PORT)).to.be.true;
  });

  describe('network-pretender', browserAcceptanceTests('network-pretender', PORT));
  describe('network-msw', browserAcceptanceTests('network-msw', PORT));
});
