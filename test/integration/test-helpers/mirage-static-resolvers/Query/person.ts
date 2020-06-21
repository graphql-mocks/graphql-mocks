import { ModelInstance, Server } from 'miragejs';
import { extractDependencies } from '../../../../../src/resolver-map/extract-dependencies';

const resolver = function (
  _parent: unknown,
  args: Record<string, unknown>,
  context: Record<string, unknown>,
): ModelInstance | undefined {
  const { mirageServer } = extractDependencies<{ mirageServer: Server }>(['mirageServer'], context);
  return mirageServer?.schema.find('person', args.id as string) ?? undefined;
};

export default resolver;
