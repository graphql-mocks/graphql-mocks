---
id: create-handler
title: Creating a GraphQL Handler
---

import CreateHandlerExample from 'code-examples/getting-started/create-handler.source.md';
import createHandlerExampleResult from '../../code-examples/getting-started/create-handler.result';
import { GraphQLResult } from '../../src/components/graphql-result';

Ultimately, in order to be able to execute GraphQL queries you need a GraphQL
handler. This handler represents your GraphQL API and will take the the query and
variables and return a promise containing containing data or errors.

If you are just getting started with setting up your GraphQL API this library
provides a GraphQL handler. If you already have a GraphQL handler [use the
`pack` guide](../guides/pack) to still be able to use this library's underlying
composibility.

## Getting started

A `GraphQLHandler` instance handles GraphQL operations (queries and mutations).
A GraphQL Schema is a required dependency for setting it up. The Schema can be
an instance of `GraphQLSchema` or a GraphQL Schema AST, which is usually what is
provided by most GraphQL build tools that operate on Schemas, or it can _also_
be a string that is formatted as a GraphQL SDL (Schema Definition Language),
like in the example below.

The `GraphQLHandler` instance returned has a `query` function on it that is
ready for processing any queries, returning the execution as a promise with the
result or any errors.

Here is a quick example:

<CreateHandlerExample />
<GraphQLResult result={createHandlerExampleResult} />

This example follows a similar path that many GraphQL tutorials follow,
especially those for testing and mocking an API.

## Next Steps

To do this manually for each field on each type is possible, however, this
library provides abstractions to make this process easier. Whether there are
common resolvers, static data, or auto resolvers backed by a stateful source
this library pvoides ways of setting up your mock GraphQL API easier.
