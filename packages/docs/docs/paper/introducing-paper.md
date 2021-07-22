---
id: introducing-paper
title: Introducing GraphQL Paper
---

import QuickExample from 'code-examples/paper/introducing-paper.source.md';
import quickExampleResult from '../../code-examples/paper/introducing-paper.result';
import { GraphQLResult } from '../../src/components/graphql-result';

GraphQL Paper is a flexible in-memory store based on a provided GraphQL Schema. Its features include:

* Written in TypeScript
* Built and based on GraphQL
* Support and integration with `graphql-mocks`
* Support for relationships and connections between types
* Immutable
* Accessible via native js APIs 
* Hooks
* Events
* Transaction Operations
* Validations

Coming Soon:
* Time-travel snapshots, restore to existing snapshots

While it integrates well with the rest of `graphql-mocks`, it can also be used on its own. In testing and development it is handy to have a store that reflects the current state of the world and handles connections between data.

## API Reference

There is [API reference](/api/paper/) available for the `graphql-paper` package.

## A Quick Example

Here's a small glimpse at what is possible with GraphQL Mocks:

<QuickExample />

First `console.log` for `title`
<GraphQLResult result={quickExampleResult.title}/>

Second `console.log` for `actors`
<GraphQLResult result={quickExampleResult.actors}/>

Third `console.log` for `richard`
<GraphQLResult result={quickExampleResult.richard}/>