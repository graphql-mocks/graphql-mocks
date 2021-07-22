---
id: querying-data
title: Querying Data
---

Data is organized in a `DocumentStore` on the `Paper` instance. A "frozen" version of the data store is available on the `Paper` instance under the `data` property. The shape of the store is:

```js
{
  [typeName]: Document[]
}
```

Where a `Document` is a special POJO (plain-old javascript object) that represents the properties available on a GraphQL type.

Let's say that the GraphQL Schema had these two types:

```graphql
type Actor {
  name: String!
}

type Film {
  title: String!
}
```

A simplified store could like:
```js
{
  Film: [
    { title: 'Jurassic Park' },
    { title: 'Godzilla' }
  ],
  Actor: [
    { name: 'Jeff Goldblum' },
    { name: 'Elizabeth Olsen' }
  ]
}
```

To fetch the representation of this store on a `Paper` instance would then be something like:

```js
// would return { title: 'Jurassic Park' }
paper.data.Film[0]
```

Any data fetched should be considered immutable and "stale on arrival". To get the latest copy it should be refetched.
