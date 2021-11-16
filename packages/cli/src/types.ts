export type LoadableJavascriptFile = {
  path: string;
};

export type Config = {
  schema: LoadableJavascriptFile & {
    url?: string;
    format?: 'SDL' | 'SDL_STRING' | 'JSON';
  };

  handler: LoadableJavascriptFile;
  resolverMap?: LoadableJavascriptFile;
  resolvers?: {
    organizedBy: 'TYPE';
    path: string;
  };
};
