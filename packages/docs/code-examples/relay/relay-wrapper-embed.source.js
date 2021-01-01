import { embed } from 'graphql-mocks';
import { relayWrapper } from 'graphql-mocks/relay';

const relayMiddleware = embed({
  wrappers: [
    relayWrapper({
      cursorForNode: (node) => node.id,
      force: false,
    }),
  ],
});

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { relayMiddleware }", "");
`);
