# CHANGELOG

## graphql-mocks

### graphql-mocks@0.11.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### graphql-mocks@0.10.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### graphql-mocks@0.9.2

#### Add custom scalar support ([#221](https://github.com/graphql-mocks/graphql-mocks/pull/221))

* (feature) Add support for custom scalars

### graphql-mocks@0.9.0

#### Fix falso middleware handling of abstract types (interfaces and unions) ([#219](https://github.com/graphql-mocks/graphql-mocks/pull/219))

* (feature) Add a new `interfaceField` highlighter for highlighting interfaces with fields. This is different from the `interfaces`  highlighter which returns only the interfaces typenames themselves (for type resolvers). See highlighter documentation for more information.

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

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

* (fix) To support graphql version 16 typescript types the result return from a `GraphQLHandler#query` has been updated. It now supports a type argument to specify the result otherwise it defaults to `any` (`handler.query<CustomExecutionResultType>(\`query {}\`))

### graphql-mocks@0.8.1

#### Add applyMiddlewares to the GraphQLHandler ([#96](https://github.com/graphql-mocks/graphql-mocks/pull/96))

* (feature) Add `applyMiddlewares` method to `GraphQLHandler`

## graphql-paper

### graphql-paper@0.4.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### graphql-paper@0.3.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### graphql-paper@0.2.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

#### feat: add `clear` method to graphql-paper ([#207](https://github.com/graphql-mocks/graphql-mocks/pull/207))

* (feature) Add `clear` method for purging all documents and resetting history

### graphql-paper@0.1.6

#### Migrate from lodash to ramda ([#172](https://github.com/graphql-mocks/graphql-mocks/pull/172))

* (fix) Replace individual `lodash.*` packages with singular `ramda`

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README


## gqlmocks

### gqlmocks@0.5.0

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20

### gqlmocks@0.3.2

#### Fix gqlmocks cli dynamic handling of typescript files ([#231](https://github.com/graphql-mocks/graphql-mocks/pull/231))

* (fix) Fixed typescript support within the cli where `require` is used on a `.ts` file

### gqlmocks@0.3.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Improve cli `serve` command flags ([#215](https://github.com/graphql-mocks/graphql-mocks/pull/215))

* (fix) Make `serve` command work with either `--handler` or `--schema` flag instead of both being required
* (fix) Allow false middleware via `--fake` on serve command to be applied to a handler specified by path

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

#### set cors for cli app ([#211](https://github.com/graphql-mocks/graphql-mocks/pull/211))

* (fix) Fix CORS-error in the gqlmocks cli #205.

### gqlmocks@0.2.0

#### Fix falso middleware handling of abstract types (interfaces and unions) ([#219](https://github.com/graphql-mocks/graphql-mocks/pull/219))

* (fix) Fix falso middleware handling around automatic faking with unions and interfaces

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

### @graphql-mocks/mirage@0.9.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### @graphql-mocks/mirage@0.8.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/mirage@0.7.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/mirage@0.6.0

#### Migrate from lodash to ramda ([#172](https://github.com/graphql-mocks/graphql-mocks/pull/172))

* (fix) Replace individual `lodash.*` packages with singular `ramda`

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

### @graphql-mocks/mirage@0.5.0

#### 🚀 Add gqlmocks cli ([#95](https://github.com/graphql-mocks/graphql-mocks/pull/95))

* (breaking) Due to the changes in typescript types for the core `graphql-mocks` package it might be required to bump the version of `graphql-mocks` used with `@graphql-mocks/mirage` to accommodate the newer typescript types.

## @graphql-mocks/falso

### @graphql-mocks/falso@0.7.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### @graphql-mocks/falso@0.6.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/falso@0.5.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/falso@0.4.0

#### Migrate from faker to falso ([#177](https://github.com/graphql-mocks/graphql-mocks/pull/177))

* (feature) Introducing `@graphql-mocks/falso`, replacing @graphql-mocks/faker, as the package to provide fake data across an entire schema. [Falso](https://github.com/ngneat/falso) benefits from being esmodule-first and being actively developed and supported.

## @graphql-mocks/network-express

### @graphql-mocks/network-express@0.4.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20

### @graphql-mocks/network-express@0.3.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/network-express@0.2.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/network-express@0.1.4

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-msw

### @graphql-mocks/network-msw@0.4.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Bumped to `msw` minimum requirement of `2.0.0`

### @graphql-mocks/network-msw@0.3.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/network-msw@0.2.0

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/network-msw@0.1.4

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-nock

### @graphql-mocks/network-nock@0.6.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### @graphql-mocks/network-nock@0.5.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/network-nock@0.4.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/network-nock@0.3.3

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-pretender

### @graphql-mocks/network-pretender@0.4.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20

### @graphql-mocks/network-pretender@0.3.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/network-pretender@0.2.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/network-pretender@0.1.0

#### Add pretender network handler (@graphql-mocks/network-pretender) ([#181](https://github.com/graphql-mocks/graphql-mocks/pull/181))

* (feature) Introducing `@graphql-mocks/network-pretender`, a new browser network handler using pretender.js

## @graphql-mocks/sinon

### @graphql-mocks/sinon@0.5.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20
* (breaking) Requires peer dependency graphql >= 16

### @graphql-mocks/sinon@0.4.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/sinon@0.3.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/sinon@0.2.3

#### Update READMEs and package documentation ([#170](https://github.com/graphql-mocks/graphql-mocks/pull/170))

* (feature) Added package README

## @graphql-mocks/network-cypress

### @graphql-mocks/network-cypress@0.4.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20

### @graphql-mocks/network-cypress@0.3.0

#### Add package.json export maps ([#234](https://github.com/graphql-mocks/graphql-mocks/pull/234))

* (breaking) Add export map to package.json, existing imports might need to be updated to use nearest index from export map.

### @graphql-mocks/network-cypress@0.2.0

#### Bump to node 16 ([#218](https://github.com/graphql-mocks/graphql-mocks/pull/218))

* (breaking) Bump from Node 14 to 16

#### Bump node from version 12 to 14 ([#214](https://github.com/graphql-mocks/graphql-mocks/pull/214))

* (breaking) Change node version minimum to Node 14

### @graphql-mocks/network-cypress@0.1.0

#### feat: add `@graphql-mocks/network-cypress` package ([#196](https://github.com/graphql-mocks/graphql-mocks/pull/196))

* (feature) Introducing `@graphql-mocks/network-cypress`, a new network handler for cypress

## @graphql-mocks/network-playwright

### @graphql-mocks/network-playwright@0.2.0

#### Fix esm imports for node ([#255](https://github.com/graphql-mocks/graphql-mocks/pull/255))

* (fix) Fix es module imports for node

#### 🧹 Housekeeping: switch to pnpm, bump node, root dependencies and supported graphql version ([#250](https://github.com/graphql-mocks/graphql-mocks/pull/250))

* (breaking) Requires node >= 20

### @graphql-mocks/network-playwright@0.1.1

#### Implement network handler for Playwright ([#242](https://github.com/graphql-mocks/graphql-mocks/pull/242))

* (feature) New package for Playwright network handler