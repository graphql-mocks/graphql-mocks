export type LoadableJavascriptFile = {
  relativePath: string;
  namedExport: string;
};

export type Config = {
  rootPath: string;

  schema: {
    url?: string;
    format?: 'SDL' | 'SDL_STRING' | 'JSON';

    // deviates from LoadableJavascriptFile because the
    // relative path could be to a .graphql file which is
    // not a javascript file
    relativePath: string;
    namedExport?: string;
  };

  handler: LoadableJavascriptFile;

  resolverMap?: LoadableJavascriptFile & {
    types: LoadableJavascriptFile;
  };
};
