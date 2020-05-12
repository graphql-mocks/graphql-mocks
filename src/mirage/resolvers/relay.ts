import { GraphQLObjectType, GraphQLResolveInfo } from 'graphql';
import { extractDependencies } from '../../utils';
import { relayPaginateNodes, RelayPaginationResult } from '../../relay/helpers';
import { unwrap } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';

type ExtractionArgs = {
  parent: Record<string, unknown>;
  parentType: GraphQLObjectType;
  mapper: MirageGraphQLMapper;
  fieldName: string;
};

export async function mirageRelayResolver(
  parent: Record<string, unknown>,
  args: Record<string, unknown>,
  context: Record<string, unknown>,
  info: Pick<GraphQLResolveInfo, 'fieldName' | 'parentType' | 'returnType'>,
): Promise<RelayPaginationResult> {
  const { mapper } = extractDependencies(context);
  const { fieldName, parentType } = info;

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const nodes = extractNodesFromParent<Record<string, unknown>>({
    parent,
    parentType,
    mapper,
    fieldName,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cursorForNode = (node: any): string => node.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return relayPaginateNodes<Record<string, any>>(nodes, args, cursorForNode);
}

export function extractNodesFromParent<T>({ parent, parentType, mapper, fieldName }: ExtractionArgs): T[] {
  const unwrappedParentType = unwrap(parentType);
  const [, mappedAttrName] =
    'name' in unwrappedParentType
      ? mapper.matchForGraphQL([unwrappedParentType.name, fieldName])
      : [undefined, undefined];

  const parentAttributeCandidates = [mappedAttrName, fieldName].filter(Boolean);
  const matchingAttr = parentAttributeCandidates.find((attr) => attr && parent[attr]);

  if (!matchingAttr) {
    throw new Error(
      `Unable to find an attr in "${parentAttributeCandidates.join(', ')}" on resolved parent ${JSON.stringify(
        parent,
      )} of type "${unwrappedParentType.name}" to resolve ${fieldName}`,
    );
  }

  const nodes =
    ((parent?.[matchingAttr] as Record<string, unknown>)?.models as T[] | undefined) ||
    (parent[matchingAttr] as T[] | undefined);

  if (!Array.isArray(nodes)) {
    throw new Error(`Expected "${fieldName}" on ${parent.name} to return an array, got:\n\n${JSON.stringify(nodes)}`);
  }

  return nodes;
}
