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

## `gqlmocks handler generate`

generate a graphql handler

```
USAGE
  $ gqlmocks handler generate [-c <value>] [--save-handler <value>] [--force] [--format ts|js]

FLAGS
  -c, --config=<value>    path to config file
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `gqlmocks schema fetch`

fetch and save a graphql schema locally

```
USAGE
  $ gqlmocks schema fetch [--header <value> ] [-c <value>] [--save-schema <value>] [--force] [--format
    SDL|SDL_STRING] [--source <value>]

FLAGS
  -c, --config=<value>   path to config file
  --force                overwrite a schema file if one already exists
  --format=<option>      [default: SDL] format to save the schema as
                         <options: SDL|SDL_STRING>
  --header=<value>...    specify header(s) used in the request for remote schema specified by --schema flag
  --save-schema=<value>  path of file to save schema to
  --source=<value>       url of graphql api server or url of remote .graphql file

DESCRIPTION
  fetch and save a graphql schema locally

EXAMPLES
  $ gqlmocks schema fetch

  $ gqlmocks schema fetch --force

  $ gqlmocks schema fetch --source "http://remote.com/schema.graphql"

  $ gqlmocks schema fetch --source "http://remote-gql-api.com"

  $ gqlmocks schema fetch --source "http://remote-gql-api.com" --header "Authorization=Bearer abc123" --header "Header=Text"

  $ gqlmocks schema fetch --format "SDL_STRING"
```

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

## `gqlmocks serve`

run a local graphql server

```
USAGE
  $ gqlmocks serve [-c <value>] [-h <value>] [--header <value> -s <value>] [-f] [-p <value>]

FLAGS
  -c, --config=<value>   path to config file
  -f, --fake             use @graphql-mocks/falso to fill in missing resolvers with fake data
  -h, --handler=<value>  path to file with graphql handler
  -p, --port=<value>     [default: 4444] Port to serve on
  -s, --schema=<value>   local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                         api endpoint)
  --header=<value>...    specify header(s) used in the request for remote schema specified by --schema flag

DESCRIPTION
  run a local graphql server

EXAMPLES
  $ gqlmocks serve --schema ../schema.graphql

  $ gqlmocks serve --handler ../handler.ts

  $ gqlmocks serve --schema http://s3-bucket/schema.graphql --fake

  $ gqlmocks serve --schema http://graphql-api/ --fake

  $ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token" --fake
```

_See code: [src/commands/serve.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/serve.ts)_

## `gqlmocks version`

```
USAGE
  $ gqlmocks version
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.0.4/src/commands/version.ts)_
<!-- commandsstop -->
