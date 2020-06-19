import { GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import { relayPaginateNodes, RelayPaginationResult } from '../../relay/helpers';
import { unwrap, isRootQueryType } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { Server } from 'miragejs';
import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo } from '../../types';

export async function mirageRelayResolver(
  parent: ResolverParent,
  args: ResolverArgs,
  context: ResolverContext,
  info: ResolverInfo,
): Promise<RelayPaginationResult> {
  const { mapper, mirageServer, graphqlSchema } = extractDependencies<{
    mapper: MirageGraphQLMapper;
    mirageServer: Server;
    graphqlSchema: GraphQLSchema;
  }>(context);

  if (!graphqlSchema) {
    throw new Error('graphqlSchema is a required dependency');
  }

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const nodes = extractNodes<Record<string, unknown>>({
    parent,
    args,
    context,
    info,
    mapper,
    mirageServer,
    graphqlSchema,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cursorForNode = (node: any): string => node.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return relayPaginateNodes(nodes, args, cursorForNode);
}

export function extractNodes<T = Record<string, any>>(extractArgs: {
  mapper?: MirageGraphQLMapper;
  mirageServer?: Server;
  graphqlSchema: GraphQLSchema;
  parent: ResolverParent;
  args: ResolverArgs;
  context: ResolverContext;
  info: ResolverInfo;
}): T[] {
  let nodes;
  const { mapper, mirageServer, graphqlSchema, parent, args: resolverArgs, info, context } = extractArgs;
  const { parentType, fieldName, returnType } = info;
  const isRootQuery = isRootQueryType(parentType, graphqlSchema);
  const fieldFilter = mapper?.findFieldFilter([parentType.name, fieldName]);

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

    const models =
      (((parent?.[matchingAttr] as Record<string, unknown>)?.models as T[] | undefined) ||
        (parent[matchingAttr] as T[] | undefined)) ??
      [];

    const result = (fieldFilter ? fieldFilter(models, parent, resolverArgs, context, info) : models) ?? [];
    nodes = Array.isArray(result) ? result : [result];
  } else {
    const unwrappedReturnType = unwrap(returnType);

    const cleanedName = unwrappedReturnType.name.endsWith('Connection')
      ? unwrappedReturnType.name.replace('Connection', '')
      : unwrappedReturnType.name;

    const mappedName = mapper?.mappingForType(unwrappedReturnType.name);

    const models =
      ([cleanedName, unwrappedReturnType.name, mappedName]
        .map((candidate) => {
          try {
            return candidate ? mirageServer?.schema.all(candidate).models : undefined;
          } catch {
            return undefined;
          }
        })
        .find(Boolean) as T[] | undefined) ?? [];

    const result = (fieldFilter ? fieldFilter(models, parent, resolverArgs, context, info) : models) ?? [];
    nodes = Array.isArray(result) ? result : [result];
  }

  if (!Array.isArray(nodes)) {
    throw new Error(`Expected "${fieldName}" on ${parent.name} to return an array, got:\n\n${JSON.stringify(nodes)}`);
  }

  return nodes;
}
