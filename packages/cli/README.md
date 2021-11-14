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
$ gqlmocks (-v|--version|version)
gqlmocks/0.0.0 darwin-arm64 node-v12.22.1
$ gqlmocks --help [COMMAND]
USAGE
  $ gqlmocks COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gqlmocks config:validate [FILE]`](#gqlmocks-configvalidate-file)
* [`gqlmocks help [COMMAND]`](#gqlmocks-help-command)
* [`gqlmocks serve`](#gqlmocks-serve)

## `gqlmocks config:validate [FILE]`

describe the command here

```
USAGE
  $ gqlmocks config:validate [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/config/validate.ts](https://github.com/chadian/gqlmocks/blob/v0.0.0/src/commands/config/validate.ts)_

## `gqlmocks help [COMMAND]`

display help for gqlmocks

```
USAGE
  $ gqlmocks help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `gqlmocks serve`

Run a local graphql server

```
USAGE
  $ gqlmocks serve

OPTIONS
  --faker            use faker middlware for resolver fallbacks
  --handler=handler  path to file with graphql handler (via default export)
  --header=header    specify header(s) used in request for remote schema specified by schema flag
  --port=port        [default: 8080]

  --schema=schema    (required) local (relative or absolute) path to graphql schema, remote url (graphql schema file or
                     graphql api endpoint)

  --watch

EXAMPLES
  $ gqlmocks serve --schema ../schema.graphql
  $ gqlmocks serve --schema ../schema.graphql --handler ../handler.ts
  $ gqlmocks serve --schema http://s3-bucket/schema.graphql --faker
  $ gqlmocks serve --schema http://graphql-api/ --faker
  $ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token --faker"
```

_See code: [src/commands/serve.ts](https://github.com/chadian/gqlmocks/blob/v0.0.0/src/commands/serve.ts)_
<!-- commandsstop -->
