---
id: gqlmocks-config
title: CLI Config
---

The gqlmocks config uses a `gqlmocks.config.js`, `gqlmocks.config.ts` or `gqlmocks.config.json` file in the root of a project. The paths and options specified by the gqlmocks config file make it easier to run other commands and will provide the basis for future options.

## Creating a gqlmocks config

Running the `gqlmocks config generate` command will interactively step through creating a config file, alternatively the options for generating the config can be specified by its flags, too.

## Config Info and Validation

Use `gqlmocks config info` to double-check that a config file is parsed and reflecting the expected information. Use `gqlmocks config validate` to enforce that the config file is considered parsable and valid.
