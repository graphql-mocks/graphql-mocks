---
id: introduction
title: Introduction
---

GraphQL has proven itself to be a powerful tool in building APIs. A single
GraphQL endpoint supports an extremely flexible query language. This has created
a challenge in mocking and creating mock APIs. This library does not force a
single method of configuration or convention to setup GraphQL Mock APIs. Instead
it provides a set of composable tools that can be used together to create a
flexible GraphQL Mock API.

## 🦾 BYO or Go Automatic

This library supports bringing own Resolvers functions if you already have them
or using Auto Resolvers. Either way, you can use the library's tools, Resolver
Map Middlewares and Resolver Wrappers, to layer together a Mock API that works
for different use-cases.

## 🔋 Batteries Included

`graphql-mocks` can be used to add Sinon JS spies to resolvers, provide resolver
logging, persist state and changes across queries with Mirage JS Auto Resolvers,
and on a case-by-case basis change individual resolvers. These can be added and
composed together flexibly.

## 🛠 Tools Included, too

The Resolver Map Middlewares and Resolver Wrappers that are delivered
out-of-the-box are built on same library primitives that are are made available
to create and share your own mocking tools. Create abstractions around
common test scenarios and contexts to organize and mock any GraphQL api.

## ✌🏽💜 Share Feedback and Questions

I am still exploring the possibilities and would love to hear any ideas.
If you have any feedback or comments please open a pull request or an issue.
Feel free to also ping me on [twitter](https://www.twitter.com/chadian).
