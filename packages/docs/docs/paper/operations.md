---
id: operations
title: Operations
---

Operations are functions available within an *Mutate Transaction* callback with access to internal context including the current **mutable** version of the `DocumentStore` being operated on.

## Base Operations

The ones that are provided by GraphQL Paper out-of-the-box are `create`, `find`, `remove`, `clone`, `getStore`, `queueEvent`. These are covered in [*Mutating Data*](/docs/paper/mutating-data#transaction-operations).

## Operational Context

What makes Operations different than regular functions is that the first argument is bound (via `.bind`) at the beginning of every transaction, for each operation, with [`Operation Context`](pathname:///api/paper/modules/types.html#OperationContext).

The shape of the Operation Context is:
```
{
  store: DocumentStore
  schema: GraphQLSchema
  eventQueue: Event[]
}
```

* `store` is the current **mutable** version of the store available during the transaction
* `schema` is an instance of `GraphQLSchema` based on the schema passed into `Paper`
* `eventQueue` is an array of events that will be emitted at the end of the transaction

## Creating Custom Operations

Additional *Operations* can be added to be used within the *Mutate Transaction* callback.
The first argument is reserved and *must* be the `context` object even if it's not used for the custom operation. What is provided by the `OperationContext` argument is [described above](#operational-context).

```js
export const customOperation = (context, argOne, argTwo) => {
  /* custom logic for your custom operation */
};
```

If using typescript, import the `OperationContext` for the first argument of the function. Setting up your Operation this way should allow the types and autocomplete to work within the the *Mutate Transaction* callback.

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

The key provided in the `OperationMap` hash is what is made available by destructuring within the *Mutate Transaction* callback.

```js
paper.mutate(({ custom }) => {
  const result = custom('argOne magic!', 42);
});
```
