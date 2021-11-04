---
id: handler-state
title: Handler State
---

The `GraphQLHandler` provides a `state` object that is available within Middlewares, Wrappers, and Resolvers. It is generically available for persisting anything across the duration of an instance of `GraphQLHandler`.

```js
const handler = new GraphQLHandler({
  dependencies: { graphqlSchema }
});

const { state } = handler;
```

For example for testing the `@graphql-mocks/sinon` installs spies on the resolvers for testing, and these are made available on the `state` object.

```js
import { GraphQLHandler, embed } from 'graphql-mocks';
import { spyWrapper } from '@graphql-mocks/sinon';

const spyMiddleware = embed({ wrappers: [spyWrapper] });

const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [spyMiddleware],
  dependencies: { graphqlSchema },
});

await handler.query(`{ hello }`);
expect(handler.state.spies?.Query?.hello.callCount).to.equal(1);
```
