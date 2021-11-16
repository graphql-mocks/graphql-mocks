import { Command, flags } from '@oclif/command';
import { expressMiddleware } from '@graphql-mocks/network-express';
import express = require('express');
import { GraphQLHandler } from 'graphql-mocks';
import { createSchema } from 'graphql-mocks/graphql/utils';
import { cwd } from 'process';
import { resolve, parse as pathParse, isAbsolute } from 'path';
import { existsSync, readFileSync, writeFileSync, watchFile } from 'fs';
import { fakerMiddleware } from '@graphql-mocks/faker';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';
import { cli } from 'cli-ux';
import chalk from 'chalk';
import { ResolverMapMiddleware } from 'graphql-mocks/types';
import { normalizeAbsolutePath } from '../lib/normalize-absolute-path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { graphiqlMiddleware } from 'graphiql-middleware';

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
    `$ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token --faker"`,
  ];

  static flags = {
    faker: flags.boolean({
      env: 'GQLMOCKS_FAKER',
      description: 'use faker middlware for resolver fallbacks',
    }),
    handler: flags.string({
      env: 'GQLMOCKS_HANDLER',
      description: 'path to file with graphql handler (via default export)',
    }),
    schema: flags.string({
      required: true,
      env: 'GQLMOCKS_SCHEMA',
      description:
        'local (relative or absolute) path to graphql schema, remote url (graphql schema file or graphql api endpoint)',
    }),
    port: flags.string({ default: '8080', env: 'GQLMOCKS_PORT' }),
    header: flags.string({
      multiple: true,
      description: 'specify header(s) used in request for remote schema specified by schema flag',
      dependsOn: ['schema'],
    }),
    watch: flags.boolean(),
  };

  server: any = null;

  urlForPath(path: string) {
    try {
      return new URL(path);
    } catch {
      // noop
    }
  }

  async createSchema(path: string, headers: Record<string, string>) {
    const axios = Serve.axios;

    let normalizedPath = normalizeAbsolutePath(path);
    const url = this.urlForPath(path);

    if (!normalizedPath && url) {
      cli.action.start(`Getting schema from ${url}`);
      let schemaString;
      try {
        const { data: result } = await axios.post(url.toString(), {
          query: getIntrospectionQuery(),
          Headers: headers,
        });

        schemaString = printSchema(buildClientSchema((result as any).data));
        // eslint-disable-next-line no-empty
      } catch (e) {}

      if (!schemaString) {
        try {
          const { data: rawSchemaFile } = await axios.get(url.toString());
          schemaString = rawSchemaFile;
          // eslint-disable-next-line no-empty
        } catch {}
      }

      if (typeof schemaString !== 'string') {
        this.error(`Unable to get schema from ${schemaString} as a file or introspection query`);
      }

      const filename = randomBytes(16).toString('hex');
      normalizedPath = resolve(tmpdir(), filename);

      writeFileSync(normalizedPath, schemaString as any);
      cli.action.stop();
    }

    if (!normalizedPath) {
      this.error(`Could not determine a local or remote schema from ${path}`);
    }

    let schema;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const loaded = require(normalizedPath);
      schema = createSchema(loaded?.default ?? loaded);
    } catch {
      const rawFile = readFileSync(normalizedPath).toString();
      schema = createSchema(rawFile);
    }

    return schema;
  }

  findHandlerAbsolutePath(path: string) {
    if (!isAbsolute(path)) {
      const absolutePath = resolve(cwd(), path);

      if (!existsSync(absolutePath)) {
        this.error(`Could not find handler at path ${path}`);
      }

      path = absolutePath;
    }

    return path;
  }

  loadHandler(path: string) {
    const { dir, name } = pathParse(path);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let loaded = require(resolve(dir, name));
    loaded = loaded?.default ?? loaded;

    if (!loaded) {
      this.error(`Was unable to load handler from ${path}`);
    }

    return loaded;
  }

  startServer({ flags, schema, port, middlewares }: any) {
    let handler;

    if (flags.handler) {
      try {
        const handlerPath = this.findHandlerAbsolutePath(flags.handler);
        handler = this.loadHandler(handlerPath);
      } catch (e) {
        this.error(`Unable to find handler at ${flags.handler}`);
      }
    } else {
      handler = new GraphQLHandler({
        dependencies: {
          graphqlSchema: schema,
        },
      });
    }

    (handler as any).middlewares = middlewares;
    cli.action.start(`Starting graphql api server on port ${port}`);
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

    const server = app.listen(port);
    cli.action.stop();
    return server;
  }

  watchFiles(files: string[], start: any) {
    files.forEach((path) => {
      refreshModuleOnChange(path, start);
    });
  }

  async run() {
    const { flags } = this.parse(Serve);

    const port = Number(flags.port);
    const headers = (flags.header ?? []).reduce((headers, flag) => {
      const [key, value] = flag.split('=');

      if (!key || !value) {
        throw new Error(`Expected a key and value header pair, got key: ${key}, value: ${value}`);
      }

      return {
        ...headers,
        [key]: value,
      };
    }, {});
    const schema = await this.createSchema(flags.schema, headers);
    const middlewares: ResolverMapMiddleware[] = [];

    if (flags.faker) {
      middlewares.push(fakerMiddleware());
    }

    const start = () => {
      const up = () => {
        this.server = this.startServer({ flags, schema, port, middlewares });
      };

      if (this.server) {
        debugger;
        this.server.close(() => {
          this.log('Restarting server...');
          up();
        });
      } else {
        up();
      }
    };

    if (flags.watch) {
      const files = [
        flags.schema && normalizeAbsolutePath(flags.schema),
        flags.handler && this.findHandlerAbsolutePath(flags.handler),
      ].filter(Boolean) as string[];

      this.watchFiles(files, start);
    }

    start();
    this.log();
    this.log(chalk.white(' Local GraphQL API: '), chalk.bold(chalk.magenta(`http://localhost:${port}/graphql`)));
    this.log(chalk.white(' IDE client:        '), chalk.bold(chalk.magenta(`http://localhost:${port}/client`)));
    this.log();
    this.log(chalk.bold(chalk.whiteBright('Press Ctrl+C to stop')));
    this.log();
  }
}
