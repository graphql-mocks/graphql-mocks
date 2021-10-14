import { Command } from '@oclif/core';
import express = require('express');
export default class Serve extends Command {
    static express: typeof express;
    static axios: import("axios").AxiosStatic;
    static description: string;
    static examples: string[];
    static flags: {
        faker: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        handler: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        schema: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        port: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        header: import("@oclif/core/lib/interfaces").OptionFlag<string[]>;
        watch: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    server: any;
    loadHandler(path: string): any;
    startServer({ handlerPath, schema, port, middlewares }: any): Promise<unknown>;
    watchFiles(files: string[], start: any): void;
    run(): Promise<void>;
}
