# Commands
<!-- commands -->
* [`gqlmocks config generate`](#gqlmocks-config-generate)
* [`gqlmocks config info`](#gqlmocks-config-info)
* [`gqlmocks config validate`](#gqlmocks-config-validate)
* [`gqlmocks handler generate`](#gqlmocks-handler-generate)
* [`gqlmocks handler info`](#gqlmocks-handler-info)
* [`gqlmocks help [COMMANDS]`](#gqlmocks-help-commands)
* [`gqlmocks schema info`](#gqlmocks-schema-info)
* [`gqlmocks schema validate`](#gqlmocks-schema-validate)
* [`gqlmocks version`](#gqlmocks-version)

## `gqlmocks config generate`

generate or update a gqlmocks config file

```
USAGE
  $ gqlmocks config generate [--save-config <value>] [--format ts|js|json] [--schema.path <value>] [--schema.format
    SDL|SDL_STRING] [--handler.path <value>] [--force]

FLAGS
  --force                   overwrite config if one exists
  --format=<option>         specify the output format of the gqlmocks config
                            <options: ts|js|json>
  --handler.path=<value>
  --save-config=<value>     path to write generated config to
  --schema.format=<option>  <options: SDL|SDL_STRING>
  --schema.path=<value>     path to GraphQL schema

DESCRIPTION
  generate or update a gqlmocks config file

EXAMPLES
  $ gqlmocks config generate

  $ gqlmocks config generate --force

  $ gqlmocks config generate --save-config "./path/to/gqlmocks.config.js"

  $ gqlmocks config generate --schema.path "./graphql-mocks/schema.graphql" --schema.format "SDL_STRING"

  $ gqlmocks config generate --handler.path "./graphql-mocks/handler.js"
```

_See code: [src/commands/config/generate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/generate.ts)_

## `gqlmocks config info`

display info about a gqlmocks config file

```
USAGE
  $ gqlmocks config info [-c <value>]

FLAGS
  -c, --config=<value>  path to config file

DESCRIPTION
  display info about a gqlmocks config file

EXAMPLES
  $ gqlmocks config info

  $ gqlmocks config info --config "../gqlmocks.config.js"
```

_See code: [src/commands/config/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/info.ts)_

## `gqlmocks config validate`

validate a gqlmocks config file

```
USAGE
  $ gqlmocks config validate [-c <value>]

FLAGS
  -c, --config=<value>  path to config file

DESCRIPTION
  validate a gqlmocks config file

EXAMPLES
  $ gqlmocks config validate

  $ gqlmocks config validate --config "path/to/gqlmocks.config.js"
```

_See code: [src/commands/config/validate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/validate.ts)_

## `gqlmocks handler generate`

generate a graphql handler

```
USAGE
  $ gqlmocks handler generate [-c <value>] [--save-handler <value>] [--force] [--format ts|js]

FLAGS
  -c, --config=<value>        path to config file
      --force                 overwrite config if one already exists
      --format=<option>       specify the file format of the created handler file
                              <options: ts|js>
      --save-handler=<value>  path to write generated config to

DESCRIPTION
  generate a graphql handler

EXAMPLES
  $ gqlconfig handler generate

  $ gqlconfig handler generate --force

  $ gqlconfig handler generate --save-handler "path/to/gqlmocks.config.js"

  $ gqlconfig handler generate --format "ts"
```

_See code: [src/commands/handler/generate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/handler/generate.ts)_

## `gqlmocks handler info`

display info about a graphql handler

```
USAGE
  $ gqlmocks handler info [-c <value>] [-h <value>]

FLAGS
  -c, --config=<value>   path to config file
  -h, --handler=<value>  path to file with graphql handler

DESCRIPTION
  display info about a graphql handler

EXAMPLES
  $ gqlmocks handler info

  $ gqlmocks handler info --handler path/to/handler.js
```

_See code: [src/commands/handler/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/handler/info.ts)_

## `gqlmocks help [COMMANDS]`

Display help for gqlmocks.

```
USAGE
  $ gqlmocks help [COMMANDS...] [-n]

ARGUMENTS
  COMMANDS...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for gqlmocks.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `gqlmocks schema info`

display info about a graphql schema

```
USAGE
  $ gqlmocks schema info [-s <value>] [-c <value>]

FLAGS
  -c, --config=<value>  path to config file
  -s, --schema=<value>  local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                        api endpoint)

DESCRIPTION
  display info about a graphql schema

EXAMPLES
  $ gqlmocks schema info

  $ gqlmocks schema info --schema "path/to/schema.graphql"
```

_See code: [src/commands/schema/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/schema/info.ts)_

## `gqlmocks schema validate`

validate a graphql schema file

```
USAGE
  $ gqlmocks schema validate [-c <value>] [-s <value>]

FLAGS
  -c, --config=<value>  path to config file
  -s, --schema=<value>  local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                        api endpoint)

DESCRIPTION
  validate a graphql schema file

EXAMPLES
  $ gqlmocks schema validate

  $ gqlmocks schema validate --schema "path/to/schema.graphql"
```

_See code: [src/commands/schema/validate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/schema/validate.ts)_

## `gqlmocks version`

```
USAGE
  $ gqlmocks version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.3.10/src/commands/version.ts)_
<!-- commandsstop -->
