---
id: introducing-gqlmocks
title: Introducing the gqlmocks cli
---

As developers we've come to enjoy quick assistance from the command line and graphql-mocks is no different.
The `gqlmocks` cli provides a handy way to get started with generating graphql-mocks boilerplate files (like a GraphQL Handler), quickly run a mock local server on `localhost`, and more.

## Installation

The easiest way to get started is to run `gqlmocks` via npx where it'll download, install, and run on demand.

```
npx gqlmocks --help
```

It can also be installed globally via npm or yarn.

```
# yarn
yarn global add gqlmocks

# npm
npm install -g gqlmocks

# then run via gqlmocks
gqlmocks --help
```

## Next Steps

* Sensible defaults can be used by the CLI with a `gqlmocks.config` file, learn how to set one up
* To get an overview of all the commands and their flags, take a look at the Command List documentation
