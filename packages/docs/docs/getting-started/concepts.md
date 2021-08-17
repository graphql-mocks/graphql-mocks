---
id: concepts
title: Concepts
---

These are some concepts and terms you might see when looking to mock your GraphQL API.

## GraphQL Concepts

Since this library aims at mimicking a GraphQL API server it is focuses on the _execution_ and resolution of queries. We
use Resolvers and Resolver Maps to handle this execution. The [graphql docs](https://graphql.org/learn/execution) have
some useful information around these concepts. With a Resolver Map, and any optional Middlewares, a GraphQL Handler be
created to resolve queries.

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
  # resolve to a string
  helloWorld: String!
}
```

A resolver function for the `helloWorld` field could be:

```js
const resolverFunction = function (obj, args, context, info) {
  return 'Hello world, from a GraphQL Resolver!';
};
```

This resolver function on its own isn't very useful, we need to attach it to a field on a Resolver Map. To learn more
about resolvers themselves check out this part of the
[graphql documentation](https://graphql.org/learn/execution/#root-fields-resolvers).

Note: Usually, Resolvers refer to Field Resolvers (which resolve data for a field), however, there are also Type
Resolvers which instead resolve to a concrete _Type_ for Abstract Types like
[Interfaces](https://graphql.org/learn/schema/#interfaces) and [Unions](https://graphql.org/learn/schema/#union-types).
This is covered more in the Resolver section of these guides.

### Resolver Map

Resolver Maps are a collection of resolvers keyed by type and field. Here's the same schema and resolver function from
above being used within a Resolver Map.

```graphql
# Query is the type
type Query {
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
    helloWorld: resolverFunction,
  },
};
```

With a Resolver Map the types, fields, and resolvers are enough to completely resolve queries. This library provides
tools to setup, extend, and organize both Resolver Maps and Resolvers.

## Library Concepts

This library provides functionality to extend resolvers and make modifications to Resolver Maps.

| GraphQL Concept | `graphql-mocks` Concept |
| --------------- | ----------------------- |
| Resolver        | Resolver Wrapper        |
| Resolver Map    | Resolver Map Middleware |

### Resolver Wrapper

Resolver Wrappers provide a functional way of extending and wrapping a Resolver function. Wrappers are given a Resolver
and are responsible for returning a Resolver. They provide a good way of introspecting and controlling the result of a
Resolver and can be applied to Resolvers flexibly using utilities like `embed` and `layer`.

Learn more about different types of [Resolvers](/docs/resolver/using-resolvers) and about [Resolver Wrappers](/docs/resolver/introducing-wrappers).

### Resolver Map Middleware

Resolver Map Middlewares apply transformations to a Resolver Map. A Middleware function is responsible for taking in a
Resolver Map and returning a, potentially modified, Resolver Map. You can save these Middlewares to re-use, mix and
match, and combine them for different scenarios. This is handy because for the number of mock scenarios that must be handled it's important to have declarative control over the Resolver landscape.

Learn more about [Resolver Maps](/docs/resolver-map/using-resolver-maps) and [Resolver Map Middlewares](/docs/resolver-map/introducing-middlewares).

## Highlight

The ability to select the parts of the schema to operate on, and mock, is made easier by using the declarative Highlight
system. You will most likely encounter Highlight when interacting with Resolver Map Middlewares to apply modifications
to specific parts of the GraphQL Schema. This allows middlewares to work in tandem without over each other.

_Using the `field` highlighter highlight all fields, on all types, excluding the `Mutation.addUser`_

```js
highlight(graphqlSchema)
  .include(field([HIGHLIGHT_ALL, HIGHLIGHT_ALL]))
  .exclude(field(['Mutation', 'addUser']));
```

Learn the [basics of Highlight](/docs/highlight/introducing-highlight), the ones that are
[provided out-of-the-box](/docs/highlight/available-highlighters), and how to
[create your own](/docs/highlight/creating-highlighters).

## GraphQL Handler

This library aims at making it easy to get setup and firing off queries by including
[a GraphQL Handler](/docs/getting-started/create-handler). A GraphQL Handler will take a query and variables, and apply
it against a GraphQL Schema and its Resolver Map.

Already have a GraphQL Handler setup, maybe from using `graphql-tools`? You can still use `pack` to create a Resolver
Map that includes the Middlewares and Wrappers and everything necessary to pass to your existing setup.

## GraphQL Paper

[GraphQL Paper](/docs/paper/introducing-paper) is a library provided by `graphql-mocks` but can be used standalone. It it an in-memory store for stateful handling of data based on a GraphQL Schema. It's been designed and tested to integrate with `graphql-mocks` to provide a complete GraphQL mocking story.

## A Note on Composability

Both Resolver Map Middlewares and Resolver Wrappers are based around functional composition so that they can be applied
flexibly. This flexibility is often powered by the _Highlight_ system to selectively apply the operation to specific
parts of the schema. Flexibility is considered important here because it empowers the creation of specific mock and test
GraphQL APIs scenarios. This is done in a way that is easier and clearer than managing Resolvers and Resolver Maps by
hand or leaving everything up to a rigidly automatic solution (which can also be codified with this libraries
primitives). GraphQL Paper provides a stateful in-memory store for representing data backed by a GraphQL Schema that can be easily modified from mutations. The GraphQL Paper store can also be customized and extended with events, hooks, and custom validations.
