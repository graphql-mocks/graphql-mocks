---
id: operations
title: Operations
---

Operations are functions available within an *Mutate Transaction* callback and are bound with special internal context.
The ones that are provided out-of-the-box are `create`, `find`, `remove`, `clone`, `getStore`, `queueEvent`. These are covered
in [*Mutating Data*]('/docs/paper/mutating-data#transaction-operations').

## Operational Context

What makes Operations different than regular functions is that the first argument is bound (via `.bind`) with [*Operation Context*](pathname:///api/paper/modules/types.html#OperationContext) at the beginning of the transaction.

Currently, the `OperationContext` includes:

```
{
  eventQueue: Event[]
  schema: GraphQLSchema
  store: DocumentStore
}
```

* `eventQueue` is an array of events that will be pushed out at the end of a transaction
* `schema` is an instance of `GraphQLSchema` based on the schema passed into `Paper`
* `store` is the current version of the store available for mutation during the transaction

## Creating Custom Operations

Additional *Operations* can be added to be used within the *Mutate Transaction* callback.
The first argument is reserved and *must* the `context` object even if it's not used for your operation.
What is provided in an OperationContext is [described above](#operational-context).

```js
export const customOperation = (context, argOne, argTwo) => {
  /* custom logic for your custom operation */
};
```

If creating an Opereration in typescript the type can be imported and assigned to the function.

```typescript
import { Operation }  from 'graphql-paper/types';

export const customOperation: Operation = (context, argOne, argTwo) => {
  /* custom logic for your custom operation */
};
```

Operations can be added to the `Paper` constructor

```js
import { customOperation } from './customOperation';
import { graphqlSchema } from './schema';

const operations = { custom: customOperation };
const paper = new Paper(graphqlSchema, { operations });
```

If using typescript provide the type argument to get typing within *Mutate Transaction* callbacks.

```typescript
import { customOperation } from './customOperation';
import { graphqlSchema } from './schema';

const operations: OperationMap = { custom: customOperation };
const paper = new Paper<typeof operations>(graphqlSchema, { operations });
```

The key provided in the `OperationMap` hash is what is made available within the *Mutate Transaction* callback.

```js
paper.mutate(({ custom }) => {
  custom('argOne', 'argTwo');
});
```
