---
id: mirage-js
title: Mirage JS
---

import { GraphQLResult } from '../../src/components/graphql-result';

import RouteHandlerExample from 'code-examples/mirage-auto-resolvers/route-handler.source.md';

import BasicExample from 'code-examples/mirage-auto-resolvers/basic.source.md';
import basicExampleResult from '../../code-examples/mirage-auto-resolvers/basic.result';

import MutationCreateExample from 'code-examples/mirage-auto-resolvers/mutation-create.source.md';
import mutationCreateResult from '../../code-examples/mirage-auto-resolvers/mutation-create.result';

import MutationUpdateExample from 'code-examples/mirage-auto-resolvers/mutation-update.source.md';
import mutationUpdateResult from '../../code-examples/mirage-auto-resolvers/mutation-update.result';

import MutationDeleteExample from 'code-examples/mirage-auto-resolvers/mutation-delete.source.md';
import mutationDeleteResult from '../../code-examples/mirage-auto-resolvers/mutation-delete.result';

import StaticResolverExample from 'code-examples/mirage-auto-resolvers/static-resolver.source.md';
import staticResolverResult from '../../code-examples/mirage-auto-resolvers/static-resolver.result';

[Mirage JS](https://miragejs.com/) is a great tool that makes mocking
RESTful APIs much easier. One of the main benefits of Mirage JS is that it
provides a full in-memory database and ORM. This allows for mocking to be
stateful with change reflected in subsequent.

This library provides a few ways that we can extend a Mirage JS setup with Auto
Resolvers or by using Mirage JS within resolver functions, or both. The
flexibility of `graphql-mocks` lets Mirage JS auto resolve parts of the
Schema while allowing other Middlewares or resolver functions to fulfill the rest.

## Mirage JS & Auto Resolving

Mirage has models which loosely map to GraphQL Object Types. The fields on a
GraphQL Object Type have fields that are similar to model attributes.

```graphql
type Person {
  name: String
  family: [Person!]!
}
```

```js
import { Model, hasMany } from 'miragejs';

Model.create({
  family: hasMany('person'),
});
```

Associations between models reflect the relationships between GraphQL types.
Relationships will be automatically resolved based on the matching naming
between Mirage JS models and GraphQL types, or through a mapping defined by a
`MirageGraphQLMapper` instance. This provides the basis for the auto resolving a
GraphQL query. Auto Resolvers are applied to a Resolver map via the
[`patchAutoFieldResolvers`](#patchautoresolvers-auto-resolvers-middleware) Middleware.

## Mocking the Network with Mirage JS Route Handlers

A GraphQL handler handles the mocked responses for GraphQL queries and
mutations. However, in applications using GraphQL clients these GraphQL operations
happen on a remote GraphQL API server and this transport layer also has to be
mocked. Mirage JS comes out-of-the-box with XHR interception with route handlers.
GraphQL API Servers operate on a single endpoint for a query so only one
route handler is needed.

The library does not require using Mirage's route handling but if the
application is browser-based it can be a quick way to get setup. Migrating to
other mocked networking in the future is easy as well.

Use `createRouteHandler` to get setup with a GraphQL endpoint quickly. Either
an instance of `GraphQLHandler` can be used, or the same options that would be
passed to its constructor. The server can be referenced by `this` within
`routes()` and can be passed in for the `mirageServer` dependency.

<RouteHandlerExample />

This example sets up a GraphQLHandler on the `graphql` route.

Note: The rest of the examples skip this part and focus on `graphql-mocks`/Mirage JS configuration and examples.

## `patchAutoResolvers` Auto Resolvers Middleware

The `patchAutoResolvers` will fill the Resolver Map with Auto Resolvers where resolvers do not
already exist. It will also check and apply the necessary resolvers for the
GraphQL Interface and Union types. `mirageServer` is a required dependency.

```js
import { GraphQLHandler } from 'graphql-mocks';
import { patchAutoResolvers } from 'graphql-mocks/mirage';

const handler = new GraphQLHandler({
  middlewares: [patchAutoResolvers()],
  dependencies: {
    mirageServer,
    graphqlSchema,
  },
});
```

## Selectively Applying Mirage Auto Resolvers

In some cases it is handy to specify the types and fields that should use
Mirage JS Auto Resolvers. This is handy when using a different Auto Resolvers to resolve
different parts of the GraphQL Schema. To specify the application of Mirage Auto Resolvers to specific fields, the
`patchAutoTypeResolvers` middleware can be used:

```js
const mirageMiddleware = patchAutoFieldResolvers({
  // list of targets to include in applying Mirage Auto Resolvers
  include: [],

  // list of targets to exclude from applying Mirage Auto Resolvers
  exclude: [],

  // whether or not to replace existing resolvers in the resolver map
  replace: true,
});

const handler = new GraphQLHandler({
  middlewares: [mirageMiddleware],
  dependencies: {
    mirageServer,
    graphqlSchema,
  },
});
```

`mirageServer` is a required dependency.

### Basic Query
This example shows the result of querying with Auto Resolvers against Mirage
Models with relationships (between a Wizard and their spells). It uses
`patchAutoResolvers` Middleware, sets up dependencies and runs a query. The
mutations will persist as part of Mirage JS's server for future mutations and queries.

<BasicExample/>
<GraphQLResult result={basicExampleResult} />

### Mutations (Create, Update, Delete)

GraphQL Mutations can be done with static resolvers. Any changes to Mirage JS
can be done by accessing the `mirageServer` dependency with the
`extractDependencies` helper.

#### Create Example with Input Variables

This example creates a new instance of a Wizard model on the Mirage JS using a
GraphQL Input Type.

<MutationCreateExample/>
<GraphQLResult result={mutationCreateResult} />

#### Update Example

In this example Voldemort, Tom Riddle, has mistakenly been put into the wrong
Hogwarts house. Using the `updateHouse` mutation will take his Model ID, the
correct House, and return the updated data. The `resolverMap` has a
`updateHouse` Resolver Function that will handle this mutation and update the
within Mirage JS.

<MutationUpdateExample/>
<GraphQLResult result={mutationUpdateResult} />

#### Delete Example

Removing Voldemort's entry in the Mirage JS database can be done through a
`removeWizard` mutation. The `resolverMap` has a `removeWizard` Resolver
Function that will handle this mutation and update the within Mirage JS.

<MutationDeleteExample/>
<GraphQLResult result={mutationDeleteResult} />

### Static Resolver Functions

Mirage JS can be used directly in static Resolver Functions in a Resolver Map by
using the `extractDependencies` utility. This technique can be with
[Mutations](#mutations-create-update-delete), and Query Resolver Functions to
bypass Auto Resolving whiile still having access to Mirage.

<StaticResolverExample />
<GraphQLResult result={staticResolverResult} />

## Comparison with `miragejs/graphql`

Mirage JS has a GraphQL solution, `miragejs/graphql`, that leverages
mirage & graphql automatic mocking and takes care of some of the mirage setup
automatically. The `graphql-mocks` library does a few things differently than
`miragejs/graphql`.

- This library does not setup the Mirage JS Schema with Models based on GraphQL
  Types, it treats the Mirage JS Schema as a dependency, and consumes it. It is
  able to detect mismatches when a model isn't found and reports an error.
  `miragejs/graphql` depends on a Type and Model matching where this library can
  use the same heuristics but can also flexibly map between [different naming
  between GraphQL and Mirage](#mapping-types-and-fields).
- `miragejs/graphql` attempts automatic filtering where this library does not.
  Instead, it provides `MirageGraphQLMapper` with [field
  filtering](#field-filtering) to make filtering with the current result set easier.
