---
id: gqlmocks-config
title: gqlmocks Config File
---

The gqlmocks can use a configuration file, `gqlmocks.config.js`, in the root of a project. The paths and options specified by the gqlmocks config file make it easier to run other commands with specified defaults, and will provide the basis for future options.

## Creating a gqlmocks config

Running the `npx gqlmocks config generate` command will interactively step through creating a config file, alternatively the options for generating the config can be specified by its flags, too.

## Config Info and Validation

Use `npx gqlmocks config info` to double-check that a config file is parsed and reflecting the expected information. Use `npx gqlmocks config validate` to enforce that the config file is considered parsable and valid.
