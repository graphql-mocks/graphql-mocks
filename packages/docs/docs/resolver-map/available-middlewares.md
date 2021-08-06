---
id: available-middlewares
title: Available Middlewares
---

There are already exists useful Resolver Map Middlewares, or functions that create them, to help get started for the GraphQL various mocking scenarios.

Have a useful Resolver Map Middleware to share with the community? Feel free to open a PR to add it here. Learn how to [create your own custom ones](/docs/resolver-map/creating-middlewares), too.

## `embed`
* Package: `graphql-mocks`
* [Documentation](/docs/resolver-map/managing-resolvers#using-embed)

Manage the Resolver Map by using `embed` to create Resolver Map Middlewares that can lazily add Resolvers and/or Resolver Wrappers.

## `layer`
* Package: `graphql-mocks`
* [Documentation](/docs/resolver-map/managing-resolvers#using-layer)

Lazily add layering of Resolver Map Partials with `layer` and the Resolver Map Middleware it creates. It also supports using Resolver Wrappers in its application of partials.

## Mirage JS
* Package: `@graphql-mocks/mirage`
* [Documenation](/docs/guides/mirage-js)

*Note:* If starting new it's easier to use GraphQL Paper which works natively with GraphQL, including connections/relationships. GraphQL Paper solves the same use cases as Mirage but in a GraphQL-first way using the GraphQL Schema with more extensibility and features like events, custom validations, hooks. If migrating from an existing a Mirage setup then using the Mirage JS middleware is likely a good fit.

[Mirage JS](https://miragejs.com/) is a tool for mocking out REST APIs and includes a stateful ORM and DB layer. The `@graphql-mocks/mirage` provides a middleware that leverages the ORM and DB from Mirage JS to provide stateful GraphQL queries so that data can be persisted, mutated and reflect real-world scenarios. See the [documentation](/docs/guides/mirage-js) for all details and plenty of examples.
