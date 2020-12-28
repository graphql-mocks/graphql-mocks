---
title: Introducing Resolver Map Middlewares
---

A Resolver Map is the base layer for organizing Resolvers against a GraphQL Schema for execution. The ability to lazily
define this surface area means being able to make modifications and manipulate the execution context. This is more
important in mocking scenarios where it is important to be able to flexibly compose different scenarios either with new
Resolver functions or Resolver Wrappers against a Resolver Map.

The idea of a Resolver Map Middleware is functionally simple:

```
function (resolverMap) => resolverMap
```

Given a Resolver Map, return a Resolver Map. Apply any modifications or transformations to represent a new Resolver Map.
The mechanics of graphql-mocks provides the tools to apply Resolver Map Middlewares together, representing the layering
of changes to a Resolver Map.

High-order functions can return Resolver Map Middlewares with additional options. This is especially useful to parameterize and customize how Resolver Map Middlewares work. This library provides makes use of this method with the `embed` and `layer` functions which return Resolver Map Middlewares. Both of these cover the base case for creating Middlewares using resolvers and wrappers and are covered in the next section [Adding Resolvers](/docs/resolver-map/managing-resolvers).

There are some design principles behind [Creating Custom Resolver Map Middlewares](/docs/resolver-map/creating-middlewares) that might be helpful. And it's worth taking a look at the Resolver Map Middlewares that have already been created, too.
