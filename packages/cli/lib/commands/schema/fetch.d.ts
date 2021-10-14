import { Command } from '@oclif/core';
export default class SchemaFetch extends Command {
    static description: string;
    static flags: {
        "save-schema-file": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        force: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        format: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        source: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        header: import("@oclif/core/lib/interfaces").OptionFlag<string[]>;
    };
    run(): Promise<void>;
}
