# Commands
<!-- commands -->
* [`gqlmocks config:generate`](#gqlmocks-configgenerate)
* [`gqlmocks config:info`](#gqlmocks-configinfo)
* [`gqlmocks config:validate`](#gqlmocks-configvalidate)
* [`gqlmocks handler:generate`](#gqlmocks-handlergenerate)
* [`gqlmocks handler:info`](#gqlmocks-handlerinfo)
* [`gqlmocks help [COMMAND]`](#gqlmocks-help-command)
* [`gqlmocks schema:fetch`](#gqlmocks-schemafetch)
* [`gqlmocks schema:info`](#gqlmocks-schemainfo)
* [`gqlmocks schema:validate`](#gqlmocks-schemavalidate)
* [`gqlmocks serve`](#gqlmocks-serve)
* [`gqlmocks version`](#gqlmocks-version)

## `gqlmocks config:generate`

generate or update a gqlmocks config file

```
USAGE
  $ gqlmocks config:generate

OPTIONS
  --force                         overwrite config if one exists
  --format=ts|js|json             specify the output format of the gqlmocks config
  --handler.path=handler.path
  --save-config=save-config       path to write generated config to
  --schema.format=SDL|SDL_STRING
  --schema.path=schema.path       path to GraphQL schema

EXAMPLES
  $ gqlmocks config generate
  $ gqlmocks config generate --force
  $ gqlmocks config generate --save-config "./path/to/gqlmocks.config.js"
  $ gqlmocks config generate --schema.path "./graphql-mocks/schema.graphql" --schema.format "SDL_STRING"
  $ gqlmocks config generate --handler.path "./graphql-mocks/handler.js"
```

_See code: [src/commands/config/generate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/generate.ts)_

## `gqlmocks config:info`

display info about a gqlmocks config file

```
USAGE
  $ gqlmocks config:info

OPTIONS
  -c, --config=config  path to config file

EXAMPLES
  $ gqlmocks config info
  $ gqlmocks config info --config "../gqlmocks.config.js"
```

_See code: [src/commands/config/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/info.ts)_

## `gqlmocks config:validate`

validate a gqlmocks config file

```
USAGE
  $ gqlmocks config:validate

OPTIONS
  -c, --config=config  path to config file

EXAMPLES
  $ gqlmocks config validate
  $ gqlmocks config validate --config "path/to/gqlmocks.config.js"
```

_See code: [src/commands/config/validate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/config/validate.ts)_

## `gqlmocks handler:generate`

generate a graphql handler

```
USAGE
  $ gqlmocks handler:generate

OPTIONS
  -c, --config=config          path to config file
  --force                      overwrite config if one already exists
  --format=ts|js               specify the file format of the created handler file
  --save-handler=save-handler  path to write generated config to

EXAMPLES
  $ gqlconfig handler generate
  $ gqlconfig handler generate --force
  $ gqlconfig handler generate --save-handler "path/to/gqlmocks.config.js"
  $ gqlconfig handler generate --format "ts"
```

_See code: [src/commands/handler/generate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/handler/generate.ts)_

## `gqlmocks handler:info`

display info about a graphql handler

```
USAGE
  $ gqlmocks handler:info

OPTIONS
  -c, --config=config    path to config file
  -h, --handler=handler  path to file with graphql handler

EXAMPLES
  $ gqlmocks handler info
  $ gqlmocks handler info --handler path/to/handler.js
```

_See code: [src/commands/handler/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/handler/info.ts)_

## `gqlmocks help [COMMAND]`

display help for gqlmocks

```
USAGE
  $ gqlmocks help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all   see all commands in CLI
  --json  Format output as json.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.0.0/src/commands/help.ts)_

## `gqlmocks schema:fetch`

fetch and save a graphql schema locally

```
USAGE
  $ gqlmocks schema:fetch

OPTIONS
  -c, --config=config        path to config file
  --force                    overwrite a schema file if one already exists
  --format=SDL|SDL_STRING    [default: SDL] format to save the schema as
  --header=header            specify header(s) used in the request for remote schema specified by --schema flag
  --save-schema=save-schema  path of file to save schema to
  --source=source            url of graphql api server or url of remote .graphql file

EXAMPLES
  $ gqlmocks schema fetch
  $ gqlmocks schema fetch --force
  $ gqlmocks schema fetch --source "http://remote.com/schema.graphql"
  $ gqlmocks schema fetch --source "http://remote-gql-api.com"
  $ gqlmocks schema fetch --source "http://remote-gql-api.com" --header "Authorization=Bearer abc123" --header 
  "Header=Text"
  $ gqlmocks schema fetch --format "SDL_STRING"
```

_See code: [src/commands/schema/fetch.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/schema/fetch.ts)_

## `gqlmocks schema:info`

display info about a graphql schema

```
USAGE
  $ gqlmocks schema:info

OPTIONS
  -c, --config=config  path to config file

  -s, --schema=schema  local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                       api endpoint)

EXAMPLES
  $ gqlmocks schema info
  $ gqlmocks schema info --schema "path/to/schema.graphql"
```

_See code: [src/commands/schema/info.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/schema/info.ts)_

## `gqlmocks schema:validate`

validate a graphql schema file

```
USAGE
  $ gqlmocks schema:validate

OPTIONS
  -c, --config=config  path to config file

  -s, --schema=schema  local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                       api endpoint)

EXAMPLES
  $ gqlmocks schema validate
  $ gqlmocks schema validate --schema "path/to/schema.graphql"
```

_See code: [src/commands/schema/validate.ts](https://github.com/graphql-mocks/graphql-mocks/blob/main/packages/cli/src/commands/schema/validate.ts)_

## `gqlmocks serve`

run a local graphql server

```
USAGE
  $ gqlmocks serve

OPTIONS
  -c, --config=config    path to config file
  -f, --fake             use @graphql-mocks/falso to fill in missing resolvers with fake data
  -h, --handler=handler  path to file with graphql handler
  -p, --port=port        [default: 4444] Port to serve on

  -s, --schema=schema    local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql
                         api endpoint)

  --header=header        specify header(s) used in the request for remote schema specified by --schema flag

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
