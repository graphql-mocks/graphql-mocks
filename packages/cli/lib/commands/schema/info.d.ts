import { Command } from '@oclif/core';
export declare function findSchema(flagPath?: string): string;
export default class SchemaInfo extends Command {
    static description: string;
    static flags: {
        "schema-file": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
