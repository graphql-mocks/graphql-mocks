---
id: operations
title: Operations
---

Operations are functions available within an *Mutate Transaction* callback and are bound with special internal context.

## Base Operations

The ones that are provided out-of-the-box are `create`, `find`, `remove`, `clone`, `getStore`, `queueEvent`. These are covered in [*Mutating Data*]('/docs/paper/mutating-data#transaction-operations').

## Operational Context

What makes Operations different than regular functions is that the first argument is bound (via `.bind`) at the beginning of every transaction with [`Operation Context`](pathname:///api/paper/modules/types.html#OperationContext).

The shape of the Operation Context is:
```
{
  store: DocumentStore
  schema: GraphQLSchema
  eventQueue: Event[]
}
```

* `store` is the current version of the store available for mutation during the transaction
* `schema` is an instance of `GraphQLSchema` based on the schema passed into `Paper`
* `eventQueue` is an array of events that will be pushed out at the end of a transaction

## Creating Custom Operations

Additional *Operations* can be added to be used within the *Mutate Transaction* callback.
The first argument is reserved and *must* the `context` object even if it's not used for your operation.
What is provided in an OperationContext is [described above](#operational-context).

```js
export const customOperation = (context, argOne, argTwo) => {
  /* custom logic for your custom operation */
};
```

If using typescript, import the `OperationContext in` for the first argument of the function. Setting up your Operation this way should allow the types and autocomplete to work within the the *Mutate Transaction* callback.

```typescript
// customOperation.ts
import { OperationContext }  from 'graphql-paper/types';

export const customOperation = (context: OperationContext, argOne: string, argTwo: number) => {
  /* custom logic for your custom operation */
  return /* return anything useful as a result of the operation */;
};
```

Operations can be added to the `Paper` constructor's second argument configuration object, on the `operations` key.

```js
import { customOperation } from './customOperation';
import { graphqlSchema } from './schema';

const operations = { custom: customOperation };
const paper = new Paper(graphqlSchema, { operations });
```

```typescript
import { customOperation } from './customOperation';
import { graphqlSchema } from './schema';

const operations = { custom: customOperation };
const paper = new Paper(graphqlSchema, { operations });
```

The key provided in the `OperationMap` hash is what is made available within the *Mutate Transaction* callback.

```js
paper.mutate(({ custom }) => {
  const result = custom('argOne magic!', 42);
});
```
