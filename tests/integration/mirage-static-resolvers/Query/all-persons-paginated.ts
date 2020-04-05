import { extractDependencies } from '../../../../src/utils';
import { relayPaginateNodes } from '../../../../src/relay/helpers';

export default function(_parent: any, args: any, context: any /*, info*/) {
  const { mirageServer } = extractDependencies(context);
  const nodes = mirageServer.schema.people.all().models;
  return relayPaginateNodes(nodes, args, node => node.toString());
}
