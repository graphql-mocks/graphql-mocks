import { Command } from '@oclif/core';
import { loadConfig } from '../../lib/config/load-config';
import { heading } from '../../lib/info/heading';
import { existsSync } from 'fs';
import { normalizeAbsolutePath } from '../../lib/normalize-absolute-path';
import { handler } from '../../lib/common-flags';

export default class HandlerInfo extends Command {
  static description = 'display info about a graphql schema';
  static examples = ['$ gqlmocks handler info', '$ gqlmocks handler info --handler path/to/handler.js'];

  static flags = {
    ...handler,
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(HandlerInfo);
    const { config } = loadConfig();
    const errors: Error[] = [];
    const handlerPath = flags.handler ?? config?.handler?.path;
    let absoluteHandlerPath;

    if (!handlerPath) {
      errors.push(
        new Error(
          `Could not determine the handler path, either pass the path with the --handler flag or run in a project with a gqlmocks config with a handler.path entry`,
        ),
      );
    } else {
      absoluteHandlerPath = normalizeAbsolutePath(handlerPath, { isFile: true });
    }

    console.log(absoluteHandlerPath, handlerPath);

    let handler;
    if (absoluteHandlerPath && existsSync(absoluteHandlerPath)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        handler = require(absoluteHandlerPath);
      } catch (e) {
        errors.push(new Error(`Tried to load handler but failed with error:\n${(e as Error).message}`));
      }
    } else {
      errors.push(new Error(`Could not find handler at ${absoluteHandlerPath ?? handlerPath}`));
    }

    if (handler && !handler?.query && !handler?.default?.query) {
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

    if (absoluteHandlerPath) {
      this.log();
      this.log(heading('Location'));
      this.log(absoluteHandlerPath);
      this.log();
    }

    this.log(heading('Errors'));
    this.log(formattedErrors || '✅ No errors.');
    this.log();
  }
}
