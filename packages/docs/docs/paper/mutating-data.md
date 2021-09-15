---
id: mutating-data
title: Mutating Data
---

Data in the store is *always* mutated via the `mutate` method on a `Paper` instance by passing in a *Mutation Transaction* callback. Within the *Mutation Transaction* callback there are several operations available to support being able to make changes easily to the store, even [custom ones can be added](/docs/paper/operations#creating-custom-operations).

## `mutate` and the *Mutate Transaction* callback

To make any changes call the `mutate` method on the `Paper` instance and provide a *Mutate Transaction* callback.

Operations can be destructured from the first argument provided in the *Mutation Transaction* callback.

For example, an `Actor` document could be created within `mutate` by using the `create` operation. In this example only `create` is being destructured for use but any combination of operations can be used with the callback (see more of the [library-provided operations](/docs/paper/mutating-data#transaction-operations) below).

With a GraphQL Schema:

```graphql
schema {
  query: Query
}

type Query {
  allFilms: [Film!]!
}

type Film {
  title: String!
  actors: [Actor!]!
}

type Actor {
  name: String!
}
```

The following *Mutate Transaction* callback will create a `Document` of the GraphQL `Actor` type.

```js
await paper.mutate(({ create }) => {
  create('Actor', {
    name: 'Julia Roberts'
  });
});
```

**Note:** `mutate` returns a promise and the transaction callback is not considered executed until the promise is fulfilled. Calls to `mutate` will process transaction callbacks in the order they are called.

All changes within a *Mutation Transaction* callback will be validated via [Validators](/docs/paper/validations) after the transaction to ensure the new version of the `DocumentStore` is consistent.

## Transaction Operations

Out of the box the following operations can be destructured within the callback:

`create`, `find`, `remove`, `clone`, `getStore`, `queueEvent`.

```js
await paper.mutate(({ create, find, remove, clone, getStore, queueEvent }) => {
  // do something within the callback
});
```

Creating [custom operations](/docs/paper/operations#creating-custom-operations) can be helpful for creating common functional mutations on the GraphQL Paper `DocumentStore` or to provide common helpers that are useful within a *Transaction Callback*.

### `create`

* [API](pathname:///api/paper/modules/operations.html#create)

```js
await paper.mutate(({ create }) => {
  const julia = create('Actor', {
    name: 'Julia Roberts'
  });
});
```

The first argument is the GraphQL type for the document and the second is an object representing its data, mapping GraphQL fields to the object properties.

#### Creating a Documented with Connections

The `create` operation supports the ability to create connections through either by a [nested object](#creating-connections-within-create-via-nesting) or explicitly through the [property on the document](#creating-connections-via-document-properties), both of which are covered below.

### `find`

* [API](pathname:///api/paper/modules/operations.html#find)

In order to make changes to documents it's important to have access to a version of the document that can be mutated. If there is access to a read-only/frozen/stale document in scope, a mutable version can be looked up via `find`.

```js
let existingDocument;

await paper.mutate(({ find }) => {
  const mutableVersion = find(existingDocument);
});
```

### `remove`

* [API](pathname:///api/paper/modules/operations.html#remove)

To remove a `Document` from the store use the `remove` operation.

```js
await paper.mutate(({ remove }) => {
  remove(document);
});
```

### `clone`

* [API](pathname:///api/paper/modules/operations.html#clone)

Use the `clone` operation to create a new document that copies the properties and connections of an existing document.

```js
await paper.mutate(({ clone }) => {
  const newDocument = clone(document);
});
```

### `getStore`

* [API](pathname:///api/paper/modules/operations.html#getStore)

This operation gives the current **mutable** version of the `DocumentStore` available for mutating within the *Mutation Transaction* callback. This is useful for when access to underlying `DocumentStore` data structure and its `Documents` is required. It can also be useful to query by using typical javascript methods, for example:

```js
await paper.mutate(({ getStore }) => {
  const store = getStore();
  // Get the `Actor` document for "Julia Roberts" using available
  // javascript array methods
  const julia = store.Actor.find(({ name }) => name === 'Julia Roberts');
});
```

If common modifications are being done via `getStore` consider making a [custom operation](/docs/paper/operations#creating-custom-operations).

### `queueEvent`

* [API](pathname:///api/paper/modules/operations.html#queueEvent)

Use the `queueEvent` operation to queue an event to be dispatched after the transaction is complete. The `queueEvent` takes an instance of `Event`.

```js
await paper.mutate(({ queueEvent }) => {
  queueEvent(new Event('meow', { /* custom event data */ }));
});
```

## Creating Connections Between Documents

A *Connection* is used to create a relationship between Documents where one GraphQL type references another GraphQL type in the GraphQL schema.

A `Document` reference can be:
* one-to-one, ie: one film can have one leading actor:
```graphql
type Film {
  leadingActor: Actor
}
```
* one-to-many, ie: one film can have many actors:
```graphql
type Film {
  leadingActors: [Actor]
}
```

**Note:** Non-null (denoted by a `!`, ie: `Actor!`, `[Actor!]!`, `[Actor!]`, `[Actor]!`) variations of these also work and are validated.

**Note:** Connections are one direction. If "Document A" is connected to "Document B" and "Document B" is also connected to "Document A" then two connections must be defined explicitly. There is no automatic reflexive assumptions or setup done between connections (although a custom operation could be created to handle these cases).

### Creating Connections via Document Properties

Within a *Mutate Transaction* callback changes can be made to any documents and their properties.

#### One-to-One Connections

To create a one-way one-to-one connection between a document and another, assign the property to a `Document`, see below where the `leadingActor` property is connected by assigning the `jeffGoldblum` document.

```js
await paper.mutate(({ create }) => {
  const jeffGoldblum = create('Actor', {
    name: 'Jeff Goldblum'
  });

  // as a property within `create`
  const jurassicPark = create('Film', {
    name: 'Jurassic Park',
    leadingActor: jeffGoldblum
  });

  // or assigned after
  const lifeAquatic = create('Film', {
    name: 'The Life Aquatic'
  });

  lifeAquatic.leadingActor = jeffGoldbum;
});
```

#### One-to-Many Connections

To create a one-way one-to-many connection reference documents on the property via an Array, this works with new and existing documents.

```js
await paper.mutate(({ create }) => {
  const anjelicaHuston = create('Actor', {
    name: 'Anjelica Huston'
  });

  const owenWilson = create('Actor', {
    name: 'Owen Wilson'
  });

  // on the `actors` property within `create`
  const theRoyalTenebaums = create('Film', {
    title: 'The Royal Tenebaums',
    actors: [anjelicaHuston, owenWilson]
  })

  // or assigned after via `push` to an array
  const theLifeAquatic = create('Film', {
    title: 'The Life Aquatic'
  });

  // This works assuming it's a non-null list:
  // (ie: `actors: [Actor]!` or `actors: [Actor!]!`.
  //
  // Otherwise the array needs to be created first since it could be null:
  // `theLifeAquatic.actors = theLifeAquatic.actors ?? [];`
  //
  // see note below for more details
  theLifeAquatic.actors.push(anjelicaHuston, owenWilson);
});
```

**Note:** While less typical in GraphQL Schemas, if a one-to-many property can nullable (ie: `actors: [Actor]` *without* an `!` outside the list) then it's important to make sure you are working with an array before pushing to it. The `??` can help in this case. If working with a non-null list (`[Actor]!` or  `[Actor!]!`) then it will already be an array by default.

```js
await paper.mutate(({ create }) => {
  film.actors = film.actors ?? [];
  film.actors.push(newActor);
});
```

### Creating Connections within `create` via Nesting

One powerful technique is to use the `create` operation with a nested object that includes its connections. This nesting will work recursively. Other documents that have already been created can be included, too.

```js
await paper.mutate(({ create }) => {
  // documents created outside of nesting can be used within nesting, too
  const scarlettJohansson = create('Actor', { name: 'Scarlett Johansson' });

  const isleOfDogs = create('Film', {
    title: 'Isle of Dogs',
    actors: [
      scarlettJohansson,
      { name: 'Jeff Goldblum' },
      { name: 'Tilda Swinton' },
      { name: 'Bill Murray' },
      { name: 'Bryan Cranston' },
    ]
  });
});
```

This nested `create` will end up creating a `Film` document and four `Actor` documents, skipping creating `scarlettJohansson` because the `Actor` document was already created but it will still be included as a connection.

## Returning Data Outside the *Mutate Transaction* callback

It's also very useful to return documents that have been used or created within a `mutate` transaction to be referenced afterwards. This can be done by returning a document, an array of documents, or an object with documents values, from the *Mutate Transaction* callback. See [*Returning Documents from Mutation Transactions*](/docs/paper/querying-data#returning-documents-from-mutation-transactions) for examples.
