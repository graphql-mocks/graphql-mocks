export type LoadableJavascriptFile = {
  path: string;
};

export type GqlMocksConfig = {
  schema: LoadableJavascriptFile & {
    url?: string;
    format?: 'SDL' | 'SDL_STRING' | 'JSON';
    path: string;
  };

  handler: LoadableJavascriptFile;
  resolverMap?: LoadableJavascriptFile;
  resolvers?: {
    organizedBy: 'TYPE';
    path: string;
  };
};
