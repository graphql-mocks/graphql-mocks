---
id: creating-middlewares
title: Creating Custom Middlewares
---

## Anatomy of a Resolver Map Middleware

Resovler Map Middlewares represent the lazy application of changes to a Resolver Map. A [Resolver Map Middleware](pathname:///api/graphql-mocks/modules/types.html#ResolverMapMiddleware) receives a Resolver Map, along with some contextual options, and returns a Resolver Map. The Resolver Map returned does not need to be the same one that was passed in but it will represent the Resolver Map going forward.

```js
async (resolverMap, packOptions) => {
  // make any modifications and return a resolver map
  return resolverMap;
}
```

with `packOptions` representing:

```javascript
{
  state: Object
  dependencies: Object
}
```
Note: Only these properties should be relied on. Do not add additional properties, there is no guarantee they will be preserved.

* `state` — Useful for any storing any references that should be persisted for accessing from the outside, via the [`state` property](pathname:///api/graphql-mocks/classes/GraphQLHandler.html#state) on a `GraphQLHandler` instance.
* `dependencies` — Contains any external dependencies initially passed in when creating the `GraphQLHandler`.

The `packOptions` object is also available within Resolver Wrappers.

## Adding options to a Middleware

The easiest way of adding options to a Resolver Map is to use a function factory that provides any additional options by its arguments which are in scope for the inner Resolver Map Middleware function.

```js
const middlewareFunction = (options) => {
  // return a resolver map middleware with options in scope
  return (resolverMap, packOptions) => {
    // ... do something with the `options` reference
    return resolverMap;
  }
}
```

Then it can be used where needed, for example:

```js
const handler = new GraphQLHandler({
  resolverMap,
  middlewares: [middlewareFunction(options)],
});
```

### `highlight` option

For many Middlewares it is useful to provide a `highlight` option when a Middleware can operate on user-defined portions of the GraphQL Schema. The `highlight` option uses the Highlight system and conforms to the `CoercibleHighlight` type.

By using `CoercibleHighlight` it provides a flexible option by accepting:
* References, an array of [References](/docs/highlight/introducing-highlight#references)
* Highlight callback function `(h) => { return h.include(['Query', 'user']) }`, a callback where the highlight instance is setup and expects a returned `Highlight` instance.
* `Highlight` instance, provided directly by the consumers of the middleware

These three options can be converted into a `Highlight` instance with the [`coerceHighlight` utility](pathname:///api/graphql-mocks/modules/highlight.utils.html#coerceHighlight).

If the default behavior is to "highlight the entire schema" for a the `highlight` option the `highlightAllCallback` can be used as the default value which will highlight everything in the schema.

```js
import { coerceHighlight } from 'graphql-mocks/highlight/utils';

const middleware = ({ highlight }) => {
  return (resolverMap, packOptions) => {
    const graphqlSchema = packOptions.dependencies?.graphqlSchema;

    // ensures that a Highlight instance is provided based from
    // either references, a highlight callback, or a highlight instance
    const coercedHighlight = coerceHighlight(highlight);
  }
};
```

## Handling External Dependencies

A dependency in this case is something external to the Resolver Map Middleware that can/must be provided for the Resolver Map Middleware. An example might be a reference to a global object, or an instance of

### Shared Dependencies

If a dependency is considered shared amongst multiple Resolver Map Middlewares or Resolver Wrappers use the `dependencies` the external dependencies, `packOptions.dependencies`,  provided on the second argument of a Resolver Map Middleware.

```js
const middleware = return (resolverMap, packOptions) => {
  // pull `fooDependency` reference off packOptions.dependencies
  const foo = packOptions.dependencies?.fooDependency

  if (!foo) {
    throw new Error('`foo` is a required dependency');
  }
}
```

### Isolated Dependencies

When a dependency is used only for a single instance of a middleware it can be provided as an [option in a factory function](/docs/resolver-map/creating-middlewares#adding-options-to-a-middleware).

```js
const middlewareFunction = ({ someDependency }) => {
  return (resolverMap, packOptions) => {
    // ... do something with the `someDependency` reference
    return resolverMap;
  }
}
```

## Complete Example

To show a complete example where a highlight option, with a default `highlightAllCallback` option, is used to iterate over the references and add a resolver for the reference.

```js
import { walk, coerceHighlight } from 'graphql-mocks/highlight/utils';
import { setResolver } from 'graphql-mocks/resolver-map';
import { highlightAllCallback } from 'graphql-mocks/resolver-map/utils';

const middleware(options) {
  // will either be the given highlight option or fallback to highlighting all
  const highlight = coerceHighlight(options?.highlight ?? highlightAllCallback);

  return async (resolverMap, packOptions) => {
    const graphqlSchema = packOptions.dependencies?.graphqlSchema;

    // use references from highlight to iterate over all options
    await walk(graphqlSchema, highlight.references, (reference) => {
      setResolver(resolverMap, reference, () => 'resolver function!', { replace: true });
    });

    return resolverMap;
  }
}
```

## Useful Utilities

When operating on the landscape of a Resolver Map there are some useful utilities to consider using.

### `setResolver`

`import { setResolver } from 'graphql-mocks/resolver-map';`

[API Documentation](pathname:///api/graphql-mocks/modules/resolverMap.html#setResolver)

Add a Resolver function to a Resolver Map at a given reference.

### `getResolver`

`import { getResolver } from 'graphql-mocks/resolver-map';`

[API Documentation](pathname:///api/graphql-mocks/modules/resolverMap.html#getResolver)

Get a Resolver function from a Resolver Map for a given reference.

### `applyWrappers`

`import { applyWrappers } from 'graphql-mocks/resolver';`

[API Documentation](pathname:///api/graphql-mocks/modules/resolver.html#applyWrappers)

Generally, it's easiest to use [`embed`](/docs/resolver-map/available-middlewares#embed) and [`layer`](/docs/resolver-map/available-middlewares#layer) Resolver Map Middleware functions to add wrappers. In other cases it might be useful for a custom Resolver Map Middleware to have an array of wrappers passed in as an option and apply them to a Resolver function using `applyWrappers`.
