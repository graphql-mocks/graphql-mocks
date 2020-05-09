import { GraphQLObjectType } from 'graphql';
import { extractDependencies } from '../../utils';
import { relayPaginateNodes } from '../../relay/helpers';
import { unwrap } from '../../utils';

export function mirageRelayResolver(parent: any, args: any, context: any, info: any): any {
  const { mapper } = extractDependencies(context);
  const {
    fieldName,
    parentType,
  }: { parentType: GraphQLObjectType; returnType: GraphQLObjectType; fieldName: string } = info;

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const nodes: any[] = extractNodesFromParent({
    parent,
    parentType,
    mapper,
    fieldName,
  });

  const cursorForNode = (node: any) => node.toString();
  return relayPaginateNodes(nodes, args, cursorForNode);
}

export function extractNodesFromParent({ parent, parentType, mapper, fieldName }: any) {
  const unwrappedParentType = unwrap(parentType);
  const [, mappedAttrName] =
    'name' in unwrappedParentType && mapper.matchForGraphQL([unwrappedParentType.name, fieldName]);

  const parentAttributeCandidates = [mappedAttrName, fieldName].filter(Boolean);
  const matchingAttr = parentAttributeCandidates.find((attr) => attr && parent[attr]);

  if (!matchingAttr) {
    throw new Error(
      `Unable to find an attr in "${parentAttributeCandidates.join(', ')}" on resolved parent ${JSON.stringify(
        parent,
      )} of type "${unwrappedParentType.name}" to resolve ${fieldName}`,
    );
  }

  const nodes = parent[matchingAttr].models || parent[matchingAttr];
  return nodes;
}
