---
id: faker
title: Mocking with Faker.js
---

Faker is a popular javascript library that provides mocking functions for a variety of types of data across different domains. Using the faker middleware with graphql-mocks makes it easy to get a fully mocked GraphQL API quickly. This is useful when some data should be mocked concretely, but the other fields can be generated.

The middleware includes support for:
* choosing random GraphQL enum values
* finding an appropriate faker function for a field (ie: a `firstName` field would use the appropriate faker function)
* randomly including `null` values for nullable fields
* specifying the faker fn to be used for a field
* specifying ranges of results used for lists
* applying handling to specific resolvers using `highlight`

### API Documentation
* [@graphql-mocks/faker](pathname:///api/faker/)

## Installation

Install `@graphql-mocks/faker` and `faker` (and the main `graphql-mocks` package if not already installed).

```bash
# npm
npm install --save-dev faker @graphql-mocks/faker graphql-mocks

# yarn
yarn add --dev miragejs faker @graphql-mocks/faker graphql-mocks
```

## Usage

Call `fakerMiddleware` and pass the result to the `middlewares` option on the graphql-mocks `GraphQLHandler` and the entire resolver map will be mocked and is ready for querying. To apply resolvers only to specific parts of the GraphQL Schema use the `highlight` option ([details below](/docs/guides/faker#highlight-specific-resolvers-to-include)).

```js
import { GraphQLHandler } from 'graphql-mocks';
import { fakerMiddleware } from '@graphql-mocks/faker';

const handler = new GraphQLHandler({
  middlewares: [fakerMiddleware()],
  dependencies: {
      graphqlSchema,
  },
});
```

## Middleware options

For finer control of faker the middlware can be configured with an options objects, see the following sections for more information on each option.

```js
fakerMiddleware({
  replace: true,
  highlight: (h) => h.include(['Person', 'name']);

  fields: {
    type: {
      field: {
        fakerFn: 'address.city',
        possibleValues: [],
      }
    }
  }
})
```

### Use a specific faker function per field
Faker functions are denoted by the API category and the API function separated by a `.`. See the [faker documentation](https://github.com/marak/Faker.js/#api-methods) for a list of options.

If the `highlight` option is also specified, make sure the highlight includes the specified type and field names so that the faker function is included.

```graphql
type Person {
  favoriteCity: String!
}
```

To specify the `Person.favoriteCity` to use the `address.city` faker function:

```js
fakerMiddlware({
  fields: {
    Person: {
      favoriteCity: {
        fakerFn: 'address.city'
      }
    }
  }
})
```

### Specifying possible values per field

```graphql
type Person {
  name: String!
}
```

Specify the possible values for `Person.name` and one will be selected at random. If the `highlight` option is also specified, make sure the highlight includes the specified type and field names that the `possibleValues` are specified for.

```js
fakerMiddlware({
  fields: {
    Person: {
      name: {
        possibleValues: ['Lisa', 'Marge', 'Maggie', 'Bart', 'Homer']
      }
    }
  }
})
```

### Specify chance of null values for nullable fields
* Default: `0.1` (10%)

The chance a nullable field is null, or that a list contains null, can be controlled by the `nullPercentage` and `nullListPercentage` options respectively. These can be specified globally for all fields and for a specific field.

Globally, for all fields:

```js
fakerMiddlware({
  nullPercentage: 0.5,
  nullListPercentage: 0.7
})
```

For a specific field, in this case the null probability for `Person.name`:

```js
fakerMiddlware({
  fields: {
    Person: {
      name: {
        nullPercentage: 0.5,
        nullListPercentage: 0.7
      }
    }
  }
})
```

### Specifying the range of items in a list
* Default: min: 0, max: 10

A list can be configured to have a min/max range.

This can be specified globally:
```js
fakerMiddlware({
  listCount: { min: 2, max: 20 }
})
```

or for a specific field, in this case for the list of pets on `Person.pets`:

```graphql
type Person {
  pets: [Pet!]!
}
```

```js
fakerMiddlware({
  fields: {
    Person: {
      pets: {
        listCount: { min: 2, max: 20 }
      }
    }
  }
})
```

### Replace existing resolver functions

* Default: `false`

If there is a need to replace existing resolver functions in the resolver map with faker functions then pass `true` for the `replace` option.

```js
fakerMiddlware({
  replace: true
})
```


### Highlight specific resolvers to include

* Default: Resolver functions for the entire schema are included (and only replaces existing resolver based on the `replace` option which defaults to `false`).

The `highlight` option controls which parts of Resolver Map are modified by the faker middleware. This is a common pattern for graphql-mocks middlewares, see the [`highlight` option documentation](/docs/highlight/introducing-highlight#highlight-middleware-option) for more information.
