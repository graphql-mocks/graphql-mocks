---
id: pretender
title: Pretender
---

[Pretender](https://github.com/pretenderjs/pretender) is a javascript library for the browser that intercepts network requests made with fetch or XMLHttpRequest. It has a straight-forward syntax for defining routes. Unlike [mock service worker](/docs/network/msw), which relies on service workers, pretender patches globals in order to capture requests made. This makes pretender quicker to setup than `msw` but sacrifices amongst other benefits; being able to see the intercepted requests in the network tab of browser developer tools. Captured network requests from pretender can be logged however (see below).

## Installation

```bash
# npm
npm install --save-dev nock @graphql-mocks/network-pretender

# yarn
yarn add --dev nock @graphql-mocks/network-pretender
```

## Usage

```js
import Pretender from 'pretender';
import { pretenderHandler } from '@graphql-mocks/network-pretender';
import graphqlSchema from './graphql-schema';
import { GraphQLHandler } from 'graphql-mocks';

// create or import GraphQLHandler
const graphqlHandler = new GraphQLHandler({
  dependencies: { graphqlSchema }
});

// create Pretender instance
const server = new Pretender(function () {
  // specify route or url to intercept with created handler via `pretenderHandler`
  this.post('http://graphql-api.com/graphql', pretenderHandler(graphqlHandler));
});
```

### Logging Intercepted Requests

While there isn't the network tab to check there is logging that can be added to captured requests that can help with debugging.

```js
const server = new Pretender(function () {
  this.post('http://graphql-api.com/graphql', pretenderHandler(graphqlHandler));
});

server.handledRequest = function (verb, path, request) {
  console.log(`[${verb}] @ ${path}`);
  console.log({ request });
};
```

### Resolver Context

The pretender request object is made available within the resolver `context` under the `pretender` property:

```js
function resolver(parent, args, context, info) {
  const { pretender } = context;

  // reference to the Pretender request object
  pretender.req;
}
```

## API Documentation

See the [API Documentation](/api/network-pretender/) for types and more details.
