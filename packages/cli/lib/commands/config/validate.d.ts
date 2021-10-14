import { Command } from '@oclif/core';
export default class ConfigValidate extends Command {
    static description: string;
    static flags: {
        file: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
