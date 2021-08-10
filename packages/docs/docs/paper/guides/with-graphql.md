---
id: with-graphql
title: Using GraphQL Paper with GraphQL
---
import { GraphQLResult } from '../../../src/components/graphql-result';

import QueryExample from 'code-examples/paper/with-graphql-query.source.md';
import queryExampleResult from '../../../code-examples/paper/with-graphql-query.result';
import ExampleSchema from 'code-examples/paper/with-graphql-schema.source.md';

GraphQL Paper is built on the core [`graphql` library](https://github.com/graphql/graphql-js) and works well with its default resolvers. GraphQL Paper should also work well with other javascript systems that use resolver functions, too. The best integrations will still be with `graphql-mocks` and its packages which are designed and tested together.


## Example

Here is an example of GraphQL Paper working with the core `graphql` package

### Schema
<ExampleSchema />

### Querying
To resolve queries in a GraphQL Resolver return data from the `paper.data` property on a `Paper` instance.

GraphQL Paper also provides connections between different types and their corresponding documents out of the box which allows for the resolution of resolvers to work recursively. To kick off this behavior return the appropriate Document or list of Documents from the top-level `Query` resolvers.

In this example returning the resolvers for a list of `[Film!]` from the `Query.films` or a single `Film` by ID from `Query.film` will also satisify any queries that request a film's `Actor`s by returning the `actors` connections on the `Film` document.

<QueryExample />

<GraphQLResult result={queryExampleResult} />
