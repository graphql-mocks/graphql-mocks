import { Command, flags } from '@oclif/command';
import { expressMiddleware } from '@graphql-mocks/network-express';
import * as express from 'express';
import { GraphQLHandler } from 'graphql-mocks';
import { createSchema } from 'graphql-mocks/graphql/utils';
import { cwd } from 'process';
import { resolve, parse as pathParse } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { fakerMiddleware } from '@graphql-mocks/faker';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';
import { cli } from 'cli-ux';
import { graphiqlMiddleware } from 'graphiql-middleware';
import * as chalk from 'chalk';
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
  };

  async createSchema(path: string, headers: Record<string, string>) {
    const axios = Serve.axios;

    if (!existsSync(path)) {
      const absolutePath = resolve(cwd(), path);
      let url;

      try {
        url = new URL(path);
      } catch {
        // noop
      }

      if (existsSync(absolutePath)) {
        path = absolutePath;
      } else if (url) {
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
        path = resolve(tmpdir(), filename);

        writeFileSync(path, schemaString as any);
        cli.action.stop();
      }
    }

    let schema;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const loaded = require(path);
      schema = createSchema(loaded?.default ?? loaded);
    } catch {
      const rawFile = readFileSync(path).toString();
      schema = createSchema(rawFile);
    }

    return schema;
  }

  loadHandler(path: string) {
    if (!existsSync(path)) {
      const absolutePath = resolve(cwd(), path);

      if (!existsSync(absolutePath)) {
        this.error(`Could not find schema at path ${path}`);
      }

      path = absolutePath;
    }

    const { dir, name } = pathParse(path);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let loaded = require(resolve(dir, name));
    loaded = loaded?.default ?? loaded;

    if (!loaded) {
      this.error(`Was unable to load handler from ${path}`);
    }

    return loaded;
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
    const middlewares = [];

    if (flags.faker) {
      middlewares.push(fakerMiddleware());
    }

    const handler: GraphQLHandler = flags.handler
      ? this.loadHandler(flags.handler)
      : new GraphQLHandler({
          dependencies: {
            graphqlSchema: schema,
          },
        });

    (handler as any).middlewares = middlewares;

    cli.action.start(`Starting graphql api server on port ${port}`);
    const app = Serve.express();

    const apiEndpointPath = '/graphql';
    const graphiqlClientPath = '/client';
    app.post(apiEndpointPath, expressMiddleware(handler));
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

    app.listen(port);
    cli.action.stop();

    this.log();
    this.log(
      chalk.white('Local GraphQL API: '),
      chalk.bold(chalk.magenta(`http://localhost:${port}${apiEndpointPath}`)),
    );
    this.log(
      chalk.white('IDE client:        '),
      chalk.bold(chalk.magenta(`http://localhost:${port}${graphiqlClientPath}`)),
    );
    this.log();
    this.log(chalk.bold(chalk.whiteBright('Press Ctrl+C to stop')));
    this.log();
  }
}
