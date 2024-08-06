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

## Falso
* Package: `@graphql-mocks/falso`
* [Documentation](/docs/guides/fake-data)

Using [Falso](https://github.com/ngneat/falso) with the Resolver Map Middleware from `@graphql-mocks/falso` provides an extremely quick way to automatically mock any GraphQL schema.

* Automatically mock an entire schema
* Fallbacks to Falso data based on field-name heuristics
* Configurable Falso functions per GraphQL field
* Provide dynamic ranges for list types
