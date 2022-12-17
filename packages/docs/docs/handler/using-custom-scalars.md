---
id: custom-scalars
title: Using Custom Scalars
---

GraphQL comes with the following scalars: `Int`, `Float`, `String`, `Boolean` and `ID` (see [official documentation](https://graphql.org/learn/schema/#scalar-types) for more information). Outside of these GraphQL supports adding custom scalars.

Custom Scalars can be defined in your schema and then the implementation can be applied to the `GraphQLHandler` via a *Scalar Map*.

## Defining Custom Scalars

Custom scalars can be specified in your GraphQL Schema, for example adding a custom `JSON` scalar and then using it with the `arbitraryJSON` field on the `Query` type.

```graphql
# added to the schema!
scalar JSON

schema {
  query: Query
}

type Query {
  # used elsewhere in the schema
  arbitraryJSON: JSON!
}
```

## Providing the Scalar Implementation

This works for an initial definition but the actual parsing and serialization of the scalar has to be defined programatically. In GraphQL Mocks this is specified by passing a *Scalar Map* to the GraphQL Handler.

The keys for the scalar map are the name of the scalar and the value is either a `GraphQLScalarType` which can be imported from another library or by providing the required functions necessary for handling custom scalars.

This is an example of using a custom scalar imported from a package, in this case the JSON scalar from `graphql-type-json`.
```js
import GraphQLJSON from 'graphql-type-json';

const scalarMap = {
  JSON: GraphQLJSON
};
```

Alternatively, for a quick way of creating a custom scalar provide the `parseLiteral`, `parseValue`, and `serialize` functions (see Apollo documentation for [Custom Scalars](https://www.apollographql.com/docs/apollo-server/schema/custom-scalars) for details on defining these functions):
```js
const scalarMap = {
  JSON: {
    parseLiteral(outputValue) {
      // implementation
    },
    
    parseValue(inputValue) {
      // implementation
    },

    serialize(valueNode, variables) {
      // implementation
    }
  }
};
```

## Adding the Scalar Map to the `GraphQLHandler`

A custom scalar map is passed as one of the options to the `GraphQLHandler`:

```js
import { GraphQLHandler } from 'graphql-mocks';
import { graphqlSchema } from './schema';
import { scalarMap } from './scalar-map';

const handler = new GraphQLHandler({
  scalarMap,
  dependencies: {
    graphqlSchema
  }
});
```

Now the custom scalars can be used by the `GraphQLHandler` for any queries.
