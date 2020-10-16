import { ModelInstance, Server } from 'miragejs';
import { extractDependencies } from 'graphql-mocks/resolver/extract-dependencies';

export default function (
  _parent: unknown,
  _args: Record<string, unknown>,
  context: Record<string, unknown>,
): ModelInstance[] {
  const { mirageServer } = extractDependencies<{ mirageServer: Server }>(context, ['mirageServer']);

  if (!mirageServer) {
    throw new Error('mirageServer is a required dependency, please include it in pack dependencies.');
  }

  return mirageServer.schema.all('person').models;
}
