import { Command } from '@oclif/core';
export default class ConfigGenerate extends Command {
    static description: string;
    static flags: {
        out: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        format: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        "schema.path": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        "schema.format": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        "handler.path": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        force: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
