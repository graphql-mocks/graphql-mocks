import { GraphQLObjectType, GraphQLResolveInfo, GraphQLSchema, GraphQLType } from 'graphql';
import { extractDependencies } from '../../utils';
import { relayPaginateNodes, RelayPaginationResult } from '../../relay/helpers';
import { unwrap, isRootQueryType } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { Server } from 'miragejs';

type ExtractionArgs = {
  parent: Record<string, unknown>;
  parentType: GraphQLObjectType;
  fieldName: string;
  mapper?: MirageGraphQLMapper;
  mirageServer?: Server;
  isRootQuery: boolean;
  returnType: GraphQLType;
};

export async function mirageRelayResolver(
  parent: Record<string, unknown>,
  args: Record<string, unknown>,
  context: Record<string, unknown>,
  info: GraphQLResolveInfo,
): Promise<RelayPaginationResult> {
  const { mapper, mirageServer, graphqlSchema } = extractDependencies<{
    mapper: MirageGraphQLMapper;
    mirageServer: Server;
    graphqlSchema: GraphQLSchema;
  }>(context);
  const { fieldName, parentType, returnType } = info;

  if (!graphqlSchema) {
    throw new Error('graphqlSchema is a required dependency');
  }

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const nodes = extractNodesFromParent<Record<string, unknown>>({
    parent,
    parentType,
    mapper,
    fieldName,
    mirageServer,
    isRootQuery: isRootQueryType(parentType, graphqlSchema),
    returnType,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cursorForNode = (node: any): string => node.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return relayPaginateNodes<Record<string, any>>(nodes, args, cursorForNode);
}

export function extractNodesFromParent<T>({
  parent,
  parentType,
  returnType,
  mapper,
  fieldName,
  mirageServer,
  isRootQuery,
}: ExtractionArgs): T[] {
  let nodes;
  if (!isRootQuery) {
    const unwrappedParentType = unwrap(parentType);

    const attrMapping =
      mapper && 'name' in unwrappedParentType
        ? mapper.mappingForField([unwrappedParentType.name, fieldName])
        : undefined;
    const mappedAttrName = attrMapping ? attrMapping[1] : undefined;

    const parentAttributeCandidates = [mappedAttrName, fieldName].filter(Boolean);
    const matchingAttr = parentAttributeCandidates.find((attr) => attr && parent[attr]);

    if (!matchingAttr) {
      throw new Error(
        `Unable to find an attr in "${parentAttributeCandidates.join(', ')}" on resolved parent ${JSON.stringify(
          parent,
        )} of type "${unwrappedParentType.name}" to resolve ${fieldName}`,
      );
    }

    nodes =
      ((parent?.[matchingAttr] as Record<string, unknown>)?.models as T[] | undefined) ||
      (parent[matchingAttr] as T[] | undefined);
  } else {
    const unwrappedReturnType = unwrap(returnType);

    const cleanedName = unwrappedReturnType.name.endsWith('Connection')
      ? unwrappedReturnType.name.replace('Connection', '')
      : unwrappedReturnType.name;

    const mappedName = mapper?.mappingForType(unwrappedReturnType.name);

    const models = [cleanedName, unwrappedReturnType.name, mappedName]
      .map((candidate) => {
        try {
          return candidate ? mirageServer?.schema.all(candidate).models : undefined;
        } catch {
          return undefined;
        }
      })
      .find(Boolean) as T[] | undefined;

    nodes = models;
  }

  if (!Array.isArray(nodes)) {
    throw new Error(`Expected "${fieldName}" on ${parent.name} to return an array, got:\n\n${JSON.stringify(nodes)}`);
  }

  return nodes;
}
