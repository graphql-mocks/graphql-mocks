import { Command } from '@oclif/core';
export default class HandlerGenerate extends Command {
    static description: string;
    static flags: {
        out: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        force: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        format: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
