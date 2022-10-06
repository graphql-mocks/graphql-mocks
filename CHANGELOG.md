# CHANGELOG

## graphql-mocks

### graphql-mocks@0.8.4

#### Add debugger wrapper ([#179](https://github.com/graphql-mocks/graphql-mocks/pull/179))

* (feature) Add a debugger wrapper that adds debuggers before and/or after resolver execution

#### Add latency wrapper ([#175](https://github.com/graphql-mocks/graphql-mocks/pull/175))

* (feature) Added latency wrapper for delaying resolvers with specified latency

#### Migrate from lodash to ramda ([#172](https://github.com/graphql-mocks/graphql-mocks/pull/172))

* (fix) Replace individual `lodash.*` packages with singular `ramda`

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

### graphql-mocks@0.8.3

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (fix) To support graphql version 16 typescript types the result return from a `GraphQLHandler#query` has been updated. It now supports a type argument to specify the result otherwise it defaults to `any` (`handler.query<CustomExecutionResultType>(`query {}`))

### graphql-mocks@0.8.1

#### Add applyMiddlewares to the GraphQLHandler ([#96](https://github.com/graphql-mocks/graphql-mocks/pull/96))

* (feature) Add `applyMiddlewares` method to `GraphQLHandler`

## graphql-paper

### graphql-paper@0.1.6

#### Migrate from lodash to ramda ([#172](https://github.com/graphql-mocks/graphql-mocks/pull/172))

* (fix) Replace individual `lodash.*` packages with singular `ramda`

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README


## gqlmocks

### gqlmocks@0.2.0

#### Migrate from faker to falso ([#177](https://github.com/graphql-mocks/graphql-mocks/pull/177))

* (breaking) Changed `--faker` flag to `--fake` on the `gqlmocks serve` command to avoid confusion with the library being used for faking.

### gqlmocks@0.1.0

#### Add oclif dependency for the cli ([#160](https://github.com/graphql-mocks/graphql-mocks/pull/160))

* (fix) include `oclif` dependency for buildings

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (feature) The initial beta release for the `gqlmocks` cli
* (feature) Run a local mocking server via `serve` command
* (feature) Create, validate and get info on graphql schemas and handlers

## @graphql-mocks/faker

### DEPRECATED

#### Migrate from faker to falso ([#177](https://github.com/graphql-mocks/graphql-mocks/pull/177))

* (breaking) Deprecating the entire package in favour of `@graphql-mocks/falso`. This replaces faker.js with [falso](https://github.com/ngneat/falso).

### @graphql-mocks/faker@0.3.0

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (breaking) Due to the changes in typescript types for the core `graphql-mocks` package it might be required to bump the version of `graphql-mocks` used with `@graphql-mocks/faker` to accommodate the newer typescript types.

## @graphql-mocks/mirage

### @graphql-mocks/mirage@0.6.0

#### Migrate from lodash to ramda ([#172](https://github.com/graphql-mocks/graphql-mocks/pull/172))

* (fix) Replace individual `lodash.*` packages with singular `ramda`

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

### @graphql-mocks/mirage@0.5.0

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (breaking) Due to the changes in typescript types for the core `graphql-mocks` package it might be required to bump the version of `graphql-mocks` used with `@graphql-mocks/mirage` to accommodate the newer typescript types.

## @graphql-mocks/falso

### @graphql-mocks/falso@0.4.0

#### Migrate from faker to falso ([#177](https://github.com/graphql-mocks/graphql-mocks/pull/177))

* (feature) Introducing `@graphql-mocks/falso`, replacing @graphql-mocks/faker, as the package to provide fake data across an entire schema. [Falso](https://github.com/ngneat/falso) benefits from being esmodule-first and being actively developed and supported.

## @graphql-mocks/network-express

### @graphql-mocks/network-express@0.1.4

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-msw

### @graphql-mocks/network-msw@0.1.4

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-nock

### @graphql-mocks/network-nock@0.3.3

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-pretender

### @graphql-mocks/network-pretender@0.1.0

#### Add pretender network handler (@graphql-mocks/network-pretender) ([#181](https://github.com/graphql-mocks/graphql-mocks/pull/181))

* (feature) Introducing `@graphql-mocks/network-pretender`, a new browser network handler using pretender.js

## @graphql-mocks/sinon

### @graphql-mocks/sinon@0.2.3

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-cypress

### @graphql-mocks/network-cypress@0.1.0

#### feat: add `@graphql-mocks/network-cypress` package ([#196](https://github.com/graphql-mocks/graphql-mocks/pull/196))

* (feature) Introducing `@graphql-mocks/network-cypress`, a new network handler for cypress