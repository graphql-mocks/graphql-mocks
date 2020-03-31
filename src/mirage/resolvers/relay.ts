import { mirageMappingFor } from '../mapping/helpers';
import { GraphQLObjectType } from 'graphql';
import { wrapInNode, unwrap } from '../../utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inflected = require('inflected');

export const mirageRelayResolver: any = function(parent: any, args: any, context: any, info: any) {
  const { mirageServer, graphqlMirageMappings } = context.pack.dependencies;

  const {
    fieldName,
    parentType,
    returnType,
  }: { parentType: GraphQLObjectType; returnType: GraphQLObjectType; fieldName: string } = info;
  const unwrappedParentType = unwrap(parentType);
  const { first, last, before, after } = args;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const confirguredMapping = mirageMappingFor(unwrappedParentType.name, fieldName, graphqlMirageMappings);

  let nodes: any[] = [];

  if (parent) {
    const parentAttributeCandidates = [confirguredMapping?.attrName, fieldName].filter(Boolean);
    const matchingAttr = parentAttributeCandidates.find(attr => attr && parent[attr]);

    if (!matchingAttr) {
      throw new Error(
        `Unable to find an attr in "${parentAttributeCandidates.join(', ')}" on resolved parent ${JSON.stringify(
          parent,
        )} of type "${unwrappedParentType.name}" to resolve ${fieldName}`,
      );
    }

    nodes = parent[matchingAttr].models || parent[matchingAttr];
  } else {
    const unwrappedReturnType = unwrap(returnType);
    const modelNameCandidates = [
      confirguredMapping?.modelName,
      unwrappedReturnType.name.replace('Connection', ''),
    ].filter(Boolean);

    const matchingModelName = modelNameCandidates
      .map(name => inflected.camelize(inflected.pluralize(name), false))
      .find(name => {
        const schemaForModel = mirageServer.schema[name];
        return Boolean(schemaForModel);
      });

    if (!matchingModelName) {
      throw new Error(
        `Unable to find a mirage model for ${unwrappedParentType.name}.${fieldName} from ${modelNameCandidates.join(
          ', ',
        )}`,
      );
    }

    nodes = mirageServer.schema[matchingModelName].all().models;
  }

  const allEdges = nodes.map(wrapInNode);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define, prefer-const
  let { edges, frontCut, backCut } = applyCursorsToEdges(allEdges, before, after);

  let hasNextPage = backCut;
  let hasPreviousPage = frontCut;

  if (first) {
    if (first < 0) throw new Error('`first` argument must be greater than or equal to 0');

    if (edges.length > first) {
      edges = edges.slice(0, first);
      hasNextPage = true;
    }
  }

  if (last) {
    if (last < 0) throw new Error('`first` argument must be greater than or equal to 0');

    if (edges.length > last) {
      edges = edges.slice(edges.length - last, edges.length);
      hasPreviousPage = true;
    }
  }

  return {
    edges: edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges[0].node.toString(),
      endCursor: edges[edges.length - 1].node.toString(),
    },
  };

  // to here so that this can be re-used
};

export function applyCursorsToEdges(allEdges: any, before: any, after: any) {
  let edges = [...allEdges];
  let frontCut = false;
  let backCut = false;

  // pull out `2` from `model:spell(2)`.
  const extractModelId = (mirageLookUpIdentifier: string) => {
    const result = mirageLookUpIdentifier.match(/\(([0-9]+)\)/);
    if (!result) throw new Error(`Unable to extract model ID from ${mirageLookUpIdentifier}`);
    return result[1];
  };

  if (after) {
    const id = extractModelId(after);
    const afterEdge = allEdges.find((edge: any) => edge.node.id === id);
    const afterEdgeIndex = allEdges.indexOf(afterEdge);
    const sliced = edges.slice(afterEdgeIndex + 1, edges.length);
    frontCut = sliced.length !== edges.length;
    edges = sliced;
  }

  if (before) {
    const id = extractModelId(before);
    const beforeEdge = allEdges.find((edge: any) => edge.node.id === id);
    const beforeEdgeIndex = allEdges.indexOf(beforeEdge);
    const sliced = edges.slice(0, beforeEdgeIndex);
    backCut = sliced.length !== edges.length;
    edges = sliced;
  }

  return { edges: edges, frontCut, backCut };
}
