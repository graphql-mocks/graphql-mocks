---
id: with-graphql
title: Using GraphQL Paper with GraphQL
---
import { GraphQLResult } from '../../../src/components/graphql-result';

import QueryExample from 'code-examples/paper/with-graphql-query.source.md';
import queryExampleResult from '../../../code-examples/paper/with-graphql-query.result';
import ExampleSchema from 'code-examples/paper/with-graphql-schema.source.md';

import MutationExample from 'code-examples/paper/with-graphql-mutation.source.md';
import mutationExampleResult from '../../../code-examples/paper/with-graphql-mutation.result';

GraphQL Paper is built on the core [`graphql` library](https://github.com/graphql/graphql-js) and works well with its default resolvers. GraphQL Paper should also work well with other javascript systems that use resolver functions, too. The best integrations will still be with `graphql-mocks` and its packages which are designed and tested together.

If using GraphQL Paper with `graphql-mocks` check out the [guide](/docs/guides/paper) dedicated to setup, common patterns and techniques.


## Example

Here is an example of GraphQL Paper working with the core `graphql` package

### Schema

The full *Querying* and *Mutating* examples below make use of the following schema:
<ExampleSchema />

### Querying
To resolve queries in a GraphQL Resolver return data from the `paper.data` property on a `Paper` instance. The [*GraphQL Paper Querying Data documentation*](/docs/paper/querying-data) provides more information on how to retrieve data with GraphQL Paper.

GraphQL Paper also provides connections between different types and their corresponding documents out of the box which allows for the resolution of resolvers to work recursively. To kick off this behavior *return* the appropriate Document or list of Documents from the top-level `Query` resolvers.

#### Complete Query Example

In this example returning the resolvers for a list of `[Film!]` from the `Query.films` or a single `Film` by ID from `Query.film` will also satisify any queries that request a film's `Actor`s by returning the `actors` connections on the `Film` document.

Using the `graphql` npm package with the above schema for an end-to-end example involving queries.

<QueryExample />

<GraphQLResult result={queryExampleResult} />

### Mutating

Mutations also work with GraphQL Paper and `graphql`. The [*GraphQL Paper Mutating Data documentation*](/docs/paper/mutating-data) provides more information on how mutating data with GraphQL Paper.

#### Returning from Mutations

If a document can satisfy a mutation's expected return type then return it from `paper.mutate`. In this example if the mutation field returns a GraphQL Type of `SomeType` then
```js
async function createSomeTypeMutationResolver(root, args, context, info) {
  // return the paper.mutate
  return paper.mutate(({ create }) => {
    // return the created SomeType Paper Document
    return create('SomeType', { /* use data from args... */ });
  });
}
```

If the result is not satisfied by the document the result can be awaited and modified as needed. Assuming in this example the mutation payload only required the payload with the ID
```
{ someTypeId: newId }
```

Then the mutation resolver could look like:

```js
async function createSomeTypeMutationResolver(root, args, context, info) {
  // return the paper.mutate
  const someTypeDocument = await paper.mutate(({ create }) => {
    // return the created SomeType Paper Document
    return create('SomeType', { /* use data from args... */ });
  });

  // take the resulting document and returning the required shape
  return {
    someTypeId: someTypeDocument.id
  };
}
```

#### Complete Mutation Example

Using the `graphql` npm package with the above schema for an end-to-end example using mutations.

<MutationExample />
<GraphQLResult result={mutationExampleResult} />
