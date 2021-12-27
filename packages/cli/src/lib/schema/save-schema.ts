import { existsSync, writeFileSync } from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import { normalizeAbsolutePath } from '../normalize-absolute-path';

export function saveSchema(options: {
  schema: GraphQLSchema;
  out: string;
  format: 'SDL' | 'SDL_STRING';
  force: boolean;
}): { savedPath: string } {
  const savedPath = normalizeAbsolutePath(options.out, { isFile: true, allowNonExisting: true });

  if (!savedPath) {
    throw new Error(`Could not determine an absolute path from ${options.out}`);
  }

  const printed = printSchema(options.schema);

  if (!options.force && existsSync(savedPath)) {
    throw new Error(`Bailing, file already exists at ${options.out}. Use \`force\` flag to `);
  }

  writeFileSync(savedPath, printed);
  return { savedPath };
}
