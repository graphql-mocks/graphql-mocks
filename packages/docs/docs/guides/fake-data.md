---
id: fake-data
title: Automatic Mocking with Fake Data using Falso
---

[Falso](https://github.com/ngneat/falso) is a popular javascript library that provides mocking functions for a variety of types of data across different domains. Using the Falso middleware with graphql-mocks makes it easy to get a fully mocked GraphQL API quickly. This is useful when some data should be mocked concretely, but the other fields can be generated.

This middleware was adapted from the Faker.js middleware (`@graphql-mocks/faker`) which has since been deprecated. Since Faker.js is no longer maintained and Falso is a modern esmodule-first alternative Falso is being used instead. If previously using the Faker.js middleware see [Migrating from the Faker Middleware](/docs/guides/fake-data#migrating-from-fakerjs-to-the-falso-middleware) section below.

The middleware includes support for:
* choosing random GraphQL enum values
* finding an appropriate Falso function for a field (ie: a `firstName` field would use the appropriate Falso function (`randFirstName`))
* randomly including `null` values for nullable fields
* specifying the Falso fn to be used for a field
* specifying ranges of results used for lists
* applying handling to specific resolvers using `highlight`

### API Documentation
* [@graphql-mocks/falso](pathname:///api/falso/)

## Installation

Install `@graphql-mocks/falso` and `@ngneat/falso` (and the main `graphql-mocks` package if not already installed).

```bash
# npm
npm install --save-dev @ngneat/falso @graphql-mocks/falso graphql-mocks

# yarn
yarn add --dev @ngneat/falso @graphql-mocks/falso graphql-mocks
```

## Usage

Call `falsoMiddleware` and pass the result to the `middlewares` option on the graphql-mocks `GraphQLHandler` and the entire resolver map will be mocked and is ready for querying. To apply resolvers only to specific parts of the GraphQL Schema use the `highlight` option ([details below](/docs/guides/fake-data#highlight-specific-resolvers-to-include)).

```js
import { GraphQLHandler } from 'graphql-mocks';
import { falsoMiddleware } from '@graphql-mocks/falso';

const handler = new GraphQLHandler({
  middlewares: [falsoMiddleware()],
  dependencies: {
      graphqlSchema,
  },
});
```

## Middleware options

For finer control of Falso the middleware can be configured with an options objects, see the following sections for more information on each option.

```js
falsoMiddleware({
  replace: true,
  highlight: (h) => h.include(['Person', 'name']);

  fields: {
    type: {
      field: {
        falsoFn: 'address.city',
        possibleValues: [],
      }
    }
  }
})
```

### Use a specific Falso function per field
Available functions are listed in the [Falso documentation](https://ngneat.github.io/falso/docs/getting-started).

If the `highlight` option is also specified, make sure the highlight includes the specified type and field names so that the Falso function is included.

```graphql
type Person {
  favoriteCity: String!
}
```

To specify the `Person.favoriteCity` to use the `randCity` falso function:

```js
falsoMiddleware({
  fields: {
    Person: {
      favoriteCity: {
        falsoFn: 'randCity'
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
falsoMiddleware({
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
falsoMiddleware({
  nullPercentage: 0.5,
  nullListPercentage: 0.7
})
```

For a specific field, in this case the null probability for `Person.name`:

```js
falsoMiddleware({
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
falsoMiddleware({
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
falsoMiddleware({
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

If there is a need to replace existing resolver functions in the resolver map with falso functions then pass `true` for the `replace` option.

```js
falsoMiddleware({
  replace: true
})
```

### Highlight specific resolvers to include

* Default: Resolver functions for the entire schema are included (and only replaces existing resolver based on the `replace` option which defaults to `false`).

The `highlight` option controls which parts of Resolver Map are modified by the falso middleware. This is a common pattern for graphql-mocks middlewares, see the [`highlight` option documentation](/docs/highlight/introducing-highlight#highlight-middleware-option) for more information.

## Migrating from Faker.js to the Falso Middleware

Faker.js is no longer maintained and Falso is a modern alternative. If faker and `@graphql-mocks/faker` were previously being used then migrating to `@graphql-mocks/falso` should be relatively quick.

1. Remove `faker` and `@graphql-mocks/faker`

```shell
#npm
npm remove faker @graphql-mocks/faker

# yarn
yarn remove faker @graphql-mocks/faker
```

2. Install Falso and `@graphql-mocks/falso`

```shell
#npm
npm install --save-dev @ngneat/falso @graphql-mocks/falso

# yarn
yarn add --dev @ngneat/falso @graphql-mocks/falso
```

3. Update require/imports

ES Modules:
```js
// from
import { fakerMiddleware } from '@graphql-mocks/faker';

// to
import { falsoMiddleware } from '@graphql-mocks/falso';
```

CommonJS Modules:
```js
// from
const { fakerMiddleware } = require('@graphql-mocks/faker');

// to
const { falsoMiddleware } = require('@graphql-mocks/falso');
```

4. Update Middleware Options

Update `fakerFn` options to `falsoFn` and the corresponding function to the Falso equivalent

```js
// from
fakerMiddleware({
  fields: {
    Person: {
      favoriteCity: {
        fakerFn: 'address.city'
      }
    }
  }
}

// to
falsoMiddleware({
  fields: {
    Person: {
      favoriteCity: {
        // `fakerFn` -> `falsoFn`
        // `address.city` from Faker -> `randCity` from Falso
        falsoFn: 'randCity'
      }
    }
  }
}
```
