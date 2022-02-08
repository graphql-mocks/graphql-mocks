import { Command, Flags } from '@oclif/core';
import { expressMiddleware } from '@graphql-mocks/network-express';
import express = require('express');
import { GraphQLHandler } from 'graphql-mocks';
import { resolve, parse as pathParse } from 'path';
import { fakerMiddleware } from '@graphql-mocks/faker';
import axios from 'axios';
import { CliUx as cli } from '@oclif/core';
import chalk from 'chalk';
import { ResolverMapMiddleware } from 'graphql-mocks/types';
import { normalizeAbsolutePath } from '../lib/normalize-absolute-path';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { graphiqlMiddleware } from 'graphiql-middleware';
import { loadConfig } from '../lib/config/load-config';
import { watchFile } from 'fs';
import { createSchemaFromLocation } from '../lib/schema/create-schema-from-location';
import { collapseHeaders } from '../lib/schema/collapse-headers';

function refreshModuleOnChange(module: string, cb: any) {
  watchFile(resolve(module), () => {
    let existsInCache;
    try {
      existsInCache = require.cache[require.resolve(module)];

      if (existsInCache) {
        delete require.cache[require.resolve(module)];
        require(module);
      }
    } catch (e) {
      console.log(chalk.yellow(`Error reloading:\n${e.toString()}`));
    }

    console.log(`Reloaded ${module}`);

    if (cb) {
      cb();
    }
  });
}

export default class Serve extends Command {
  // used for mocking
  static express = express;
  static axios = axios;

  static description = 'Run a local graphql server';

  static examples = [
    `$ gqlmocks serve --schema ../schema.graphql`,
    `$ gqlmocks serve --schema ../schema.graphql --handler ../handler.ts`,
    `$ gqlmocks serve --schema http://s3-bucket/schema.graphql --faker`,
    `$ gqlmocks serve --schema http://graphql-api/ --faker`,
    `$ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token" --faker`,
  ];

  static flags = {
    faker: Flags.boolean({
      env: 'GQLMOCKS_FAKER',
      description: 'use faker middlware for resolver fallbacks',
    }),
    handler: Flags.string({
      env: 'GQLMOCKS_HANDLER',
      description: 'path to file with graphql handler (via default export)',
    }),
    schema: Flags.string({
      env: 'GQLMOCKS_SCHEMA',
      description:
        'local (relative or absolute) path to graphql schema, remote url (graphql schema file or graphql api endpoint)',
    }),
    port: Flags.string({ default: '4444', env: 'GQLMOCKS_PORT' }),
    header: Flags.string({
      multiple: true,
      description: 'specify header(s) used in request for remote schema specified by schema flag',
      dependsOn: ['schema'],
    }),
    watch: Flags.boolean(),
  };

  server: any = null;

  loadHandler(path: string) {
    const { dir, name } = pathParse(path);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let loaded = require(resolve(dir, name));
    loaded = loaded?.default ?? loaded;

    if (!loaded) {
      this.error(`Unable to load handler from ${path}`);
    }

    return loaded;
  }

  async startServer({ handlerPath, schema, port, middlewares }: any) {
    let handler;

    if (handlerPath) {
      try {
        handler = this.loadHandler(handlerPath);
      } catch (e) {
        this.error(`Unable to find handler at ${handlerPath}.\n\n${(e as Error).message}`);
      }
    } else {
      handler = new GraphQLHandler({
        dependencies: {
          graphqlSchema: schema,
        },
      });
    }

    (handler as any).middlewares = middlewares;
    cli.ux.action.start(`Starting graphql api server on port ${port}`);
    const app = Serve.express();

    const apiEndpointPath = '/graphql';
    const graphiqlClientPath = '/client';
    app.post(apiEndpointPath, expressMiddleware(handler as GraphQLHandler));
    app.use(
      graphiqlClientPath,
      graphiqlMiddleware(
        {
          endpointURL: '/graphql',
        },
        {
          headerEditorEnabled: true,
          shouldPersistHeaders: true,
        },
      ),
    );

    const server = await new Promise((resolve) => {
      const server = app.listen(port, () => {
        resolve(server);
      });
    });

    cli.ux.action.stop();
    return server;
  }

  watchFiles(files: string[], start: any) {
    files.forEach((path) => {
      refreshModuleOnChange(path, start);
    });
  }

  async run() {
    const { flags } = await this.parse(Serve);

    const port = Number(flags.port);
    const headers = collapseHeaders(flags.header);

    const { config, errors } = loadConfig();
    if (config && errors && errors.length) {
      this.warn(
        `Found gqlmocks config but it has validation errors:\n${errors.map((e) => ` * ${e.message}`).join('\n')}`,
      );
    }

    const schemaPath = flags.schema ?? config?.schema?.path;

    if (!schemaPath) {
      this.error('A GraphQLSchema is required, specify a schema via a gqlmocks config or --schema flag');
    }

    const handlerPath = flags.handler ?? config?.handler?.path;

    const schema = await createSchemaFromLocation(schemaPath, headers);
    const middlewares: ResolverMapMiddleware[] = [];

    if (flags.faker) {
      middlewares.push(fakerMiddleware());
    }

    const start = async () => {
      const up = async () => {
        this.server = await this.startServer({ handlerPath, schema, port, middlewares });
      };

      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        this.log('Restarting server...');
        await up();
      } else {
        await up();
      }
    };

    if (flags.watch) {
      const files = [
        schemaPath && normalizeAbsolutePath(schemaPath, { extensions: ['graphql', 'gql', 'json', 'js', 'ts'] }),
        handlerPath && normalizeAbsolutePath(handlerPath, { extensions: ['js', 'ts'] }),
      ].filter(Boolean) as string[];

      this.watchFiles(files, start);
    }

    await start();
    this.log();
    this.log(chalk.white(' Local GraphQL API: '), chalk.bold(chalk.magenta(`http://localhost:${port}/graphql`)));
    this.log(chalk.white(' IDE client:        '), chalk.bold(chalk.magenta(`http://localhost:${port}/client`)));
    this.log();
    this.log(chalk.bold(chalk.whiteBright('Press Ctrl+C to stop')));
    this.log();
  }
}
