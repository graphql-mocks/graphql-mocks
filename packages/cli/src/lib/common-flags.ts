import { Flags } from '@oclif/core';

// the flags in this file are in objects so that they can be spread into Command.flag definitions
// and preserve the same name of flag as well as the flag definition.

export const schema = {
  schema: Flags.string({
    char: 's',
    description:
      'local path to graphql schema (relative or absolute), remote url (graphql schema file or graphql api endpoint)',
  }),
};

export const handler = {
  handler: Flags.string({
    char: 'h',
    description: 'path to file with graphql handler',
  }),
};

export const config = {
  config: Flags.string({ char: 'c', description: 'path to config file' }),
};

export const header = {
  header: Flags.string({
    multiple: true,
    description: 'specify header(s) used in the request for remote schema specified by --schema flag',
    dependsOn: ['schema'],
  }),
};
