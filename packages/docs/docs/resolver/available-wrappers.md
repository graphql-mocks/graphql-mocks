---
id: available-wrappers
title: Available Wrappers
---

The following is a list of Resolver Wrappers. If you create one that could be useful for the community please open an
Issue or Pull Request so that it can be added. Also, learn how to [create your own](/docs/resolver/creating-wrappers) and
[apply Resolver Wrappers](/docs/resolver/applying-wrappers) to a Resolver Map.

## Log Wrapper

Package: `graphql-mocks`

```js
import { logWrapper } from 'graphql-mocks/wrapper';
```

This Resolver Wrapper applies logging around the resolver. It logs the arguments the Resolver function is called with,
as well as the result. It is useful for troubleshooting and understanding the flow of data in and out of a Resolver.
Selectively apply it using the `highlight` option with `embed` to pinpoint which Resolvers receive logging. When used
with other wrappers it is recommended that the position be considered as outer wrappers won't include logging.

## Relay Wrapper

This wrapper is handy for being able a resolver's result and applying [relay pagination](https://relay.dev/graphql/connections.htm) to it.

The documentation for the Relay Wrapper is covered in the [Relay Pagination Guide](/docs/guides/relay-pagination).

## Spy Wrapper

Package: `graphql-mocks`

```js
import { spyWrapper } from 'graphql-mocks/wrapper';
```

**Note: Sinon must be installed as a `devDependency` to be used with this wrapper**

The `spyWrapper` adds spies to the Resolver and makes them available on the `state` property on the `GraphQLHandler`
instance.

```js
const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [embed({ wrappers: [spyWrapper] })],
  dependencies: { graphqlSchema },
});

await handler.query(`{ hello }`);
expect(handler.state?.spies?.Query?.hello.callCount).to.equal(1);
```

This is especially handy testing strict scenarios where assertions need to be made around how many times a Resolver was
called, what it was called with and what was returned. When used with other Resolver Wrappers it should be considered which order the Spy is applied.
