---
id: serialization
title: Serialization & Deserialization
---

GraphQL Paper supports serialization and deserialization to/from a JSON format.

## Serialization

To serialize a GraphQL Paper instance call the `serialize` method on the paper instance.

```js
import { Paper } from 'graphql-paper';

const paper = new Paper(graphqlSchema);
const paper.mutate(({ create }) => create('User', { name: 'Homer Simpson' }))
const serialized = paper.serialize();
```

The value of `serialized` would look something like:

```json
{
  "store": {
    "User": [
      {
        "name": "Homer Simpson",
        "__meta__": {
          "DOCUMENT_KEY": "AeJIL2KD",
          "DOCUMENT_CONNECTIONS": {},
          "DOCUMENT_GRAPHQL_TYPENAME": "User"
        }
      }
    ]
  },
  "__meta__": { "NULL_DOCUMENT_KEY": "mQZb1RTj" }
}
```

This contains all the information to re-create the structure of a paper instance. The returned javascript object is
futher serializable to a JSON string with `JSON.stringify(serialized)`.

## Deserialization

Deserializing can be done with the **public static method** `Paper.deserialize`, and passing the serialized payload from
a previous `serialize` call. If the serialized payload is a JSON string make sure to use `JSON.parse()` first and then
pass the result to `Paper.deserialize`.

```js
import { Paper } from 'graphql-paper';
const paper = Paper.deserialize(serialized);
```

The resulting paper instance from `Paper.deserialize` now has the same documents and connections from the paper instance
that was originally serialized.
