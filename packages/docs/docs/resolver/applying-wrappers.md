---
id: applying-wrappers
title: Applying Wrappers
---

The most common way of using Resolver Wrappers is with the `embed` Resolver Map Middleware function which can return a
Middleware that applies an array of Resolver Wrappers, in order.

In this example `embed` produces a Middleware that applies the `logWrapper`. Using the `higlight` option on `embed`,
Resolvers are selectively applied based on which parts of the schema are "highlighted". Here, all Field Resolvers
(denoted bby `"*"`) on the `"Query"` type are applied with the `logWrapper`.

```js
import { logWrapper } from "graphql-mocks/wrapper";

const loggerMiddleware = embed({
  wrappers: [logWrapper]

  // Optionally, a highlight argument can be passed in
  // to control which Resolvers the Wrappers are applied to
  highlight: (h) => h.include(field(['Query', '*'])),
});
```

For more details on `embed`, and `layer` (which also has a `wrappers` option), check out [*Managing Resolvers with Middlewares*](/docs/resolver-map/managing-resolvers).
