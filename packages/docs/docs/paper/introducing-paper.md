---
id: introducing-paper
title: Introducing GraphQL Paper
---

import QuickExample from 'code-examples/paper/introducing-paper.source.md';
import quickExampleResult from '../../code-examples/paper/introducing-paper.result';
import { GraphQLResult } from '../../src/components/graphql-result';

GraphQL Paper is a flexible in-memory store based on a provided GraphQL Schema. Its features include:

* Built and based on GraphQL
* Written in TypeScript
* Support and integration with `graphql-mocks`
* Support for relationships and connections between types
* Immutable
* Accessible via native js APIs
* Hooks ([docs](/docs/paper/hooks))
* Events ([docs](/docs/paper/events))
* Transaction Operations ([docs](/docs/paper/operations))
* Validations ([docs](/docs/paper/validations))

Coming Soon:
* Time-travel snapshots, restore to existing snapshots

In testing and development it is handy to have a store that reflects the current state of the world, handles connections between data, and updates via mutations. While GraphQL Paper integrates well with the rest of `graphql-mocks`, it can also be used on its own.

## API Reference

There is [API reference](/api/paper/) available for the `graphql-paper` package.

## Documents and the Store

A `Document` is a POJO (plain-old javascript object) that represents a concrete GraphQL type.

For example an `Actor` GraphQL type:

```graphql
type Actor {
  title: String!
}
```

Could have a corresponding `Document`:
```js
{
  title: 'Jurassic Park'
}
```

Documents are stored in an array on the `DocumentStore` keyed by the GraphQL type. Based on the previous example a basic store could like:

```js
{
  Actor: [{ title: 'Jurassic Park' }]
}
```

This is a simplistic but realistic example of how data is stored. Learn how to [query](/docs/paper/querying-data) and [mutate](/docs/paper/mutating-data) the store or see below for a quick example of both. Check out the [technical notes](/docs/paper/technical-notes) for the finer details.

## A Quick Example

Here's a small glimpse at what is possible with GraphQL Mocks:

<QuickExample />

First `console.log` for `title`
<GraphQLResult result={quickExampleResult.title}/>

Second `console.log` for `actors`
<GraphQLResult result={quickExampleResult.actors}/>

Third `console.log` for `richard`
<GraphQLResult result={quickExampleResult.richard}/>
