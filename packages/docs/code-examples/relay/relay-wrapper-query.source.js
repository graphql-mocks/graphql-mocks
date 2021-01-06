codegen(`
  const {output} = require('../helpers');
  module.exports = output("const { handler } = require('./relay-wrapper-handler.source');", "");
`);

const query = handler.query(`
  {
    actors(first: 2) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`);

codegen(`
  const {output} = require('../helpers');
  module.exports = output("module.exports = { query }", "query.then((result) => console.log(result));");
`);
