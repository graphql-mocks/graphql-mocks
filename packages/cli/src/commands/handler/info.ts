import { Command, Flags } from '@oclif/core';
import { loadConfig } from '../../lib/config/load-config';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';
import { loadSchema } from '../../lib/schema/load-schema';
import { errors as formatErrors } from '../../lib/info/errors';
import { heading } from '../../lib/info/heading';
import { existsSync } from 'fs';

export default class HandlerInfo extends Command {
  static description = 'display info about a GraphQL schema';

  static flags = {
    ['handler-file']: Flags.string(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(HandlerInfo);
    const { config } = loadConfig();
    const handlerPath = flags['handler-file'] ?? config?.handler?.path;

    const errors: Error[] = [];

    let handler;
    if (handlerPath && existsSync(handlerPath)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        handler = require(handlerPath);
      } catch (e) {
        errors.push(new Error(`Tried to load handler but failed with error:\n${(e as Error).message}`));
      }
    } else {
      errors.push(new Error(`Could not find handler at ${handlerPath}`));
    }

    if (handler && !handler.query) {
      errors.push(
        new Error(
          `Exported handler doesn't appear to be a graphql mocks GraphQLHandler instance, missing #query method.\nDouble-check that it's the default export and an instance of GraphQLHandler`,
        ),
      );
    }

    const formattedErrors = errors
      .map((e) => {
        return `  * ${e.message}`;
      })
      .join('\n');

    if (handlerPath) {
      this.log();
      this.log(heading('Location'));
      this.log(handlerPath);
      this.log();
    }

    this.log(heading('Errors'));
    this.log(formattedErrors || '✅ No errors.');
    this.log();
  }
}
