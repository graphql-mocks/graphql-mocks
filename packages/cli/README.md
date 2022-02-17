gqlmocks
========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gqlmocks.svg)](https://npmjs.org/package/gqlmocks)
[![Downloads/week](https://img.shields.io/npm/dw/gqlmocks.svg)](https://npmjs.org/package/gqlmocks)
[![License](https://img.shields.io/npm/l/gqlmocks.svg)](https://github.com/chadian/gqlmocks/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gqlmocks
$ gqlmocks COMMAND
running command...
$ gqlmocks (--version)
gqlmocks/0.0.0 darwin-x64 node-v14.18.0
$ gqlmocks --help [COMMAND]
USAGE
  $ gqlmocks COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gqlmocks config generate`](#gqlmocks-config-generate)
* [`gqlmocks config info`](#gqlmocks-config-info)
* [`gqlmocks config validate`](#gqlmocks-config-validate)
* [`gqlmocks handler generate`](#gqlmocks-handler-generate)
* [`gqlmocks handler info`](#gqlmocks-handler-info)
* [`gqlmocks help [COMMAND]`](#gqlmocks-help-command)
* [`gqlmocks schema fetch`](#gqlmocks-schema-fetch)
* [`gqlmocks schema info`](#gqlmocks-schema-info)
* [`gqlmocks schema validate`](#gqlmocks-schema-validate)
* [`gqlmocks serve`](#gqlmocks-serve)
* [`gqlmocks version`](#gqlmocks-version)

## `gqlmocks config generate`

Generate a basic gqlmocks config file

```
USAGE
  $ gqlmocks config generate [--out <value>] [--format ts|js|json] [--schema.path <value>] [--schema.format
    SDL|SDL_STRING] [--handler.path <value>] [--force]

FLAGS
  --force                   overwrite config if one exists
  --format=<option>         specify the output format of the gqlmocks config
                            <options: ts|js|json>
  --handler.path=<value>
  --out=<value>             path to write generated config to
  --schema.format=<option>  <options: SDL|SDL_STRING>
  --schema.path=<value>     path to GraphQL schema

DESCRIPTION
  Generate a basic gqlmocks config file

  See more config options at www.graphql-mocks.com/docs/cli
```

## `gqlmocks config info`

display info about a gqlmocks config file

```
USAGE
  $ gqlmocks config info [-c <value>]

FLAGS
  -c, --config=<value>

DESCRIPTION
  display info about a gqlmocks config file
```

## `gqlmocks config validate`

Validate gqlmocks.config.js

```
USAGE
  $ gqlmocks config validate [-f <value>]

FLAGS
  -f, --file=<value>

DESCRIPTION
  Validate gqlmocks.config.js
```

## `gqlmocks handler generate`

Generate a GraphQLHandler

```
USAGE
  $ gqlmocks handler generate [--out <value>] [--force] [--format ts|js]

FLAGS
  --force            overwrite config if one exists
  --format=<option>  specify the file format of the created handler file
                     <options: ts|js>
  --out=<value>      path to write generated config to

DESCRIPTION
  Generate a GraphQLHandler
```

## `gqlmocks handler info`

display info about a GraphQL schema

```
USAGE
  $ gqlmocks handler info [--handler-file <value>]

FLAGS
  --handler-file=<value>

DESCRIPTION
  display info about a GraphQL schema
```

## `gqlmocks help [COMMAND]`

Display help for gqlmocks.

```
USAGE
  $ gqlmocks help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gqlmocks.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.11/src/commands/help.ts)_

## `gqlmocks schema fetch`

Fetch and save a GraphQL Schema

```
USAGE
  $ gqlmocks schema fetch [--save-schema-file <value>] [--force] [--format SDL|SDL_STRING] [--header <value>
    --source <value>]

FLAGS
  --force
  --format=<option>           [default: SDL]
                              <options: SDL|SDL_STRING>
  --header=<value>...         specify header(s) used in request for remote schema specified by schema flag
  --save-schema-file=<value>  path of file to save schema to
  --source=<value>            Url of GraphQL API server or url of remote .graphql file

DESCRIPTION
  Fetch and save a GraphQL Schema
```

## `gqlmocks schema info`

display info about a GraphQL schema

```
USAGE
  $ gqlmocks schema info [--schema-file <value>]

FLAGS
  --schema-file=<value>

DESCRIPTION
  display info about a GraphQL schema
```

## `gqlmocks schema validate`

display info about a gqlmocks config file

```
USAGE
  $ gqlmocks schema validate [--schema-file <value>]

FLAGS
  --schema-file=<value>

DESCRIPTION
  display info about a gqlmocks config file
```

## `gqlmocks serve`

Run a local graphql server

```
USAGE
  $ gqlmocks serve [--faker] [--handler <value>] [--port <value>] [--header <value> --schema <value>]
    [--watch]

FLAGS
  --faker              use faker middlware for resolver fallbacks
  --handler=<value>    path to file with graphql handler (via default export)
  --header=<value>...  specify header(s) used in request for remote schema specified by schema flag
  --port=<value>       [default: 4444]
  --schema=<value>     local (relative or absolute) path to graphql schema, remote url (graphql schema file or graphql
                       api endpoint)
  --watch

DESCRIPTION
  Run a local graphql server

EXAMPLES
  $ gqlmocks serve --schema ../schema.graphql

  $ gqlmocks serve --schema ../schema.graphql --handler ../handler.ts

  $ gqlmocks serve --schema http://s3-bucket/schema.graphql --faker

  $ gqlmocks serve --schema http://graphql-api/ --faker

  $ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token" --faker
```

_See code: [src/commands/serve.ts](https://github.com/chadian/gqlmocks/blob/v0.0.0/src/commands/serve.ts)_

## `gqlmocks version`

```
USAGE
  $ gqlmocks version
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.0.4/src/commands/version.ts)_
<!-- commandsstop -->
