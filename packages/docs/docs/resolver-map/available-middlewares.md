---
id: available-middlewares
title: Available Middlewares
---

There are many useful Resolver Map Middlewares available to quickly mock and augment GraphQL APIs. Learn how to [create your own custom middlewares](/docs/resolver-map/creating-middlewares). Have a useful Resolver Map Middleware to share with the community? Open a PR to add it here.

## `embed`
* Package: `graphql-mocks`
* [Documentation](/docs/resolver-map/managing-resolvers#using-embed)

Manage and manipulate Resolver Maps by using `embed` to add Resolvers and/or Resolver Wrappers.

## `layer`
* Package: `graphql-mocks`
* [Documentation](/docs/resolver-map/managing-resolvers#using-layer)

Lazily add layering of Resolvers via Resolver Map partials with `layer`, optionally applying Resolver Wrappers. See the [guide](/docs/resolver-map/managing-resolvers#using-layer) for examples.

## faker.js
* Package: `@graphql-mocks/faker`
* [Documentation](/docs/guides/faker)

Using [faker.js](https://github.com/marak/Faker.js/) with the Resolver Map Middleware from `@graphql-mocks/faker` provides an extremely quick way to automatically mock any GraphQL schema.

* Automatically mock an entire schema
* Fallbacks to faker data based on field-name heuristics
* Configurable faker functions per GraphQL field
* Provide dynamic ranges for list types

## Mirage JS
* Package: `@graphql-mocks/mirage`
* [Documentation](/docs/guides/mirage-js)

*Note:* If starting new it's much easier to use GraphQL Paper which works natively with GraphQL, including connections and relationships. GraphQL Paper solves the same use cases as Mirage but in a GraphQL-first way using the GraphQL Schema with more extensibility and features like events, custom validations and hooks. If starting to migrate from an existing a Mirage setup then using the Mirage JS middleware is likely a good start.

[Mirage JS](https://miragejs.com/) is a tool for aimed at mocking out REST APIs and includes an in-memory store. `@graphql-mocks/mirage` provides a middleware that leverages uses Mirage to provide stateful GraphQL queries. See the [documentation](/docs/guides/mirage-js) for details and plenty of examples.
