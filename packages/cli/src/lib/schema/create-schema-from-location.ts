import { normalizeAbsolutePath } from '../normalize-absolute-path';
import cli from 'cli-ux';
import Serve from '../../commands/serve';
import { buildClientSchema, getIntrospectionQuery, GraphQLSchema, printSchema } from 'graphql';
import { createSchema } from 'graphql-mocks/graphql/utils';
import { readFileSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import { resolve } from 'path';
import { tmpdir } from 'os';

function urlForPath(path: string) {
  try {
    return new URL(path);
  } catch {
    // noop
  }
}

export async function createSchemaFromLocation(path: string, headers: Record<string, string>): Promise<GraphQLSchema> {
  const axios = Serve.axios;

  let normalizedPath = normalizeAbsolutePath(path, { extensions: ['gql', 'graphql', 'json', 'js', 'ts'] });
  const url = urlForPath(path);

  if (!normalizedPath && url) {
    cli.action.start(`Fetching schema from ${url}`);
    let schemaString;
    try {
      const { data: result } = await axios.post(url.toString(), {
        query: getIntrospectionQuery(),
        Headers: headers,
      });

      schemaString = printSchema(buildClientSchema((result as any).data));
      // eslint-disable-next-line no-empty
    } catch (e) {}

    if (!schemaString) {
      try {
        const { data: rawSchemaFile } = await axios.get(url.toString());
        schemaString = rawSchemaFile;
        // eslint-disable-next-line no-empty
      } catch {}
    }

    if (typeof schemaString !== 'string') {
      throw new Error(`Unable to get schema from ${schemaString} as a file or introspection query`);
    }

    const filename = randomBytes(16).toString('hex');
    normalizedPath = resolve(tmpdir(), filename);

    writeFileSync(normalizedPath, schemaString as any);
    cli.action.stop();
  }

  if (!normalizedPath) {
    throw new Error(`Could not determine a local or remote schema from ${path}`);
  }

  let schema;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(normalizedPath);
    schema = createSchema(loaded?.default ?? loaded);
  } catch {
    const rawFile = readFileSync(normalizedPath).toString();
    schema = createSchema(rawFile);
  }

  return (schema as unknown) as GraphQLSchema;
}
