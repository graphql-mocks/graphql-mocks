import { extractDependencies } from '../../../../../src/resolver-map/extract-dependencies';
import { relayPaginateNodes } from '../../../../../src/relay/helpers';
import { Server } from 'miragejs';

export default function (_parent: unknown, args: Record<string, unknown>, context: Record<string, unknown>): unknown {
  const { mirageServer } = extractDependencies<{ mirageServer: Server }>(['mirageServer'], context);
  const nodes = mirageServer.schema.all('person').models;
  return relayPaginateNodes<Record<string, unknown>>(nodes, args, (node) => node.toString());
}
