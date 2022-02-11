import { readFileSync } from 'fs';
import { buildSchema, GraphQLSchema } from 'graphql';
import { normalizeAbsolutePath } from '../normalize-absolute-path';

export function loadSchema(path: string): { errors: Error[]; path?: string; schema?: GraphQLSchema; type?: string } {
  const filePath = normalizeAbsolutePath(path, { isFile: true });
  const errors = [];

  if (!filePath) {
    errors.push(new Error(`Path of schema at ${path} does not exist`));
    return { errors };
  }

  let type;
  let contents;
  try {
    contents = require(filePath);
    if (typeof contents !== 'string') {
      errors.push(new Error(`Expected exported contents of ${filePath} to be a string`));
      return { errors, path: filePath };
    } else {
      type = 'SDL_STRING';
    }
  } catch {
    contents = readFileSync(filePath).toString();
    type = 'SDL';
  }

  let schema;
  try {
    schema = buildSchema(contents);
  } catch (e) {
    errors.push(new Error(`Unable to parse schema at ${filePath}, got:\n${(e as Error).message}`));
    return { errors, path: filePath };
  }

  return { schema, type, errors, path: filePath };
}
