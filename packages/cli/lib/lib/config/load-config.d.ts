import { GqlMocksConfig } from '../../types';
export declare function loadConfig(path?: string, options?: {
    strict: boolean;
}): {
    config?: GqlMocksConfig;
    path?: string;
    errors: Error[];
};
