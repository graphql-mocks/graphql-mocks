import { Command } from '@oclif/core';
export default class SchemaValidate extends Command {
    static description: string;
    static flags: {
        "schema-file": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
