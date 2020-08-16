import { extractDependencies } from '../../../../../src/resolver/extract-dependencies';
import { relayPaginateNodes } from '../../../../../src/relay/utils';
import { Server } from 'miragejs';

export default function (_parent: unknown, args: Record<string, unknown>, context: Record<string, unknown>): unknown {
  const { mirageServer } = extractDependencies<{ mirageServer: Server }>(context, ['mirageServer']);
  const nodes = mirageServer.schema.all('person').models;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return relayPaginateNodes<Record<string, unknown>>(nodes, args, (node: any) => node.toString());
}
