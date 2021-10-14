"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const network_express_1 = require("@graphql-mocks/network-express");
const express = require("express");
const graphql_mocks_1 = require("graphql-mocks");
const path_1 = require("path");
const faker_1 = require("@graphql-mocks/faker");
const axios_1 = tslib_1.__importDefault(require("axios"));
const core_2 = require("@oclif/core");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const normalize_absolute_path_1 = require("../lib/normalize-absolute-path");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const graphiql_middleware_1 = require("graphiql-middleware");
const load_config_1 = require("../lib/config/load-config");
const fs_1 = require("fs");
const create_schema_from_location_1 = require("../lib/schema/create-schema-from-location");
const collapse_headers_1 = require("../lib/schema/collapse-headers");
function refreshModuleOnChange(module, cb) {
    fs_1.watchFile(path_1.resolve(module), () => {
        let existsInCache;
        try {
            existsInCache = require.cache[require.resolve(module)];
            if (existsInCache) {
                delete require.cache[require.resolve(module)];
                require(module);
            }
        }
        catch (e) {
            console.log(chalk_1.default.yellow(`Error reloading:\n${e.toString()}`));
        }
        console.log(`Reloaded ${module}`);
        if (cb) {
            cb();
        }
    });
}
class Serve extends core_1.Command {
    constructor() {
        super(...arguments);
        this.server = null;
    }
    loadHandler(path) {
        const { dir, name } = path_1.parse(path);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        let loaded = require(path_1.resolve(dir, name));
        loaded = loaded?.default ?? loaded;
        if (!loaded) {
            this.error(`Unable to load handler from ${path}`);
        }
        return loaded;
    }
    async startServer({ handlerPath, schema, port, middlewares }) {
        let handler;
        if (handlerPath) {
            try {
                handler = this.loadHandler(handlerPath);
            }
            catch (e) {
                this.error(`Unable to find handler at ${handlerPath}.\n\n${e.message}`);
            }
        }
        else {
            handler = new graphql_mocks_1.GraphQLHandler({
                dependencies: {
                    graphqlSchema: schema,
                },
            });
        }
        handler.middlewares = middlewares;
        core_2.CliUx.ux.action.start(`Starting graphql api server on port ${port}`);
        const app = Serve.express();
        const apiEndpointPath = '/graphql';
        const graphiqlClientPath = '/client';
        app.post(apiEndpointPath, network_express_1.expressMiddleware(handler));
        app.use(graphiqlClientPath, graphiql_middleware_1.graphiqlMiddleware({
            endpointURL: '/graphql',
        }, {
            headerEditorEnabled: true,
            shouldPersistHeaders: true,
        }));
        const server = await new Promise((resolve) => {
            const server = app.listen(port, () => {
                resolve(server);
            });
        });
        core_2.CliUx.ux.action.stop();
        return server;
    }
    watchFiles(files, start) {
        files.forEach((path) => {
            refreshModuleOnChange(path, start);
        });
    }
    async run() {
        const { flags } = await this.parse(Serve);
        const port = Number(flags.port);
        const headers = collapse_headers_1.collapseHeaders(flags.header);
        const { config, errors } = load_config_1.loadConfig();
        if (config && errors && errors.length) {
            this.warn(`Found gqlmocks config but it has validation errors:\n${errors.map((e) => ` * ${e.message}`).join('\n')}`);
        }
        const schemaPath = flags.schema ?? config?.schema?.path;
        if (!schemaPath) {
            this.error('A GraphQLSchema is required, specify a schema via a gqlmocks config or --schema flag');
        }
        const handlerPath = flags.handler ?? config?.handler?.path;
        const schema = await create_schema_from_location_1.createSchemaFromLocation(schemaPath, headers);
        const middlewares = [];
        if (flags.faker) {
            middlewares.push(faker_1.fakerMiddleware());
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
            }
            else {
                await up();
            }
        };
        if (flags.watch) {
            const files = [
                schemaPath && normalize_absolute_path_1.normalizeAbsolutePath(schemaPath, { extensions: ['graphql', 'gql', 'json', 'js', 'ts'] }),
                handlerPath && normalize_absolute_path_1.normalizeAbsolutePath(handlerPath, { extensions: ['js', 'ts'] }),
            ].filter(Boolean);
            this.watchFiles(files, start);
        }
        await start();
        this.log();
        this.log(chalk_1.default.white(' Local GraphQL API: '), chalk_1.default.bold(chalk_1.default.magenta(`http://localhost:${port}/graphql`)));
        this.log(chalk_1.default.white(' IDE client:        '), chalk_1.default.bold(chalk_1.default.magenta(`http://localhost:${port}/client`)));
        this.log();
        this.log(chalk_1.default.bold(chalk_1.default.whiteBright('Press Ctrl+C to stop')));
        this.log();
    }
}
exports.default = Serve;
// used for mocking
Serve.express = express;
Serve.axios = axios_1.default;
Serve.description = 'Run a local graphql server';
Serve.examples = [
    `$ gqlmocks serve --schema ../schema.graphql`,
    `$ gqlmocks serve --schema ../schema.graphql --handler ../handler.ts`,
    `$ gqlmocks serve --schema http://s3-bucket/schema.graphql --faker`,
    `$ gqlmocks serve --schema http://graphql-api/ --faker`,
    `$ gqlmocks serve --schema http://graphql-api/ --header "Authorization=Bearer token" --faker`,
];
Serve.flags = {
    faker: core_1.Flags.boolean({
        env: 'GQLMOCKS_FAKER',
        description: 'use faker middlware for resolver fallbacks',
    }),
    handler: core_1.Flags.string({
        env: 'GQLMOCKS_HANDLER',
        description: 'path to file with graphql handler (via default export)',
    }),
    schema: core_1.Flags.string({
        env: 'GQLMOCKS_SCHEMA',
        description: 'local (relative or absolute) path to graphql schema, remote url (graphql schema file or graphql api endpoint)',
    }),
    port: core_1.Flags.string({ default: '4444', env: 'GQLMOCKS_PORT' }),
    header: core_1.Flags.string({
        multiple: true,
        description: 'specify header(s) used in request for remote schema specified by schema flag',
        dependsOn: ['schema'],
    }),
    watch: core_1.Flags.boolean(),
};
