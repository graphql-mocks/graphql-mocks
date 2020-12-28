---
title: Using Resolvers
---

Resolvers are functions that make up the basis for how data is determined in _resolving_ queries in GraphQL APIs. There
are two types of resolvers, _Field Resolvers_ and _Type Resolvers_. _Field Resolvers_ represent the specific data
returned within the `data` key a result payload. _Type Resolvers_ are responsible for taking an Abstract Type (GraphQL
Union or Interface types) and returning a string representing the concrete type.

## Field Resolvers

Field resolvers are represented by the following function:

```js
async function (parent, args, context, info) {
  return data;
}
```

The majority of the time when Resolvers are mentioned in a GraphQL context it is referring to _Field Resolvers_. Field
Resolvers are responsible for returning the `data` specified by the GraphQL Schema (or a `Promise` of the data). Check
out the [apollo documentation on resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers/), too, it
applies here and to GraphQL in general.

With the given schema:

```graphql
schema {
  # denotes the "Root Query Type" as the "Query" type
  query: Query
}

# "Query" is the "Root Query Type" as denoted by the schema definition
type Query {
  # root field that returns an "Actor"
  actor: Actor!
}

type Actor {
  name: String!
}
```

This schema would have two resolvers:

- One "root field resolver" on the `Query` type for the `actor` field
- One "non-root field resolver" on the `Actor` type for the `name` field

### Root (Query and Mutation) Field Resolvers

All GraphQL queries start with a "root" field. Root Field Resolvers are either on the root `Query` type or the root
`Mutation` type depending on whether it's a query or mutation operation, respectively. These root resolvers "kick off"
the query and being at the "root" typically have a `null` parent argument (unless one has been explicitly declared).

A root resolver function for the `actor` field could be:

```js
async function (parent, args, context, info) {
  return {
    name: "Meryl Streep"
  };
}
```

### Non-Root Field Resolvers

Any type is that not the root Query type or the root Mutation type will be a type that contains non-root field
resolvers. In this case they are _connected to the graph_ through some reference to the root Query and Mutation types.
Due to the graph-like nature of resolving queries these non-root fields and their resolvers can be referenced multiple
times and as such often rely on the `parent` parameters to understand their connection in the graph.

The _non-root field_ on `Actor` is `name`. When any type resolves an `Actor` type each of the field resolvers receives
the parent and is responsible for returning a result for their field.

The `name` field resolver on the `Actor` type could look like:

```js
async function (parent, args, context, info) {
  return parent.name;
}
```

This example looks for the `name` property on the parent. In this case the `parent` was:

```json
{
  "name": "Meryl Streep"
}
```

The returned value is `"Meryl Streep"` which matches the return value of `String!` set by the `name` field on the
`Actor` type.

Now, to show the flexible nature of resolvers lets expand the the `Actor` type:

```graphql
type Actor {
  name: String!
  favoriteActor: Actor
}
```

Here we have the `favoriteActor` of an `Actor` being **another `Actor`**. This demonstrates the how types can reference
each other and resolver functions have to be able to return the relevant data whether called from a Root Query or Root
Mutation type, or from another type, or the same type itself.

If Tom Hanks was Meryl Streep's favorite actor the `favoriteActor` resolver could look like:

```js
async function (parent, args, context, info) {
  if (parent.name === "Meryl Streep") {
    return "Tom Hanks";
  }

  return null;
}
```

Only when the parent `Actor` has a name of `"Meryl Streep"` do we return `"Tom Hanks"` in other cases we will return
`null` for all other `Actor`s. This could be quite tedious to manage all the favorite actors from a single resolver so
it is usually best practice to have a data source or a well-referenced look-up that can be used. Typically, the parent
also has an `ID` field that can be referenced for lookup also.

### Default Field Resolver

It should be noted that GraphQL sets up every field with a default Field Resolver function. In fact it can be imported
from the `graphql` package, too.

```js
import { defaultFieldResolver } from 'graphql';
```

It will attempt to resolve a field based on the a look up of the field's name on the parent. This typically a desired
behavior so often you don't have to write a resolver at all, graphql will do this "out of the box".

There are a couple of other things the default Field Resolver does, check out the
[source code](https://github.com/graphql/graphql-js/blob/7b3241329e1ff49fb647b043b80568f0cf9e1a7c/src/execution/execute.js#L1208-L1226),
it's under 10 lines!

### `parent` parameter (first)

Sometimes called `obj`, and be named whatever you call the variable, represents the previous returned value in the
"graph" of results. As mentioned, in root field resolvers this will typically be null since the query has just begun and
has no parent.

### `arg` parameter (second)

When a schema specifies arguments and those values are provided they are available on the field by its `arg` parameter.
Instead of defaulting to "Meryl Streep" what if we had a list of actors required the name to be specified and returned
the actor that matched.

```graphql
type Query {
  # an additon of a required `name` argument to look up the actor
  actor(name: String): Actor!
}
```

```js
const actors = [ { name: 'Meryl Streep' }, { name: 'Tom Hanks' } ];

async function (parent, args, context, info) {
  return actors.find(actor => actor.name === args.name);
}
```

And the value for name can be referenced as an argument:

```graphql
query {
  actor(name: "Tom Hanks") {
    name
  }
}
```

The source of this `actors` data is a bit hand-wavy, there are ways of accessing these data sources (typically from the
`context` parameter), but what is important is how arguments are passed to the field and its resolver via the `args`
parameter.

### `context` parameter (third)

This is the "global" bucket that is accessible in every resolver. It's usually an object. It's typically a good place to
put data sources that can combined with the `parent` and `args` can be used to lookup. `graphql-mocks` has an opinion
approach with a managed context to provide conventions and assist in threading the common use cases.

For example, `dependencies` that are passed to the [graphql-mocks GraphQL Handler](/docs/getting-started/create-handler)
can reliably be pulled from context using the
[`extractDependencies` function](http://localhost:3000/api/modules/_resolver_extract_dependencies_.html#extractdependencies).
There are other helpful ways that context can be used with `graphql-mocks`, too!

### `info` parameter (fourth)

This is mostly a holder of meta and GraphQL information. It's not usually needed but does have some handy insights into
the query, AST, and access to the GraphQL schema.

## Type Resolvers

While covered less the `resolveType` Type Resolver function on the
[`GraphQLInterfaceType`](https://graphql.org/graphql-js/type/#graphqlinterfacetype) and
[`GraphQLUnionType`](https://graphql.org/graphql-js/type/#graphqluniontype) play an important role in resolving GraphQL
queries. See the Apollo documentation for
[additional examples](https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/).

Type Resolver functions have the following signature:

```js
async function (value, context, info, abstractType) {
  return 'ResolvedTypeName';
}
```

The objective for a Type Resolver is given a "value", the object in question, to determine which discrete type is
represented. The return value of a Type Resolver function is a string representing the concrete type name, ie: `Dog` or
`Cat` in the following example for the `Pet` abstract type.

Here's an example:

```graphql
schema {
  query: Query
}

type Query {
  pet: Pet!
}

union Pet = Cat | Dog

type Cat {
  name: String!
}

type Dog {
  name: String!
  likesBones: Boolean!
}
```

And our Type Resolver:

```js
async function (value, context, info, abstractType) {
  if ('likesBones' in value) {
    return 'Dog';
  } else {
    return 'Cat';
  }
}
```

We are given the concrete object in question and are responsible for determining which type of `Pet` it is: either a Pet
is a `Dog` or a `Cat`. In this contrived example the `likesBones` property is checked to exist and if it does we assume
it's a `Dog`. This is something to consider when working with Abstract Types (Unions and Interfaces) is how the
underlying concrete types will be identified. It is usually to leave a concrete type identifier `__typename` on the
concrete type which would allow the default type resolver to automatically use the value.

### `value` parameter (first)

The ambiguous object in question that needs to be identified to a concrete type

### `context` parameter (second)

The same `context` [global object as represented in Field Resolvers](/docs/resolver/using-resolvers#context-parameter-third).

### `info` parameter (third)

Represents the meta details and GraphQL information, is usually only needed in exceptional cases.

### `abstractType` parameter (fourth)

`abstractType` is either a `GraphQLInterfaceType` or `GraphQLUnionType` and the instance provides the details of the
abstract type that is being resolved down to a concrete type.

### Default Type Resolver

Similar to Field Resolvers, Type Resolvers also have a default resolver that exists on the `resolveType` of the
Interface and Union types.

```js
import { defaultTypeResolver } from 'graphql';
```

The default behavior the `defaultTypeResolver` is to check the object for the `__typename` field and return the value if
it exists, or less commonly to check `isTypeOf` on each on each possible type with the object being coerced. Check out
the
[source code](https://github.com/graphql/graphql-js/blob/d6e760cf7060217bd25fa934bd104ff2400aad96/src/execution/execute.js#L1147-L1195)
for more details.

## Organizing Resolvers for Executing GraphQL queries

This page focuses on the Resolver functions themselves but hasn't shown how they are actually applied to the Fields and
Abstract Types that they are responsible for resolving. On their own they are "just functions" and need a way of being
assigned. This is the role of a Resolver Map which organized these Resolver Functions so that they can be applied to a
`GraphQLSchema` and executed against queries and mutations, check out the
[Resolver Map](/docs/resolver-map/using-resolver-maps) to understand the next step in applying Resolver functions.

## Extending Resolvers with Resolver Wrappers

The next section will introduce Resolver Wrappers from this library and how they can be used to allow Resolvers
functions to be extended.

## Additional Resources

- [Apollo.js Resolver Documentation](https://www.apollographql.com/docs/apollo-server/data/resolvers/)
- [Official graphql.js Query Execution Documentation](https://graphql.org/learn/execution/)
