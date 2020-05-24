---
id: api-quick-start
title: Quick Start
---

The API docs are generated from TypeScript definitions using `typedoc`. It
outputs two sections `modules` and `classes`. To understand how these are used
in practice check out the other portions of the documentation.

## `modules`

The
modules section of the API documentation covers the topography of the package and should be
useful in understanding its contents. The public exports of the package can be
found in the `index` modules.

### `graphql`

Contains the modules relevant to dealing with high-level `graphql` concepts,
including being able to create a graphql handler.

### `log`

Provides a Resolver Wrapper for being able to wrap resolvers and log the
resolver arguments and result.

### `performance`

Provides a Resolver Wrapper for timing the execution of executing a resolver.

### `mirage`

The `mirage` module includes mirage resolvers capable of resolving
different GraphQL types in the context of mirage, a mapper for being explicit
about mirages <-> graphql mapping and the Resolver Map Middlewares necessary to
combine everything together.

### `relay`

The `relay/helpers` module provides useful helpers in creating Relay Pagination
based on the specification.

### `resolver`

Code that is fundamental to dealing with resolvers can be found in this module.
The most important pieces here are re-exported through the top-level package.

### `resolver-map`

This module includes important fundamental operations involving Resolver Maps,
including Middlewares, like the `resolver` module anything that is important
will be re-exported through the top-level package.

### `spy`

This contains the spy Resolver Wrapper to be able to add sinon spies to your
resolvers. This is valuable during tests where you may want to assert that a
resolver was called, maybe with certain arguments, and what the result was.

### `stash-state`

This is an **experimental** module that hides the payload of a parent on its
children using a javascript symbol. This could be useful if traversing ancestry
is important for a resolver.

### `types`

Many of the globally important types are declared here. Types local to a module
are exported when they may be useful.

### `utils`

Many reusable functions for dealing with Resolver Map and Resolver Wrappers, and
general functionality, are included in this module.

## `classes`

Any `class` definitions can be found in the `classes` section of documentation.