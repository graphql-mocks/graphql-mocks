import { Server as MirageServer, ModelInstance } from 'miragejs';
import { isScalarType, GraphQLSchema } from 'graphql';
import { Resolver } from '../../types';
import { extractDependencies, unwrap, coerceReturnType, coerceToList } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { relayPaginateNodes } from '../../relay/helpers';
import { cleanRelayConnectionName, mirageCursorForNode } from './helpers';

function findMatchingModelsForType({
  type,
  mapper,
  mirageServer,
}: any): { modelNameCandidates: string[]; matchedModelName: string; models: ModelInstance[] | null } {
  type = unwrap(type);
  const mappedModelName = mapper && type.name && mapper.mappingForType(type.name);

  // model candidates are ordered in terms of preference:
  // [0] A manual type mapping already exists
  // [1] A model exists for a relay type name
  // [2] The type's name itself exists as a model name
  const modelNameCandidates = [mappedModelName, cleanRelayConnectionName(type.name), type.name].filter(Boolean);

  const matchedModelName = modelNameCandidates.find((candidate) => {
    try {
      // try each candidate in the schema
      return Boolean(mirageServer.schema.all(candidate));
    } catch {
      // nope; no match
      return false;
    }
  });

  const models = mirageServer.schema.all(matchedModelName).models;

  return {
    models,
    matchedModelName,
    modelNameCandidates,
  };
}

export const mirageRootQueryResolver: Resolver = function (parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const isRelayPaginated = unwrap(returnType)?.name?.endsWith('Connection');
  const { mapper, mirageServer, graphqlSchema } = extractDependencies<{
    mapper: MirageGraphQLMapper;
    mirageServer: MirageServer;
    graphqlSchema: GraphQLSchema;
  }>(context);
  if (!graphqlSchema) {
    throw new Error('graphqlSchema is a required dependency');
  }

  const fieldFilter = mapper?.findFieldFilter([parentType.name, fieldName]);

  let result: any = null;
  const meta: any = {};

  const hasScalarInReturnType = isScalarType(unwrap(returnType));

  // Root query types that return scalars cannot use mirage models
  // since models represent an object with attributes.
  // We have to throw an error and recommend a field filter (or resolver in map)
  if (hasScalarInReturnType && !fieldFilter) {
    throw new Error(
      `Scalars cannot be auto-resolved with mirage from the root query type. ${
        parentType.name
      }.${fieldName} resolves to a scalar, or a list, of type ${
        unwrap(returnType).name
      }. Try adding a field filter for this field and returning a value for this field.`,
    );
  }

  if (!hasScalarInReturnType) {
    // at this point we are querying on a query root type:
    // * there is no parent on root query types
    // * we are querying for something non-scalar (so we can use mirage)
    // * we can use the mappings to assist in finding something from mirage
    const matched = findMatchingModelsForType({ type: returnType, mapper, mirageServer });
    meta.modelNameCandidates = matched.modelNameCandidates;
    meta.matchedModelName = matched.matchedModelName;

    result = matched.models;
  }

  if (fieldFilter) {
    result = fieldFilter(coerceToList(result) ?? [], parent, args, context, info);
  }

  if (isRelayPaginated) {
    const nodes = coerceToList(result);
    return nodes && relayPaginateNodes(nodes, args, mirageCursorForNode);
  }

  return coerceReturnType(result, info);
};
