import { Command } from '@oclif/core';
export default class ConfigInfo extends Command {
    static description: string;
    static flags: {
        config: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
