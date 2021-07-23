---
id: mutating-data
title: Mutating Data
---

Data in the store is *always* mutated via the `mutate` method on a `Paper` instance by passing in a *Mutation Transaction* callback. Within the *Mutation Transaction* callback there are several operations available to support being able to make changes easily to the store, even custom ones can be added.

## `mutate` and the *Mutate Transaction* callback

To make any changes call the `mutate` method on the `Paper` instance and provide a *Mutate Transaction* callback.

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

Operations can be destructured from the first argument provided in the *Mutation Transaction* callback. For example, an `Actor` document could be created within `mutate` by using the `create` operation. In this example only `create` is being destructured for use by any combination of operations can be used with the callback (see more out-of-the-box operations below).

```js
await paper.mutate(({ create }) => {
  create('Actor', {
    name: 'Julia Roberts'
  })
});
```

**Note:** `mutate` returns a promise and the transaction callback is not considered executed until the promise is fulfilled. Calls to `mutate` will process transaction callbacks serially and the in called order.

All changes within a *Mutation Transaction* callback will be validated to ensure consistency with the new version of the store.

## Transaction Operations

Out of the box the following operations can be destructured within the callback:

`create`, `find`, `remove`, `clone`, `getStore`, `queueEvent`.

```js
await paper.mutate(({ create, find, remove, clone, getStore, queueEvent }) => {
  // do something within the callback
});
```

Creating custom operations is supported and can be helpful for creating common functional mutations to the GraphQL store or to provide common helpers that are useful within a *Transaction Callback*.

### `create`

* [API](/api/paper/modules/operations.html#create)

```js
await paper.mutate(({ create }) => {
  const julia = create('Actor', {
    name: 'Julia Roberts'
  });
});
```

The first argument is the GraphQL type for the document and the second is an object representing its fields.

### Creating a Documented with Connections

The `create` operation supports the ability to create connections through either by a [nested object](#connections-on-create-via-nesting) or explicitly through the [property on the document](#connections-via-document-properties), both of which are covered below.

### `find`

* [API](/api/paper/modules/operations.html#find)

In order to make changes to documents it's important to have access to a version of the document that can be mutated. If there is access to a read-only/frozen/stale document in scope, a mutable version can be looked up via `find`.

```js
let existingDocument;

await paper.mutate(({ find }) => {
  const mutatableVersion = find(existingDocument);
});
```

### `remove`

* [API](/api/paper/modules/operations.html#remove)

To remove a `Document` from the store use the `remove` operation.

```js
await paper.mutate(({ remove }) => {
  remove(document);
});
```

### `clone`

* [API](/api/paper/modules/operations.html#clone)

Use the `clone` operation to create a new document that copies the properties and connections of an existing document.

```js
await paper.mutate(({ clone }) => {
  const newDocument = clone(document);
});
```

### `getStore`

* [API](/api/paper/modules/operations.html#getStore)

This operation gives the current version of the store available for mutating within the *Mutation Transaction* callback. This is useful for when access to underlying `DocumentStore` data structure and its `Documents` is required. It can also be useful to query by using typical javascript methods, for example:

```js
await paper.mutate(({ getStore }) => {
  const store = getStore();
  // Get the `Actor` document for "Julia Roberts" using available
  // javascript array methods
  const julia = store.Actor.find(({ name }) => name === 'Julia Roberts');
});
```

### `queueEvent`

* [API](/api/paper/modules/operations.html#queueEvent)

Use the `queueEvent` operation to queue an event to be dispatched after the transaction is complete. The `queueEvent` takes an instance of `Event`.

```js
await paper.mutate(({ queueEvent }) => {
  queueEvent(new Event('meow', { /* custom event data */ }));
});
```

## Creating Connections Between Documents

A *Connection* is used to create a relationship between Documents where one GraphQL type references another GraphQL type in the GraphQL schema.

A `Document` reference can: be:
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

**Note:** Non-null (denoted by a `!`, ie: `Actor!`, `[Actor!]!`, `[Actor!]`, `[Actor]!`) variations of these work also.

**Note:** Connections are one direction. If "Document A" is connected to "Document B" and "Document B" is also connected to "Document A" then two connectiosn must be defined explicitly. There is no automatic reflexive assumptions or setup done (although a custom operation could be created to help handle this case).

### Connections via Document Properties

Within a *Mutate Transaction* callback changes can be made to any documents and their properties.

#### One-to-One Connections

To create a one-way one-to-one connection between a parent document and its child assign the property to a Document reference (see `leadingActor` property assigned to the `jeffGoldblum` child document below).

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

To create a one-way one-to-many connection reference documents on the property via an Array, either on an existing or new document.

```js
await paper.mutate(({ create }) => {
  const anjelicaHuston = create('Actor', {
    name: 'Anjelica Huston'
  });

  const owenWilson = create('Actor', {
    name: 'Owen Wilson'
  });

  // as a property within `create`
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
  // Otherwise the array needs to be created first:
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

### Connections within `create` via Nesting

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

This nested `create` will end up creating a `Film` document and four `Actor` documents (skipping `scarlettJohansson` because the `Actor` document was already created).

## Returning Data Outside the *Mutate Transaction* callback

It's also very useful to stash documents that have been used or created within a `mutate` transaction afterwards. This can be done by returning a document an array, object of documents from the *Mutate Transaction* callback. See [*Returning Documents from Mutation Transactions*](/docs/paper/querying-data#returning-documents-from-mutation-transactions) for examples.
