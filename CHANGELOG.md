# CHANGELOG

## graphql-mocks

### graphql-mocks@0.8.3

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (fix) To support graphql version 16 typescript types the result return from a `GraphQLHandler#query` has been updated. It now supports a type argument to specify the result otherwise it defaults to `any` (`handler.query<CustomExecutionResultType>(`query {}`))

### graphql-mocks@0.8.1

#### Add applyMiddlewares to the GraphQLHandler ([#96](https://github.com/graphql-mocks/graphql-mocks/pull/96))

* (feature) Add `applyMiddlewares` method to `GraphQLHandler`

## graphql-paper


## gqlmocks

### gqlmocks@0.1.0

#### Add oclif dependency for the cli ([#160](https://github.com/graphql-mocks/graphql-mocks/pull/160))

* (fix) include `oclif` dependency for buildings

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (feature) The initial beta release for the `gqlmocks` cli
* (feature) Run a local mocking server via `serve` command
* (feature) Create, validate and get info on graphql schemas and handlers

## @graphql-mocks/faker

### @graphql-mocks/faker@0.3.0

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (breaking) Due to the changes in typescript types for the core `graphql-mocks` package it might be required to bump the version of `graphql-mocks` used with `@graphql-mocks/faker` to accommodate the newer typescript types.

## @graphql-mocks/mirage

### @graphql-mocks/mirage@0.5.0

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (breaking) Due to the changes in typescript types for the core `graphql-mocks` package it might be required to bump the version of `graphql-mocks` used with `@graphql-mocks/mirage` to accommodate the newer typescript types.