import { existsSync, writeFileSync } from 'fs';
import { GraphQLSchema, printSchema } from 'graphql';
import { isTypeScriptProject } from '../is-typescript-project';
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
    throw new Error(`Bailing, file already exists at ${options.out}. Re-run with \`force\` flag to overwrite.`);
  }

  let fileContents = printed;

  if (options.format === 'SDL_STRING') {
    const stringified = printed.replace(new RegExp('/`*/', 'g'), '\\`');
    const exportExpression = isTypeScriptProject(savedPath) ? `export default` : `module.exports =`;
    fileContents = `${exportExpression} \`
${stringified}
\`;`;
  }

  writeFileSync(savedPath, fileContents);
  return { savedPath };
}
