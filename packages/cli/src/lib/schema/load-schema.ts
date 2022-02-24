import { buildSchema, GraphQLSchema, buildASTSchema } from 'graphql';
import { normalizeAbsolutePath } from '../normalize-absolute-path';

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
    contents = require(filePath);
    type = typeof contents === 'string' ? 'SDL_STRING' : 'SDL';
    schema = type === 'SDL_STRING' ? buildSchema(contents) : buildASTSchema(contents);
  } catch (e) {
    errors.push(new Error(`Unable to parse schema at ${filePath}, got:\n${(e as Error).message}`));
    return { errors, path: filePath };
  }

  return { schema, type, errors, path: filePath };
}
