---
id: create-handler
title: Creating a GraphQL Handler
---

import CreateHandlerExample from 'code-examples/getting-started/create-handler.source.md';
import createHandlerExampleResult from '../../code-examples/getting-started/create-handler.result';
import { GraphQLResult } from '../../src/components/graphql-result';

Ultimately, in order to be able to execute GraphQL queries you need a GraphQL
handler. This handler will take the the query and variables and return a GraphQL
response containing data or errors.

If you are just getting started with setting up your GraphQL API this library provides a GraphQL
handler. If you already have a GraphQL handler [use the `pack` guide](../guides/pack) to use the
same underlying composibility.

## Getting started

A `GraphQLHandler` instance handles GraphQL operations (queries and mutations).
A GraphQL Schema is a required dependency in setting it up. The Schema can be an
instance of `GraphQLSchema` which is usually what is provided by most GraphQL
build tools that operate on Schemas. The Schema can _also_ be a string that is
formatted as a GraphQL SDL (Schema Definition Language), like in the example below.

The GraphQL handler returned has a `query` function on it that is ready for processing
any queries, returning the execution as a promise with the result or any errors.

Here is an example:

<CreateHandlerExample />
<GraphQLResult result={createHandlerExampleResult} />

## Next Steps

To do this for each field, on each type, is possible depending on the complexity
of your GraphQL API. However, this library provides a few different options to
getting setup more quickly. For one there are Auto Resolvers, like the Mirage JS
Auto Resolver.
