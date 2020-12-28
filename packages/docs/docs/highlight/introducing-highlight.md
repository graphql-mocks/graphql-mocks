---
title: Introducing Highlight
---

One of the most important parts about mocking a GraphQL API is being able to quickly and effectively target specific parts of the GraphQL Schema. Highlight is a declarative, extensible, system for describing _Named Types_, and their fields, of the GraphQL Schema. With this type of control it becomes quick to mock specific types and fields and use Highlights in Resolver Map Middlewares and other utilities.

Here is an brief example of using _Highlight_:

```js
import { hi, field } from '@graphql-mocks/highlight';
import graphqlSchema from './schema';

const highlights = hi(graphqlSchema).include(field(['Query', '*']));
```

In this example, `field` is a Highlighter and it targets fields on the schema. The Highlighter being used with the Highlight system will capture all the fields (denoted by the `*`) on the `Query` type of the schema. Highlighters are what are used to declaratively identify the different parts of a GraphQL schema. There are [more highlighters](/docs/highlight/available-highlighters) to check out, also learn how to [create your own](/docs/highlight/creating-highlighters).

## The `Highlight` instance

```js
import { hi, Highlight } from '@graphql-mocks/highlight';
import graphqlSchema from './schema';
const h1 = hi(graphqlSchema);
const h2 = new Highlight(graphqlSchema);
```

`hi` or the `Highlight` constructor can be imported from `@graphql-mocks/highlight` and both will produce a `Highlight` instance. An instance has three available methods:

* `include` - Add additional highlights/references to be included
* `exclude` - Remove specified highlights/references from being included
* `filter` - Filter the existing selection to include the specified highlights/references

**Note:** All three of these take the same arguments, as many Higlighters or `Reference`s to include/exclude/filter, and return a new `Highlight` instance. That is each instance is _immutable_ and any modification through its public APIs produces a new instance.

_Highlight all Query and Mutation fields while excluding the Query.users field_
```js
const highlights = hi(graphqlSchema)
  .include(field(['Query', '*'], ['Mutation', '*']))
  .exclude(field(['Query', 'users']));
```

## References

The underlying primitive for Highlight and many of the utilities in graphql-mocks are References. References can define:
* GraphQL types by a single string as a [Type Reference](/api/modules/_highlight_types_.html#typereference), `"Query"` for example
* GraphQL fields by a tuple [Field Reference](/api/modules/_highlight_types_.html#fieldreference) `["Query", "allUsers"]` of the type name and field name.

Any functions using the [`Reference`](/api/modules/_highlight_types_.html#reference) type accept either a Type Reference or a Field Reference.

## Pulling Highlighted References from a `Highlight` instance

A `Highlight` instance stores the [References](/docs/highlight/introducing-highlight#references) that have been highlighted. These can be pulled and used for many of the underlying utilities that use `Reference`s for arguments.

```js
const higlights = hi(graphqlSchema).include(field(['Query', '*']));
console.log(highlights);
```

Would log a list of highlighted references, for example:
```js
[
  ['Query', 'users'],
  ['Query', 'customers'],
  ['Query', 'products']
  // ... including all other highlighted References
]
```

## `highlight` Middleware Option

Much of the highlighting will happen in Resolver Map Middlewares or as arguments for Resolver Map Middlewares, like with [`embed`](/docs/resolver-map/managing-resolvers#wrap-existing-resolvers-with-resolver-wrappers). It is useful to support a `highlight` argument that conforms to the [`CoercibleHighlight`](/api/modules/_highlight_types_.html#coerciblehighlight) interface and provides a flexible argument for users of the Middleware. More on this design pattern is covered in Creating Middlewares, but it's usually easiest to supply a callback where the highlight instance is already provided:

```js
middleware({
  highlight: (h) => h.include(field(['Query', '*']))
});
```

The `CoercibleHighlight` type includes raw [References](/docs/highlight/introducing-highlight#references).
