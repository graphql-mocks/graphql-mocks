---
id: msw
title: msw
---

The [`msw`](https://mswjs.io/) (mock service worker) package is useful in intercepting and mocking requests in the browser. Its use of service workers means requests still appear in the network tab, creating a realistic mocking environment. With `@graphql-mocks/network-msw` the requests and responses can be handled by `msw` with a GraphQL handler for full GraphQL mocking in the browser.

**Note:** `msw` also provides its own method of GraphQL mocking where a named query is responded to with a fixture data. `graphql-mocks` provides a more universal mocking experience using resolvers and the GraphQL schema to reflect how real GraphQL APIs recursively resolve data.

## Installation

Install the `msw` and  `@graphql-mocks/network-msw` npm packages.

```bash
# npm
npm install --save-dev msw @graphql-mocks/network-msw

# yarn
yarn add --dev msw @graphql-mocks/network-msw
```

## Usage

Setup msw using the [REST API Documentation](https://mswjs.io/docs/getting-started/mocks/rest-api). To integrate with `graphql-mocks` the GraphQL handler can be added:

Create or import a `GraphQLHandler` instance and pass it to the `mswResolver` handler.

```js
// src/mocks/handlers.js
import { GraphQLHandler } from 'graphql-mocks';
import { mswResolver } from '@graphql-mocks/network-msw';
import { rest } from 'msw'
import graphqlSchema from './graphql-schema';

const graphqlHandler = new GraphQLHandler({ dependencies: { graphqlSchema }});

export const handlers = [
  rest.post('/graphql', mswResolver(graphqlHandler))
]
```

Then follow the [`msw` browser integration documentation](https://mswjs.io/docs/getting-started/integrate/browser) to integrate msw properly with your front-end build.

**Note:** The handler `src/mocks/handlers.js` file created above should be imported and used with the `setupWorkers` function.

With everything integrated, requests in the browser should be intercepted by `msw` and use the graphql rest handler with the `GraphQLHandler` for resolving GraphQL queries.

## Resolver Context

Within each resolver context is the `msw` property which contains the `req` (request), `res` (response), and `ctx` (**`msw` context**), from the `msw` rest request handler.

```js
function resolver(parent, args, context, info) {
  const { msw } = context;
  // request, response and context from the `msw` request handler
  const { req, res, ctx } = msw;
}
```
