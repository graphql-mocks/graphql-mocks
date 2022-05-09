import { buildSchema, GraphQLSchema, buildASTSchema } from 'graphql';
import { normalizeAbsolutePath } from '../normalize-absolute-path';
import { resolve } from 'path';

const requireNoCache = function (filePath: string) {
  const _invalidateRequireCacheForFile = function (filePath: string) {
    delete require.cache[resolve(filePath)];
  };

  _invalidateRequireCacheForFile(filePath);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const contents = require(filePath);
  _invalidateRequireCacheForFile(filePath);
  return contents;
};

export function loadSchema(path: string): { errors: Error[]; path?: string; schema?: GraphQLSchema; type?: string } {
  const filePath = normalizeAbsolutePath(path, { isFile: true });
  const errors: Error[] = [];

  if (!filePath) {
    errors.push(new Error(`Path of schema at ${path} does not exist`));
    return { errors };
  }

  let schema;
  let contents;
  let type;

  try {
    contents = requireNoCache(filePath);
    type = typeof contents === 'string' ? 'SDL_STRING' : 'SDL';
    schema = type === 'SDL_STRING' ? buildSchema(contents) : buildASTSchema(contents);
  } catch (e) {
    errors.push(new Error(`Unable to parse schema at ${filePath}, got:\n${(e as Error).message}`));
    return { errors, path: filePath };
  }

  return { schema, type, errors, path: filePath };
}
