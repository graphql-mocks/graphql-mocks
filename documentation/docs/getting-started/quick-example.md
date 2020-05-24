---
id: quick-example
title: Quick Example
---

import { GraphQLResult } from '../../src/components/graphql-result';

import QuickExample from 'code-examples/getting-started/quick-example.source.md';
import quickExampleQueryResult from '../../code-examples/getting-started/quick-example.query.result';
import quickExampleSinonResult from '../../code-examples/getting-started/quick-example.sinon.result';

This example will show to:

1. Create a Resolver Map
2. Apply a Resolver Wrapper (Sinon Spy Wrapper) via `embed`
3. Setup a GraphQL Handler with the the Resolver Wrapper
4. Execute a Query using the GraphQL Handler
5. Check the state shared with the Resolver Wrapper (Check Sinon for calls to
   the resolver)

<QuickExample/>

First `console.log`
<GraphQLResult result={quickExampleQueryResult} />

Second `console.log`
<GraphQLResult result={quickExampleSinonResult} />

The spies that are made accessible via the handler `state` property are useful
after a set of queries to assert various expectations from the different
resolvers and allow to introspect what has occurred.

Creating your own Resolver Wrappers and Resolver Map Middlewares is also a good
way to share and mock specific API states. There are other Resolver Map
Middlewares and Resolver Wrappers that are offer helpful functionality in
creating a robust Mock GraphQL API.
