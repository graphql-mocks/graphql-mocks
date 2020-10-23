---
title: Managing Resolvers with Middlewares
---

Adding and Managing Resolvers on a Resolver Map is a common task when setting up different scenarios. This library provides two Resolver Map Middleware functions to make this easy, `embed` and `layer`, both which can apply [Resolver Wrappers](/docs/resolver/introducing-wrappers).

## Using `layer` and `embed` with `GraphQLHandler`

The generated Resolver Map Middleware from `embed` or `layer` create Resolver Map Middlewares that most often used with `GraphQLHandler` and its `middlewares` option.

```js
const embeddedMiddleware = embed(/*...*/);
const layeredMiddleware = layer(/*...*/);

const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [embeddedMiddleware, layeredMiddleware],
});
```

## Using `embed`

`embed` is commonly used to:
* Target specific parts of the Resolver Map with [Highlight](/docs/highlight/introducing-highlight)
* Add a Resolver with or without Resolver Wrappers
* Target existing Resolvers already on the Resolver Map with Resolver Wrappers

### Add Resolver

Adds a resolver on the `users` field on the `Query` type, using a highlight callback that provides a highlight instance. See the [available highlighters](/docs/highlight/creating-highlighters) for more options on targeting the schema.

```js
const middleware = embed({
  resolver: resolverToEmbed,
  highlight: (h) => h.include(field(['Query', 'users'])),
});
```

### Add Resolver with a Resolver Wrapper

Wrappers can be applied to the resolver being embedded, also. This example passes `fooWrapper` in an array of `wrappers` that are applied in order by the `wrappers` option on `embed.

```js
const middleware = embed({
  resolver: resolverToEmbed,
  highlight: (h) => h.include(field(['Query', 'users'])),
  wrappers: [fooWrapper]
});
```
### Add Resolver Replacing Existing

Pass `true` for the `replace` option to replace any existing resolvers that might exist on the Resolver Map.

```js
const middleware = embed({
  resolver: resolverToEmbed,
  replace: true,
});
```

### Wrap Existing Resolvers with Resolver Wrappers

By not specifying a resolver, the `highlight` option will be used to select existing Resolvers and apply the the Resolver Wrappers passed into the `wrappers` option.

```js
const middleware = embed({
  highlight: (h) => h.include(field(['Query', 'users'])),
  wrappers: [fooWrapper]
});
```

## Using `layer`

Take fragments, or Resolver Map partials, and layer one or more lazily into a Resolver Map with the generated Resolver Map Middleware. These Resolver Map Partials can be defined separately and combined as needed with `layer`.

### Adding Resolve Map Partials
```js
const queryPersonPartial = {
  Query: {
    person: queryPersonResolver
  },
};

const mutationAddPersonPartial = {
  Mutation: {
    addPerson: mutationAddPersonResolver
  }
}

const middleware = layer([queryPersonPartial, mutationAddPersonPartial]);
```

The resulting `middleware` in this example would lazily apply the `queryPersonPartial`, then the `mutationAddPersonPartial` via the generated Resolver Map Middleware.

### Adding Resolvers with Resolver Wrappers

Additionally, the Resolvers that are being layered in can also be wrapped with Resolver Wrappers by passing a `wrappers` option on the second argument to `layer`.

```js
const middleware = layer(
  [resolverMapPartial],
  { wrappers: [fooWrapper, barWrapper] },
);
```

### Replace Existing Resolvers

As a safeguard, by default, resolver being added by `layer` won't replace existing resolvers unless the `replace` true option is provided.

```js
const middleware = layer(
  [resolverMapPartial],
  { replace: true },
);
```
