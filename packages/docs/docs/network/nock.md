---
id: nock
title: Nock
---

[Nock](https://github.com/nock/nock) is used for testing and mocking http requests in Node. Integrating `graphql-mocks` with Nock is easy with `@graphql-mocks/network-nock`.

## Installation

Install the `nock` and  `@graphql-mocks/network-nock` npm packages.

```bash
# npm
npm install --save-dev nock @graphql-mocks/network-nock

# yarn
yarn add --dev nock @graphql-mocks/network-nock
```

## Usage

In any Nock POST `.reply()`, use the `nockHandler` with a `GraphQLHandler` instance.

```js
import { GraphQLHandler } from 'graphql-mocks';
import graphqlSchema from './graphqlSchema';
import { nockHandler } from '@graphql-mocks/network-nock';
import nock from 'nock';

const graphqlHandler = new GraphQLHandler({
  dependencies: { graphqlSchema }
};

nock('http://graphql-api.com')
  .post('/graphql')
  .reply(nockHandler(graphqlHandler));
```

The `nockHandler` function also accepts an `options` argument, an object with `checkGraphQLResult` and `checkRequest` callbacks:

```js
nockHandler(graphqlHandler, {
  checkRequest(request, requestBody) => void,
  checkGraphQLResult: (result) => void
})
```

These callbacks are useful for doing checks or additional assertions during testing
* `checkRequest` callback is passed the incoming `request` and the `requestBody`
* `checkGraphQLResult` callback is passed the result from the GraphQLHandler

With the above nock handler setup, a `node-fetch` call will be intercepted by and responded to from nock and graphql-mocks.

```js
import fetch from 'node-fetch';

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
  }),
}).then(async (response) => {
  // get the final json payload
  const result = await response.json();
  return result;
})
```

See the [GraphQL docs](https://graphql.org/learn/serving-over-http/#post-request) for details on these body parameters, and making http requests.

### Resolver Context

The Nock request object is made available within the resolver `context` under the `nock` property:

```js
function resolver(parent, args, context, info) {
  const { nock } = context;

  // reference to the Nock request object
  nock.request;
}
```

## API Documentation

See the [API Documentation](/api/network-nock/) for types and more details.
