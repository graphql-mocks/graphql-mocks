---
id: using-middlewares
title: Using Middlewares
---

The `GraphQLHandler` accepts an array of middlewares, chaining together a series of modifications to the Resolver Map (or an empty object if one does not exist). After all the Middlewares have been run the `GraphQLHandler` takes the final "packed" Resolver Map and applies each Resolver function to the `GraphQLSchema`, its types and fields.

The specific internal mechanics of a middleware are explained in [Introducing Resolver Map Middlewares](/docs/resolver-map/introducing-middlewares) and the following sections.

## Adding Middlewares at Initialization

The most common way of applying Resolver Map Middlewares is at initialization via the `middlewares` option on the `GraphQLHandler` constructor.

```js
import { GraphQLHandler, embed } from 'graphql-mocks';
import { middlewareA, middlewareB } from './middlewares';

const handler = new GraphQLHandler({
  middlewares: [middlewareA, middlewareB]
  dependencies: { graphqlSchema }
});
```

## Adding Middlewares via `applyMiddlewares`
* [API documentation](pathname:///api/graphql-mocks/classes/GraphQLHandler.html#applyMiddlewares)

After initialization of the handler middlewares can be applied via the `applyMiddlewares` method.

```js
import { GraphQLHandler, embed } from 'graphql-mocks';
import { middlewareA, middlewareB } from './middlewares';

const handler = new GraphQLHandler({
  dependencies: { graphqlSchema }
});

handler.applyMiddlewares([falsoMiddleware, loggingMiddleware], { reset: false });
```

### Options
The second argument to `applyMiddlewares` is an optional object of options.

#### `reset`
* Default: `false`

If `true` this option resets the middlewares used to those passed in on the first argument to `applyMiddlewares`. If `false` the middlewares are added to the end of the currently existing array of middlewares.
