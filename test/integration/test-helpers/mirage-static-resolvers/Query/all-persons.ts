import { ModelInstance, Server } from 'miragejs';
import { extractDependencies } from '../../../../../src/resolver-map/extract-dependencies';

export default function (
  _parent: unknown,
  _args: Record<string, unknown>,
  context: Record<string, unknown> /*, info*/,
): ModelInstance[] {
  const { mirageServer } = extractDependencies<{ mirageServer: Server }>(['mirageServer'], context);

  if (!mirageServer) {
    throw new Error('mirageServer is a required dependency, please include it in pack dependencies.');
  }

  return mirageServer.schema.all('person').models;
}
