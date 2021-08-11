---
id: managing-ids
title: Managing IDs
---

IDs that exist as scalars on a GraphQL Schema are considered part of the data of a `Document`. GraphQL Paper doesn't use them for tracking uniqueness although it does have ways of helping ensure that data for ID fields are kept unique and can also help in generating values.

## Automatically Generating IDs

It can be helpful to have an automatically generated ID that reflects the ID format used by the GraphQL API being mocked.

### Using a Custom Hook
This can be done by using an `afterTransaction` hook function to ensure that any IDs that are added automatically. [Learn more about creating custom hooks](/docs/paper/hooks).

Assuming the GraphQL Paper documents have an id field:

```graphql
type SomeType {
  id: ID!
}
```

#### Using auto-incrementing IDs

For most testing and development cases this should run fast enough, after each transaction. In the case this is too slow a custom operation could be created (see below).

```js
paper.hooks.afterTransaction.push(function({ getStore }) {
  const store = getStore();
  Object.entries(store).forEach(([type, documents]) => {
    // find the current maximum id for the current type
    let maxId = documents.reduce((previous, document) => {
      return Math.max(previous, Number(document.id));
    }, 0);

    // loop over each document that's missing an ID and
    // add an incremented id
    documents.forEach((document) => {
      if (typeof document !== 'string') {
        document.id = String(++maxId);
      }
    });
  });
});
```

#### Using uuids

Using a custom `uuid` function is simpler to generate a missing ID for any document missing one after a transaction is complete.

```js
paper.hooks.afterTransaction.push(function({ getStore }) {
  const store = getStore();
  Object.entries(store).forEach(([type, documents]) => {
    documents.forEach((document) => {
      if (typeof document !== 'string') {
        // using a uuid function from an npm package
        document.id = uuid();
      }
    });
  });
});
```

### Using a Custom Operation

Another solution is to create a custom operation that wraps the provided `create` operation and keeps tracks of IDs. [Learn more about creating custom operations](/docs/paper/operations#creating-custom-operations).

```js
import { create } from 'graphql-paper/operations';

// track ids { [typename: string] : number }
const ids = {};

const customCreate = (context, typename, documentPartial) => {
  const document = create(context, typename, documentPartial);

  // increment or initialize
  ids[typename] = (ids[typename] ?? 0) + 1;

  // set incremented id
  document.id = String(ids[typename]);

  return document;
};

const paper = new Paper(graphqlSchema, { operations: { customCreate } });
```

## Validating Unique IDs

By default GraphQL Paper is checking for unique IDs on a per-type basis with the [`uniqueIdFieldValidator`](/docs/paper/validations#uniqueidfieldvalidator). If the ID constraint is more complicated than per type then it's recommended to create a custom field validator. [Learn more about creating custom field validators](/docs/paper/validations#creating-custom-field-validators).
