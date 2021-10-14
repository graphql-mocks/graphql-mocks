import { Command } from '@oclif/core';
export default class HandlerInfo extends Command {
    static description: string;
    static flags: {
        "handler-file": import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
