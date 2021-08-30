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

In any Nock `.reply()`, use the `nockHandler` by calling it with a `GraphQLHandler` instance.

```js
import { GraphQLHandler } from 'graphql-mocks';
import { nockHandler } from '@graphql-mocks/network-nock';
import nock from 'nock';

const graphqlHandler = new GraphQLHandler({
  dependencies: { graphqlSchema }
};

nock('http://graphql-api.com')
  .post('/graphql')
  .reply(nockHandler(graphqlHandler));
```

The `nockHandler` function accepts an `options` object with `checkGraphQLResult` and `checkRequest` callbacks:

```js
nockHandler(graphqlHandler, {
  checkRequest(request, requestBody) => void,
  checkGraphQLResult: (result) => void
})
```

These callbacks are useful for doing checks or additional assertions during testing
* `checkRequest` callback is passed the incoming `request` and the `requestBody`
* `checkGraphQLResult` callback is passed the result from the GraphQLHandler

The `nockHandler` will pass along the [Operation Name](https://graphql.org/learn/serving-over-http/#post-request) it receives from the request.

### Resolver Context

The Nock request object is made available within the `context` arg for each GraphQL resolver:

```js
function resolver(parent, args, context, info) {
  // reference to the Nock request
  const { request } = context;
}
```

## API Documentation

See the [API Documentation](/api/network-nock/) for types and more details.
