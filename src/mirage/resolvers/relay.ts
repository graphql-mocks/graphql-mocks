import { GraphQLObjectType } from 'graphql';
import { extractDependencies } from '../../utils';
import { relayPaginateNodes } from '../../relay/helpers';
import { unwrap } from '../../utils';
import { mirageMappingFor } from '../mapping/helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inflected = require('inflected');

export function mirageRelayResolver(parent: any, args: any, context: any, info: any): any {
  const { mirageServer, graphqlMirageMappings } = extractDependencies(context);
  const {
    fieldName,
    parentType,
    returnType,
  }: { parentType: GraphQLObjectType; returnType: GraphQLObjectType; fieldName: string } = info;

  /* eslint-disable @typescript-eslint/no-use-before-define */
  const nodes: any[] = parent
    ? extractNodesFromParent({ parent, parentType, graphqlMirageMappings, fieldName })
    : extractNodesFromMirageCollection({
        parentType,
        returnType,
        graphqlMirageMappings,
        mirageServer,
        fieldName,
      });

  const cursorForNode = (node: any) => node.toString();

  return relayPaginateNodes(nodes, args, cursorForNode);
}

export function extractNodesFromParent({ parent, parentType, graphqlMirageMappings, fieldName }: any) {
  const unwrappedParentType = unwrap(parentType);
  const mapping = mirageMappingFor(unwrappedParentType.name, fieldName, graphqlMirageMappings);
  const parentAttributeCandidates = [mapping?.attrName, fieldName].filter(Boolean);
  const matchingAttr = parentAttributeCandidates.find(attr => attr && parent[attr]);

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

export function extractNodesFromMirageCollection({
  parentType,
  returnType,
  graphqlMirageMappings,
  mirageServer,
  fieldName,
}: any) {
  const unwrappedParentType = unwrap(parentType);
  const unwrappedReturnType = unwrap(returnType);
  const mapping = mirageMappingFor(unwrappedParentType.name, fieldName, graphqlMirageMappings);
  const modelNameCandidates = [mapping?.modelName, unwrappedReturnType.name.replace('Connection', '')].filter(Boolean);

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

  const nodes = mirageServer.schema[matchingModelName].all().models;
  return nodes;
}
