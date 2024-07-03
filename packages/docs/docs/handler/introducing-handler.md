---
id: introducing-handler
title: Introducing the GraphQL Handler
---

import CreateHandlerExample from 'code-examples/getting-started/create-handler.source.md';
import createHandlerExampleResult from '../../code-examples/getting-started/create-handler.result';
import { GraphQLResult } from '../../src/components/graphql-result';

Ultimately, in order to be able to execute GraphQL queries you need a GraphQL handler. This handler accepts a query and variables and returns a payload of data and/or errors.

The GraphQL Handler is also the glue between many pieces of the mocking framework, like Resolver Maps, Resolver Map Middlewares, Resolver Wrappers and Network Handlers, which are covered in the following sections.

## Installation

```bash
# npm
npm install --save-dev graphql-mocks

# yarn
yarn add --dev graphql-mocks

# pnpm
pnpm add --save-dev graphql-mocks
```

Double-check that you've installed the `graphql-mocks` package also.

## Getting started

The `GraphQLHandler` is available from the core `graphql-mocks` package.

```js
import { GraphQLHandler } from 'graphql-mocks';
import schema from './schema';

const handler = new GraphQLHandler({
  dependencies: {
    graphqlSchema: schema
  }
});
```

### Using the CLI

To speed the process of creating a GraphQL Handler the `gqlmocks` cli can be used:

```
npx gqlmocks handler generate
```

See the [CLI docs](/docs/cli/commands#gqlmocks-handler-generate) for more information.
### GraphQL Schema

A GraphQL Schema is a required dependency for setting up the handler.

The schema can be:
- an instance of `GraphQLSchema` provided by the `graphql` package
- a GraphQL Schema AST (sometimes what is provided by babel loaders or bundlers)
- a string that is formatted in GraphQL SDL (Schema Definition Language)

```js
const handler = new GraphQLHandler({
  dependencies: {
    graphqlSchema: schema,

    // include other dependencies by key,
    // like a `Paper` instance of graphql-paper store, for example.
    paper: Paper
  }
});
```
#### Using the CLI

The `gqlmocks` cli can be used to fetch, validate and print info about a GraphQL Schemas. The `fetch` command is particularly useful to download a GraphQL Schema locally from either a remote GraphQL API or a url to an `.gql`/`.graphql` file formatted in the SDL (Schema Definition Language) where the file can be downloaded from.

For example:
```
npx gqlmocks fetch --source "http://remote-gql-api.com"
```

To see the available `gqlmocks` schema commands check out the [CLI documentation](/docs/cli/commands#gqlmocks-schema-fetch).

### Dependencies

As stated above some form of a GraphQL Schema is a required dependency for the `GraphQLHandler`. Aside from this, other Resolver Map Middlewares, Resolver Wrappers, or Resolvers may require their own dependencies. These can be listed on the `dependencies` object passed into the `GraphQLHandler`.

These dependencies can also be accessed from the context within a Resolver (see [Managing Resolver Context](/docs/guides/managing-context#dependencies) for more information).

### Resolver Map

A base Resolver Map can be *optionally* included with the GraphQL Handler. It can then be used for subsequent Resolver Map Middlewares.

```js
const resolverMap = {};

const handler = new GraphQLHandler({
  resolverMap: resolverMap,

  dependencies: {
    graphqlSchema: schema
  }
});
```

See [Using Resolver Maps](/docs/resolver-map/using-resolver-maps) to learn more about Resolver Maps, and [Introducing Resolver Map Middlewares](/docs/resolver-map/introducing-middlewares) on how they can be extended with Middlewares.

## Querying

Calling the `query` method (with queries or mutations) on a `GraphQLHandler` will return a promise with a payload (`data` or `errors`). The first argument of `query` method takes a string representing the operation (a query or mutation). The second argument is an object representing the variables used for the query.

Learn more about queries and mutations from the [official GraphQL Documentation](https://graphql.org/learn/queries/)

**Note:** The variable names in the object must match the the names at the top of the operation without the `$`. In the following example the `$name` variable passed in at the top of the query has a matching `name` property in the `variables` object.

**Note:** Additional context can be passed on a per-query basis, see [Managing Resolver Context](/docs/guides/managing-context) for details.

```js
const query = `
  query($name: String!) {
    hello(name: $name)
  }
`;

const variables = {
  name: 'Simone'
};

// handler as an instance of GraphQLHandler
const result = await handler.query(query, variables);
```

## Example

This example follows the most basic path of creating custom resolvers that many GraphQL tutorials follow. While this shows the handler in use keep in mind that the `GraphQLHandler` is also used with Middlewares and Wrappers to flexibly cover many different use-cases and scenarios.

<CreateHandlerExample />
<GraphQLResult result={createHandlerExampleResult} />
