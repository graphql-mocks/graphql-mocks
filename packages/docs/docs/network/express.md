---
id: express
title: Express
---

[Express](https://expressjs.com/) is a popular node.js web server library. Mocks loaded into a  `GraphQLHandler` can be integrated with express, via `@graphql-mocks/network-express`, to provide a live running server. This is useful when needing a live endpoint to test against or hosting mocks to share with others.

## Installation

Install the `express` and  `@graphql-mocks/network-express` npm packages.

```bash
# npm
npm install --save-dev express @graphql-mocks/network-express

# yarn
yarn add --dev express @graphql-mocks/network-express
```

## Usage

Use `expressMiddleware` from `@graphql-mocks/network-express` as an [application-level middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.application) or [router middleware](https://expressjs.com/en/guide/using-middleware.html#middleware.router).

This example sets up a file `server.js` using an express server with the `expressMiddleware` as an application-middleware, listening on port 8080.

```js
// server.js

const { GraphQLHandler } = require('graphql-mocks');
const { expressMiddleware } = require('@graphql-mocks/network-express');
const express = require('express');

const graphqlHandler = new GraphQLHandler({
  dependencies: { graphqlSchema }
};

const app = express();
app.post('/graphql', expressMiddleware(graphqlHandler));

const port = 8080;
app.listen(port);
```

Start the express app.

```shell
node server
```

The server will now be responding to graphql `POST` requests at `http://localhost:8080/graphql`.

For example, making a request using fetch (in the browser or via `node-fetch`)

```js
fetch('http://localhost:8080/graphql, {
  method: 'POST',
  body: JSON.stringify({
    // required
    query: `
      query {
        # graphql query
      }
    `,

    // optional
    variables: {},

    // optional
    operationName: 'OperationName'
  })
}).then(async (response) => {
  // get the final json payload
  const result = await response.json();
  return result;
});
```

See the [GraphQL docs](https://graphql.org/learn/serving-over-http/#post-request) for details on these body parameters, and making http requests.

### Resolver Context

The express request and response objects are available on the resolver `context` argument, under the `express` property.

```js
function resolver(parent, args, context, info) {
  const { req, res } = context.express;
}
```

 ## API Documentation

 See the [API Documentation](/api/network-express/) for types and more details.
