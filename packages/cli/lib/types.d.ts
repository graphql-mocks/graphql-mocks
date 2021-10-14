export declare type PathableAsset = {
    path: string;
};
export declare type GqlMocksConfig = {
    schema: PathableAsset & {
        url?: string;
        headers: Record<string, string>;
        format?: 'SDL' | 'SDL_STRING';
    };
    handler: PathableAsset;
    resolverMap?: PathableAsset;
    resolvers?: PathableAsset & {
        organizedBy: 'TYPE';
    };
};
