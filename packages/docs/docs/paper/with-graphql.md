---
id: with-graphql
title: Using GraphQL Paper with GraphQL
---

GraphQL Paper is an in-memory store based on a provided a GraphQL Schema and has been designed to work seamlessly with GraphQL and its default resolvers. While it works and has been tested with `graphql-mocks` it will also work with all other javascript graphql system that use resolver functions including the core `graphql` javascript package.

The following examples will use `graphql-mocks` but can be modified to work with other examples using resolver functions.

## Example Schema

The following examples will use the example schema

```js
// schema.js
export default const graphqlSchema = `
  schema {
    query: Query
  }

  type Query {
    films: [Film!]!
    film(filmId: ID!): Film
  }

  type Film {
    id: ID!
    title: String!
    year: Int!
    actors: [Actor!]!
  }

  type Actor {
    id: ID!
    name: String!
  }
`;
```

## Using with Queries

To resolve queries, in a GraphQL Resolver return data from the `paper.data` property on a `Paper` instance.

GraphQL Paper also provides connections out of the box between different types and their corresponding documents which allows for the resolution of resolvers to work recursively. To kick off this behavior it's only required to return the appropriate Document or list of Documents from the top-level `Query` resolvers.

In this example returning the resolvers for a list of `[Film!]` from the `Query.films` or a single `Film` by ID from `Query.film` will also satisify any queries that request a film's `Actor`s by returning the `actors` connections on the `Film` document.

```js
import graphqlSchema from './schema';
import { Paper } from 'graphql-paper';
import { GraphQLHandler } from 'graphql-mocks';
import { extractDependencies } from 'graphql-mocks/resolver';

const paper = new Paper(graphqlSchema);

const resolverMap = {
  Query: {
    films(root, args, context, info) {
      // get access to the paper instance
      const { paper } = extractDependencies(context, ['paper']);
      // return all `Film` Documents
      return paper.data.Film;
    }

    film(root, { filmId }, context, info) {
      // get access to the paper instance
      const { paper } = extractDependencies(context, ['paper']);
      return paper.data.Film.find((film) => film.id === filmId) ?? null;
    }
  }
};

const handler = new GraphQLHandler({ dependencies: { paper, graphqlSchema }});

handler.query(`
  query {
    films {
      id
      title
      years

      # will return the connected Actor documents automatically
      actors {
        id
        name
      }
    }
  }
`);
```

