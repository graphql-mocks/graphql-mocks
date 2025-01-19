---
id: querying-data
title: Querying Data
---

There are a few different ways to retrieve data from a `Paper` instance.

- [Access the current `DocumentStore` via the `data` property](#querying-documents-via-the-data-property)
- [Exchange a previous document for a newer copy](#exchange-documents-for-a-newer-copy)
- [Return documents from within a `mutate` transaction](#exchange-documents-for-a-newer-copy)

**Note:** It is important to remember that a document retrieved from the store is considered stale-on-arrival and cannot
be modified. It does not represent an instance but instead a stale copy, or snapshot, of the document at the time of
retrieval. For an updated version of the document it needs to be exchanged for an updated copy
([see below](#exchange-documents-for-a-newer-copy))

## Querying Documents via the `data` Property

A frozen read-only copy of the store is available via the `data` property on the `Paper` instance.

The shape of a store is:

```js
{
  [typeName]: Document[]
}
```

A GraphQL Schema with these two types:

```graphql
type Actor {
  name: String!
}

type Film {
  title: String!
}
```

Could have a store like:

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

Since the data is accessed by type as a regular array the usual array methods can be used for accessing the data, and
Documents in the array can be treated as POJOs.

```js
// returns the document { title: 'Jurassic Park' }
paper.data.Film[0];
```

```js
// returns the document { title: 'Godzilla' }
paper.data.Film.find(({ title }) => title === 'Godzilla');
```

## Exchange Documents for a Newer Copy

Since documents are immutable snapshots they need to be exchanged for updated copies. This can be done by using the
`find` method on a `Paper` instance which will take the existing document to be exchanged for the latest copy.

```js
// with a reference to an existing document exists from previously being fetched
film;

// return the latest copy of that document
const latestFilm = paper.find(film);
```

## Returning Documents from Mutation Transactions

It's often useful to be able to have immediate access to a `Document` that has just been created/updated in a mutation
transaction. This can be done by returning the Document, an array of Documents or an object of documents.

```js
const macAndMe = paper.mutate(({ create }) => {
  const film = create('Film', { title: 'Mac and Me' });
  return film;
});
```

The `film` variable representing the newly created document is returned and available outside via the `macAndMe`.

Similar with returning an object that can be destructured:

```js
const { macAndme, spaceJam } = paper.mutate(({ create }) => {
  const macAndMe = create('Film', { title: 'Mac and Me' });
  const spaceJam = create('Film', { title: 'Space Jam' });

  return { macAndMe, spaceJam };
});
```

Or from an Array:

```js
const [macAndme, spaceJam] = paper.mutate(({ create }) => {
  const filmOne = create('Film', { title: 'Mac and Me' });
  const filmTwo = create('Film', { title: 'Space Jam' });

  return [filmOne, filmTwo];
});
```

## Traversing Connections Between Documents

GraphQL Paper has support for connections between types as defined by the GraphQL Schema. If it's a list of types or a
singular type it can be handled by GraphQL Paper. Accessing connections on a document do not have any special API and
are accessible like any other field, as a property on the document.

With a schema where a `Film` can have multiple actors:

```graphql
type Actor {
  name: String!
}

type Film {
  title: String!
  actors: [Actor!]!
}
```

A film's actors could be accessed directly:

```js
const film = paper.data.Film[0];

// returns any actors connected to the Film document
film.actors;
```

Connections between documents are created during a mutation and are covered in
[_Mutating Data_](/docs/paper/mutating-data).
