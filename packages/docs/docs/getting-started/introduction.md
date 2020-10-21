---
id: introduction
title: Introduction
---

GraphQL has proven itself to be a powerful tool in building APIs. A single
GraphQL endpoint supports an extremely flexible query language. This has created
a challenge in mocking and creating mock APIs. Unlike other libraries,
`graphql-mocks` does not use a single method of configuration or convention to
setup GraphQL Mock APIs. Instead it provides a set of composable tools and
utilities that can be used together to flexibly create a GraphQL Mock API.

## 🔋 Batteries Included

Testing, mocking or prototyping, `graphql-mocks` provides Resolver Map
Middlewares and Resolver Wrappers to get you started. Use the Mirage JS Auto
Resolvers Middlware for out-of-the-box stateful queries using an in-memory
database. The `spyWrapper` can be used to wrap Sinon spies around resolvers
easily in tests. The `logWrapper` quickly gives insights into logging Resolver
activity. The application of these, and more, can be conditionally applied to
your GraphQL schema using a query-like technique called *Highlight*. The
layering of these methods creates a declarative system for creating mock GraphQL
APIs.

## 🛠 Tools Included, too

The Resolver Map Middlewares and Resolver Wrappers that are delivered
out-of-the-box are built on same library abstractions that are are made
available to create own tools. This allows the creation of primatives around
common scenarios and contexts to organize and mock any GraphQL API.
General-purpose abstractions can be shared with the community or
API/project-specific abstrations can be used to speed up mocking, testing, and
prototyping.

## ✌🏽💜 Share Feedback and Questions

There's still lots of possibilities to explore and would love to hear any ideas.
If you have any feedback or comments please open a pull request or an issue.
Feel free to also ping me on [twitter](https://www.twitter.com/chadian).
