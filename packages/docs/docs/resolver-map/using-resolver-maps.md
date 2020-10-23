---
title: Using Resolver Maps
---

After learning [how to use Resolvers](/docs/resolver/using-resolvers) to resolve data all that is left to organize them
for query execution. Resolver Maps help define the GraphQL API by _mapping_ Resolvers to the appropriate field (or
Abstract Type in the case of Type Resolvers). The idea of Resolver Maps has been covered by
[Apollo](https://www.apollographql.com/docs/tutorial/resolvers/#add-resolvers-to-apollo-server) and
[graphql-tools](https://www.graphql-tools.com/docs/resolvers/#resolver-map). With the Resolver Map format it is easier
to see how Resolvers are applied to a GraphQLSchema and executed with a GraphQL handler.

Here is an example of a mapping between a GraphQL Schema and Resolvers via a Resolver Map.

**GraphQL Schema**

```graphql
schema {
  query: Query
}

type Query {
  media: [Media!]!
}

union Media = Movie | TV;

type Movie {
  title: String!
  director: String!
}

type Tv {
  title: String!
  network: String!
}
```

**Resolver Map**

```js
const resolverMap = {
  Query: {
    movies: queryMoviesFieldResolver,
  },

  Movie: {
    title: movieTitleFieldResolver,
    director: movieDirectorFieldResolver,
  },

  Tv: {
    title: tvTitleFieldResolver,
    network: tvNetworkFieldResolver,
  },

  // Media is represented by the "Media" Union Type (an abstract type)
  Media: {
    // This is a special case for resolving Abstract Types (Union and Interfaces)
    // Providing the `__resolveType` key to specify the the Type Type Resolver
    __resolveType: mediaAbstractTypeResolver,
  },
};
```

The first level within a `resolverMap` object represents the GraphQL Type which has a value of an object. This next
level object refers the field name referencing a [Field Resolver](docs/resolver/using-resolvers#field-resolvers) or in
the case that the type is an Abstract type (Union or Interface) the key is `__resolveType` and points to a
[Type Resolver](/docs/resolver/using-resolvers#type-resolvers). In this example the resolver functions are references to
resolver functions would could be provided inline or imported from elsewhere.

It should also be noted that "gaps" in a Resolver Map are covered by the
[default field resolver](docs/resolver/using-resolvers#default-field-resolver) or the
[default type resolver](docs/resolver/using-resolvers#default-type-resolver) in the case of type resolvers for Unions
and Interfaces.

## Modifying the Resolver Map Surface Area

Resolver Maps have a direct impact on how Resolvers are organized and executed. If there was a way to make adaptive
changes to the Resolver Map, as a primitive, it would mean being able to swap and modify the Resolver Map surface area
for various mocking and test scenarios. These methods are covered by Resolver Map Middlewares and are part of the core
concepts of graphql-mocks and what creates

## Additional Resources

The Apollo docs provide some
[great examples](https://www.apollographql.com/docs/tutorial/resolvers/#add-resolvers-to-apollo-server) on Resovler
Maps, Resolvers and the execution flow of GraphQL. Much of this documentation also applies in the goal of mocking
GraphQL.
