import {Command, flags} from '@oclif/command'
import {expressMiddleware} from '@graphql-mocks/network-express'
import * as express from 'express'
import { GraphQLHandler } from 'graphql-mocks'
import { createSchema } from 'graphql-mocks/graphql/utils'
import { cwd } from 'process'
import { resolve } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { fakerMiddleware } from '@graphql-mocks/faker'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto';
import axios from 'axios'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'
import { cli } from 'cli-ux'

export default class Hello extends Command {
  static description = 'describe the command here'

  static examples = [
    `
$ gqlmocks hellos
hello world from ./src/hello.ts!
    `,
  ].map(string => string.trim())

  static flags = {
    faker: flags.boolean(),
    ['resolver-map']: flags.string(),
    schema: flags.string({ required: true }),
    port: flags.string({ default: '8080' })
  }

  async createSchema(path: string) {
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
        cli.action.start(`Getting schema from ${url}`)
        let schemaString
        try {
          const { data: result } = await axios.post(url.toString(), {
            query: getIntrospectionQuery()
          })

          schemaString = printSchema(buildClientSchema((result as any).data));
        } catch(e) {
        }

        if (!schemaString) {
          try {
            const { data: rawSchemaFile } = await axios.get(url.toString())
            schemaString = rawSchemaFile;
          } catch {
          }
        }

        if (typeof schemaString !== 'string') {
          this.error(`Unable to get schema from ${schemaString} as a file or introspection query`)
        }

        const filename = randomBytes(16).toString("hex");
        path = resolve(tmpdir(), filename);

        writeFileSync(path, schemaString as any)
        cli.action.stop()
      }
    }

    let schema;
    try {
      const loaded = require(path);
      schema = createSchema(loaded?.default ?? loaded);
    } catch {
      const rawFile = readFileSync(path).toString();
      schema = createSchema(rawFile);
    }

    return schema;
  }

  loadResolverMap(path: string) {
    if (!existsSync(path)) {
      const absolutePath = resolve(cwd(), path);

      if (!existsSync(absolutePath)) {
        this.error(`Could not find schema at path ${path}`);
      }
    }

    const loaded = require(path);
    return loaded?.default ?? loaded ?? {};
  }

  async run() {
    const {flags} = this.parse(Hello)
    const port = Number(flags.port)
    const schema = await this.createSchema(flags.schema);
    const resolverMap = flags['resolver-map'] ? this.loadResolverMap(flags['resolver-map']) : {}
    const middlewares = [];

    if (flags.faker) {
      middlewares.push(fakerMiddleware());
    }

    cli.action.start(`Launching on port ${port}`)
    const app =  express();
    const graphqlHandler = new GraphQLHandler({
      resolverMap,
      middlewares,
      dependencies: {
        graphqlSchema: schema
      }
    });

    app.post('/graphql', expressMiddleware(graphqlHandler));
    app.listen(port);
    cli.action.stop()
    this.log('Press ctrl+c to stop')
  }
}
