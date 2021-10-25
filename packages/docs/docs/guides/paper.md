---
title: Using Paper with graphql-mocks
---

import { GraphQLResult } from '../../src/components/graphql-result';
import PaperQueryingExample from 'code-examples/guides/paper-querying.source.md';
import paperQueryingResult from '../../code-examples/guides/paper-querying.result';

import PaperMutationExample from 'code-examples/guides/paper-mutation.source.md';
import paperMutationResult from '../../code-examples/guides/paper-mutation.result';

GraphQL Paper can be used on its own but has been designed and tested to integrate with `graphql-mocks`.

For more features specific to GraphQL Paper and its capabilities check out the [GraphQL Paper Documentation](/docs/paper/introducing-paper).

## Installation

```bash
# npm
npm install --save-dev graphql-paper graphql

# yarn
yarn add --dev graphql-paper graphql
```

## Setup

The only setup after installing the `graphql-paper` package is to import it, create a new instance and add it to the GraphQL Handler's dependencies.

```js
import { Paper } from 'graphql-paper';
import { GraphQLHandler } from 'graphql-mocks';
import graphqlSchema from './schema';

const paper = new Paper(graphqlSchema);
const handler = new GraphQLHandler({ dependencies: { graphqlSchema, paper }})
```

## Using `Paper` within Resolver Functions

Within a resolver function the `paper` dependency can be extracted using `extractDependencies`.

```js
import { extractDependencies } from 'graphql-mocks/resolver';

function resolver(parent, args, context, info) {
    const paper = extractDependencies(context, ['paper']);
    // do something with the paper store...
    // see below for query and mutation examples
}
```

## Querying Data

Only top-level Query resolvers need to be specified for the GraphQL Paper Document. The rercursive data structure of Paper Documents from the store will follow Connections to other Paper Documents, automatically resolving the fields backed by *Concrete Data*. In the case of *Derived Data* there are some examples and patterns to follow below.

<PaperQueryingExample />

<GraphQLResult result={paperQueryingResult} />

## Mutating Data

Similar to *Querying Data* only the top-level Mutation resolvers need to be defined returning necessary documents and nested *Concrete Data* will be automatically resolved.

<PaperMutationExample />

<GraphQLResult result={paperMutationResult} />

## Separation of Concrete and Derived Data

One important thing to consider when using GraphQL Paper with `graphql-mocks` is how data should be modeled. Most of the time the data is dealt with as *Concrete Data* and should be stored in the GraphQL Paper store. In other cases it's *Derived Data* and should be handled by `graphql-mocks` and its tools. These definitions and examples are expanded on below.

### Concrete Data

Concrete data usually represents a distinct entity, might have an ID and defined property values. In the example of GraphQL Paper concrete data is represented by a Paper Document and its properties. Not all GraphQL Types or fields on GraphQL Types should be reflected by concrete data, which is covered in the *Derived Data* sections below.

An example of concrete data could be a `Film` which is unique and represents a singular entity.

```graphql
type Film {
  title: String!
}
```

represented concretely by a Paper Document:

```js
{
  title: 'The Notebook'
}
```

This is an example of *Concrete Data* represented by a GraphQL Paper Document where its properties mirror the GraphQL Types and its fields which allows for the data to resolve automatically, and recursively through connections and their fields.

### Derived Data

Derived Data represents data that does not stand on its own and should be handled by `graphql-mocks` in helping resolve a query with supporting data from the GraphQL Paper store. There are two main types of *Derived Data* when dealing and resolving GraphQL queries.

#### Derived Types

Derived types are types whose definition is derived by the concrete data it contains but on its own is not reflected in the store. The container type often acts a logical grouping.

In this example `FilmSearchResults` represents a container containing the actual results of films and the count. This type should not have any documents stored in GraphQL Paper but can still be resolved by a *Resolver* or *Resolver Wrapper*.

```graphql
type FilmSearchResults {
  results: [Film!]!
  count: Int!
}
```

##### Using Resolvers

A *Resolver* function can be used to resolve the correct shape of the *Derived Data*. In the case a *Resolver* function already exists then using a *Resolver Wrapper* is appropriate (see below).

This example uses the `FilmSearchResults` type from above and assumes that we have a top-level query field `searchFilms`:

```graphql
type Query {
  searchFilm(query: String!): FilmSearchResults!
}
```

The `searchFilm` resolver function could look like:

```js
const  searchFilmResolver = (root, args, context, info) => {
  const { paper } = extractDependencies(context, ["paper"]);
  const films = paper.data.Film.filter((film) => film.title.includes(args.query));

  // return the required shape of `FilmSearchResults`
  return {
    results: films,
    count: films.length,
  };
}
```

This resolver can be applied to the initial `resolverMap` passed into the [GraphQL Handler](/docs/handler/introducing-handler) or applied via [`embed`](/docs/resolver-map/managing-resolvers#using-embed).

##### Using Resolver Wrappers

In some special cases the data might already be represented by a field with a resolver that resolves the correct data but not in the supporting shape of the *Derived Type*. In this case a *Resolver Wrapper* can be used to retrieve the data of the original resolver and return a modified form. This has the added benefit of decoupling the resolver sourcing the data from the wrapper that transforms it to the shape expected, making the wrapper re-usable also in cases where this transform might be needed again.

In this example the `films` property on an `Actor` might already be returning the `films` property but not in the shape of `FilmSearchResults`.

```graphql
type Actor {
  films(query: String!): FilmSearchResults!
}
```

Assuming the original resolver returns an array of `Film` documents we could use this wrapper:

```js
import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';

const wrapper = createWrapper('FilmSearchResults', WrapperFor.FIELD, function(originalResolver, wrapperOptions) {
  return function filmSearchResultsWrapper(parent, args, context, info) {
    const films = await originalResolver(parent, args, context, info);
    return {
      results: films,
      count: films.length
    };
  };
});
```

#### Derived Fields

In other cases derived fields could be something that derives its value from other fields or when filtering the existing data based on the arguments.

In the case that the derived data is filtered or refined based on arguments, and the data exists by the resolver already, it's best to use a resolver wrapper. See [*Automatic Resolver Filtering with Wrappers*](/docs/guides/automatic-filtering) for ideas and examples.

This is an example of a value being derived from other fields. We wouldn't want to store the `speed` on the Paper Document since it can be determined from `miles` and `timeInHours`. The `speed` data itself would would be best represented by a resolver.

```graphql
type Trip {
  miles: Float!
  timeInHours: Float!

  # miles per hour (miles / timeInHours)
  speed: Float!
}
```

The resolver for the `speed` field would look like:

```js
function tripSpeedResolver(parent, args, context, info) {
  const { miles, timeInHours } = parent;
  return miles / timeInHours;
}
```

This resolver can be applied to the initial `resolverMap` passed into the [GraphQL Handler](/docs/handler/introducing-handler) or applied via [`embed`](/docs/resolver-map/managing-resolvers#using-embed).
