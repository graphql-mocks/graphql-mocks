---
id: concepts
title: Concepts
---

These are some concepts and terms you might see when looking to mock your
GraphQL API.

## GraphQL Concepts
Since this library aims at mimicking a GraphQL API server it is focuses on the
*execution* and resolution of queries. We use
Resolvers and Resolver Maps to handle this execution. The [graphql
docs](https://graphql.org/learn/execution) have some useful information around
these concepts. With a Resolver Map, and any optional Middlewares, a GraphQL Handler
be created to resolve queries.

### Resolver
Resolvers are functions that are responsible for returning the data for a field on a type.

For the given schema:
```graphql
schema {
  query: Query
}

# Query is the type
type Query {
  # `helloWorld` is the field on the Query type that should
  # represent a string
  helloWorld: String!
}
```

A resolver function for the `helloWorld` field could be:
```js
const resolverFunction = function (obj, args, context, info) {
  return 'Hello world, from a GraphQL Resolver!';
}
```

This resolver function on its own isn't very useful, we need to attach it to a
 field on a Resolver Map. To learn more about resolvers themselves check out
 this part of the [graphql documentation](https://graphql.org/learn/execution/#root-fields-resolvers).

### Resolver Map
Resolver Maps are a collection of resolvers keyed by type and field. Here's the
same schema from above:

```graphql
# Query is the type
type Query {
  # `helloWorld` is the field on the Query type that should
  # represent a string
  helloWorld: String!
}
```

A Resolver Map for this schema could look like:
```js
const resolverMap = {
  // Query is the first property representing the Query type
  Query: {
    // the `helloWorld` property on Query represents the field
    // on Query, and attached to it is our resolverFunction form above
    helloWorld: resolverFunction
  }
};
```

With a Resolver Map the types, fields, and resolvers are enough for the complete package to resolve queries. This library provides tools to
setup, extend, and organize your Resolver Maps and Resolvers.

## Library Concepts

The breakdown of Resolver Wrappers and Resolver Map Middlewares map cleanly on
to Resolver and Resolver Maps, respectively. These `graphql-test-resolver`
concepts represent the abstraction tools provided by this library.

| GraphQL Concept | `graphql-mocks` Concept |
|-----------------|----------------------------------|
| Resolver        | Resolver Wrapper                 |
| Resolver Map    | Resolver Map Middleware          |

### Resolver Map Middleware

Resolver Map Middlewares apply transformations to a Resolver Map. A Middleware function
is responsible for taking in a Resolver Map and returning a, potentially
modified, Resolver Map. You can save these Middlewares to re-use, and mix and
match then, for
different scenarios. Multiple Resolver Maps are applied together, in order,
to an initial Resolver Map when creating a GraphQL Handler or when manually
using `pack`.

### Resolver Wrapper

Resolver Map Middlewares are enough to get started but eventually you will come
across Resolver Wrappers. Resolver Wrappers provide a functional way of wrapping a Resolver
function and are used extensively behind-the-sceens in many of the provided Resolver Map Middlewares.

Wrappers are given a Resolver and are responsible for returning a Resolver.

Normally the Resolver returned ends up calling and returning the result of the original
Resolver. If this isn't the case it should be documented otherwise it can lead
to confusing results. Multiple Resolver Wrappers can be applied to a Resolver using
different Resolver Map Middlewares.

### A Note on Composability

Both Resolver Map Middlewares and Resolver Wrappers are based around functions
and being composable so that they can be applied flexibly. This flexability allows
for setting up specific test scenarios and mocking GraphQL APIs in a way that is
useful and clearer than managing Resolver Maps by hand.

### Auto Resolvers

Auto Resolvers use a set of conventions to be able to automatically resolve data
for a given Resolver. These are useful at getting up and going quickly while
still having escape hatches available to override and customize the Resolver Map.

## GraphQL Handler

This library aims at making it easy to get setup and that includes making a
GraphQL Handler. A GraphQL Handler will take a query and variables, and apply it
against a GraphQL Schema and its Resolver Map. If you don't already have a
GraphQL Handler `graphql-mocks` provides the ability to create one
using all the concepts and conventions we've already talked about.

Already have a GraphQL Handler setup, maybe from `graphql-tools`? You can still
use `pack` to create a Resolver Map that includes the Middlewares and Wrappers and
everything necessary to pass to your existing setup.
