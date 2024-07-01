/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const { resolve } = require('path');

const docsRoot = resolve(__dirname, '..');

execSync(``, {cwd: ''})
const paths = [
["graphql-mocks", " ../docs/static/api/graphql-mocks src/index.ts"],
["sinon", " ../docs/static/api/sinon src/index.ts"],
["paper", " ../docs/static/api/paper src/index.ts"],
["mirage", " ../docs/static/api/mirage src/index.ts"],
["network-nock", " ../docs/static/api/network-nock src/index.ts"],
["network-express", " ../docs/static/api/network-express src/index.ts"],
["network-msw", " ../docs/static/api/network-msw src/index.ts"],
["network-pretender", " ../docs/static/api/network-pretender src/index.ts"],
["network-cypress", " ../docs/static/api/network-cypress src/index.ts"],
["network-playwright", " ../docs/static/api/network-playwright src/index.ts"],
["falsos", " ../docs/static/api/falso src/index.t"],
];