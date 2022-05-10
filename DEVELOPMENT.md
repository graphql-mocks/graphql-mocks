# Development

This document covers how to locally develop on the GraphQL Mocks.

## System Requirements

* [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node >= 12](https://nodejs.org/en/download/)
* [`yarn`](https://yarnpkg.com/)

## Repo Structure

This repo is managed as a lerna monorepo. The packages are in the [`packages`](https://github.com/graphql-mocks/graphql-mocks/tree/main/packages) folder. Note that the name of the package might not directly correspond to the package name seen in the package.json (see the [`packages list`](http://www.graphql-mocks.com/packages) for a concrete mapping).

## Getting Started

Clone the repo, then:

1. Run `yarn` to setup packages
2. Run `yarn bootstrap` to bootstrap package dependencies

⚠️ Note: Any time a new package is added via `yarn`, run `yarn link-packages` to re-establish symlinks between packages (see below).

## Monorepo Cross-Dependencies & Package Symlinking

Each package's cross-dependencies (that is a dependency on a package that is within the monorepo) are setup to be linked to the final built form of the cross-dependency. This is done by default with `yarn bootstrap` but can be re-established with `yarn link-packages` ran from the root of the monorepo. This is especially useful to get any updates to typescript typings as well as testing against a more "final version" of the package.

For example, the `@graphql-mocks/sinon` package has a cross-dependency on the core `graphql-mocks` package, and after running `yarn link-packages` a symlink wold be created at `packages/sinon/node_modules/graphql-mocks` pointing to `packages/graphql-mocks/dist`.

### Modifying Upsteam GraphQL Mock Packages

When making changes to multiple packages it's important to keep any upstream dependencies `dist` folders freshly compiled, or built, with those changes. To do this run `yarn watch` from the upstream cross-dependency which will monitor for any file changes and update `dist` with the latest changes.

Continuing the previous example where the `@graphql-mocks/sinon` package has a cross-dependency on the core `graphql-mocks` package. If a change was being made to `graphql-mocks` that should be tested or developed against a downstream dependency, like `@graphql-mocks/sinon`, then the following steps would help for local development:

1. Run `yarn watch` in the root folder for `graphql-mocks` (keeping its symlinked `dist` updated)
2. Make necessary changes to `graphql-mocks` or `@graphql-mocks/sinon`
3. Run tests on `@graphql-mocks/sinon` via `yarn --watch`

## Testing All Monorepo Packages Together

To test all the packages together, from the repo root:

1. Run `yarn bootstrap` (ensure fresh builds across all the packages)
2. Run `yarn test` (runs the test command in each package)
