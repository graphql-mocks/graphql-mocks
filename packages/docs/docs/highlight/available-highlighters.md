---
title: Available Highlighters
---

They are used in conjunction with the [Highlight system](/docs/highlight/introducing-highlight) and you can also [create your own custom ones](/docs/highlight/creating-highlighters). If you've created one that could be useful for the community open up a PR or issue and it can be added either to the `graphql-mocks` package or linked externally.

## `field`
Package: `graphql-mocks`

```js
import { field } from 'graphql-mocks/highlight';
```

This highlighter allows highlighting GraphQL fields from a GraphQL Schema.

### Highlight with Field References

Fields can be highlighted by passing in one or more Field Reference tuple(s) of typename and field name.

```js
hi(graphqlSchema).include(
  field(['Query', 'users'], ['Mutation', 'addUser'])
);
```

### Wildcard Highlighting

Either all types or all fields can be highlighted using the `HIGHLIGHT_ALL` constant for either position in the tuple:

```js
import { HIGHLIGHT_ALL } from 'graphql-mocks/highlight';

hi(graphqlSchema).include(
  field(
    // highlight the "users" field on all types
    [HIGHLIGHT_ALL, 'users']

    // highlight all fields on the Query type
    ['Query', HIGHLIGHT_ALL]
  )
);
```

### Highlight All Fields

Calling `field` with no arguments will highlight all fields on all types.

```js
hi(graphqlSchema).include(field());
```

## `type`
Package: `graphql-mocks`

```js
import { type } from 'graphql-mocks/highlight';
```

One or more GraphQL Named Types can be highlighted on the schema by specifying the typename(s). Named GraphQL Types include more than just `GraphQLObjectType` specified by the `type` keyword, it also includes named types specified by `interface`, `union`, `enum` declarations.

Note: This does not include highlighting the fields of a type, that is covered by the `field` highlighter.

### Highlight a Named GraphQL Type

```js
hi(graphqlSchema).include(
  type('Query', 'Mutation', 'User')
);
```

### Highlight All Named Types

Highlight all named types can be done by either calling the highlighter with no arguments, or by calling it with the `HIGHLIGHT_ALL` constant.


```js
import { HIGHLIGHT_ALL } from 'graphql-mocks/highlight';

hi(graphqlSchema).include(
  // calling with no arguments
  type(),

  // using the HIGHLIGHT_ALL constant
  type(HIGHLIGHT_ALL)
);
```

## `combine`
Package: `graphql-mocks`

```js
import { combine } from 'graphql-mocks/highlight';
```

When using `filter` on a `Highlight` instance it is sometimes useful to be able to combine the sets of multiple highlighters into a single set, and this is what the `combine` highlighter does.

```js
import { union, interfaces } from 'graphql-mocks';

hi(graphqlSchema).filter(
  combine(union(), interfaces())
);
```

In this example a combine highlighted set of all unions and interfaces are highlighted.

## `fromResolverMap`
Package: `graphql-mocks`

```js
import { fromResolverMap } from 'graphql-mocks/highlight';
```

Given a Resolver Map, which may have an incomplete set of resolvers for the schema, this highlighter will provide highlights for the types and fields that are covered by the resolver map.

```js
const resolverMap = {
  Query: {
    person: queryPersonResolver,
  },

  Person: {
    name: personNameResolver,
  },
};

hi(graphqlSchema).include(
  combine(fromResolverMap(resolverMap));
);
```

Assuming that `Query.person` and `Person.name` were valid entries on the GraphQL Schema, the references highlighted would be:

```js
[
  'Query',
  ['Query', 'person'],
  'Person',
  ['Person', 'name'],
]
```

## `interfaces`
Package: `graphql-mocks`

```js
import { interfaces } from 'graphql-mocks/highlight';
```

This highlighter highlights interfaces on the GraphQL Schema.

### Highlight Specific Interfaces

Specific interfaces can be highlighted by specifying their name.

```js
hi(graphqlSchema).include(
  interfaces('Purchasable', 'Commentable')
);
```

### Highlight All Interfaces

This can be done by either calling the highlighter with no arguments, or by providing the `HIGHLIGHT_ALL` constant.

```js
import { HIGHLIGHT_ALL } from 'graphql-mocks/highlight';
hi(graphqlSchema).include(
  // by specifying no arguments, all interfaces are highlighted
  interfaces(),
  // alternatively, the HIGHLIGHT_ALL will explicitly
  // highlight all interfaces also
  interfaces(HIGHLIGHT_ALL)
);
```

## `interfaceField`
Package: `graphql-mocks`

```js
import { interfaceField } from 'graphql-mocks/highlight';
```

This highlighter highlights interfaces *with their fields* on the GraphQL Schema.

**Note:** This is different than the `interfaces` highlighter which highlights the interface type name only.

By default all interfaces with their fields will be highlighted when no arguments passed in:

```js
hi(graphqlSchema).include(
  interfaceField()
);
```

Specific interfaces with fields can be highlighted:

```js
hi(graphqlSchema).include(
  interfaceField(['Purchasable', 'cost'], ['Commentable', 'comment'])
);
```

### Highlight All
`interfaceField` supports the same options for wildcard highlighting all as the [`field` highligher](/docs/highlight/available-highlighters#wildcard-highlighting).


## `union`
Package: `graphql-mocks`

```js
import { union } from 'graphql-mocks/highlight';
```

### Highlight Specific Unions

Specific unions can be highlighted by specifying their name.

```js
hi(graphqlSchema).include(
  union('SearchResult', 'Product')
);
```

### Highlight All Unions

This can be done by either calling the highlighter with no arguments, or by providing the `HIGHLIGHT_ALL` constant.

```js
import { HIGHLIGHT_ALL } from 'graphql-mocks/highlight';

hi(graphqlSchema).include(
  // by specifying no arguments, all unions are highlighted
  union(),

  // alternatively, the HIGHLIGHT_ALL will explicitly
  // highlight all union also
  union(HIGHLIGHT_ALL)
);
```

## `reference`
Package: `graphql-mocks`

```js
import { reference } from 'graphql-mocks/highlight';
```

While the underlying result of highlights are References, this allows raw References to be highlighted also with the `reference` highlighter. One or more Field References or Type References, or a combination, can be provided.

```js
hi(graphqlSchema).include(
  reference('Query', ['Mutation', 'addUser'])
);
```

## `resolvesTo`
Package: `graphql-mocks`

```js
import { resolvesTo } from 'graphql-mocks/highlight';
```

Sometimes it's handy to highlight based on what a field returns. This highlighter makes this easy by specifying the return in the GraphQL Schema Definition Language and highlighting the Field Resolvers that match.

With the given GraphQL Schema:

```graphql
schema {
  query: Query
}

type Query {
  loggedInUser: User!
  allUsers: [User!]!
}

type User {
  firstName: String!
  lastName: String
}
```

And using `resolvesTo`:

```js
hi(graphqlSchema).include(
  resolvesTo('String!', 'User!')
);
```

The highlighted references would be:
```js
[
  ['User', 'firstName'], // the field returns a "String!"
  ['Query', 'loggedInUser'] // the field returns a "User!"
]
```

Note: The matching is strict, in this example, a non-null `User!` will not match a nullable `User`, both would have to be explicitly specified `resolvesTo('User', 'User!')`
