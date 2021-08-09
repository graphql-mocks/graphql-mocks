---
id: introduction
title: Introduction
---

GraphQL has proven itself to be a powerful tool in building APIs. A single GraphQL endpoint supports an extremely
flexible query language. This has created a challenge in mocking and creating mock APIs. Unlike other libraries,
`graphql-mocks` does not use a single method of configuration or convention to setup mock GraphQL APIs. Instead it
provides a set of composable tools and utilities that can be used together to flexibly create a mock GraphQL API.

## 🔋 Batteries Included

Testing, mocking or prototyping, use `graphql-mocks` with its GraphQL utilities, _Resolver Map Middlewares_ and
_Resolver Wrappers_ to get started. Use the GraphQL Paper for out-of-the-box stateful queries using
an in-memory store. The `spyWrapper` can be used to wrap Sinon spies around resolvers easily in tests. The
`logWrapper` quickly gives insights into logging Resolver activity. The application of these, and more, can be
conditionally applied to your GraphQL schema using a query-like technique called _Highlight_. The layering of all of
these creates a reusable, declarative system for creating mock GraphQL APIs.

## 🛠 Tools Included, too

Managing the GraphQL API surface area of a Resolvers under different mock scenarios can be tricky. That's why this
library provides common GraphQL utilities, typescript types, and the APIs to easily create Resolver Map Middlewares and
Resolver Wrappers to help organize and speed up development. Together, these allow for the creation of reusable
abstractions around common scenarios and contexts to organize and mock any GraphQL API. The out-of-the-box Resolver
Wrappers and Resolver Map Middlewares are built on the same underlying APIs. General-purpose abstractions can be shared
with the community to help others bootstrap and prototype APIs more quickly.

## ✌🏽💜 Share Feedback and Questions

There's still lots of possibilities that are under development and being explored. I would love to hear any ideas,
comments or feedback.
* [Chat on discord](https://discord.gg/eJxddt2CJS)
* [Create a pull request](https://github.com/graphql-mocks/graphql-mocks/pulls)
* [Open an issue](https://github.com/graphql-mocks/graphql-mocks/issues/new)
* [Ping me on twitter](https://www.twitter.com/chadian)
