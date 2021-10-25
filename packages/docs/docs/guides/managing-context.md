---
id: managing-context
title: Managing Resolver Context
---

Every GraphQL Resolver has a [context argument](/docs/resolver/using-resolvers#context-parameter-third). The `graphql-mocks` framework manages this context object and provides various entry points to include additional properties on the context object.

1. [Initital Context](#initial-context)
2. [Query Context](#query-context)
3. [Resolver Wrapper Context](#resolver-wrapper-context)
4. [Framework Managed Context](#framework-managed-context)

All of these contexts are flattened into a single context object available within a Resolver:
```js
function resolver(parent, args, context, info) {
  // the context object is available as the third argument in a resolver
}
```

## Initial Context

The optional initial context object is used as the base context, and is passed into the constructor of `GraphQLHandler`:

```js
const handler = new GraphQLHandler({
  initialContext: {
    /*
      provides the base for all context objects
    */
  }
});
```

## Query Context

An additional context object can be included on a per-query basis on the third argument of `query` method of the `GraphQLHandler` instance.

```js
const additionalContext = {};
await handler.query(query, variables, additonalContext);
```

## Resolver Wrapper Context

A Resolver Wrapper can return a new "outer" resolver that wraps the initial resolver. The "outer" resolver is a resolver function and therefore has access to the same context argument where it can be modified.

```js
import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';

const wrapper = createWrapper('my-wrapper', WrapperFor.FIELD, function resolverWrapper(originalResolver, wrapperOptions) {
  return async function outerResolver(parent, args, context, info) {

    // access to the `context` object here can be modified
    // and conditionally changed what is passed to the
    // `originalResolver`

    return await originalResolver(parent, args, context, info);
  };
});
```

Learn more with [Introducing Resolver Wrappers](/docs/resolver/introducing-wrappers) and [Creating Custom Wrappers](/docs/resolver/creating-wrappers).

## Framework Managed Context

The `graphql-mocks` framework manages the context available in Resolvers to include additional helpful references to dependencies and current network requests and responses.

### Dependencies

[Dependencies](/docs/handler/introducing-handler#dependencies) added to a `GraphQLHandler` can be accessed within a Resolver Wrapper via the [`extractDependencies` function](pathname:///api/graphql-mocks/modules/resolver.html#extractDependencies).

```js
function resolver(parent, args, context, info) {
  const { paper, anotherDependency } = extractDependencies(context, ['paper', 'anotherDependency']);
}
```

### Network Requests and Responses

Most [Network Handlers](/docs/network/introducing-network-handlers) will include the request and/or response, and other useful context within the resolver `context` argument. These can be destrutured from the context object and are documented for each network handler.

For example the [Mock Service Worker (`msw`) Network Handler](/docs/network/msw#resolver-context) includes the `msw` property with access to the request and response.

```js
function resolver(parent, args, context, info) {
  const { msw } = context;
  // request and response from the `msw` request handler
  const { req, res } = msw;
}
```
