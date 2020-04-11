import { Resolver } from '../../types';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';

export const mirageInterfaceResolver: Resolver = function(parent, _args, context, info) {
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name: interfaceName } = info;

  const typeMap = graphqlSchema.getTypeMap();
  const typesUsingInterface = Object.values(typeMap).filter(function filterTypesUsingInterface(type) {
    if (!('getInterfaces' in type)) {
      return false;
    }

    const interfacesForType = type.getInterfaces().map(({ name: interfaceName }: { name: string }) => interfaceName);
    return interfacesForType.includes(interfaceName);
  });

  const parentModelName = modelNameToTypeName(parent?.modelName);
  const matchingFieldsCandidate = findMostInCommon(parent, typesUsingInterface as GraphQLObjectType[]);
  const [mappedModelName] = parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate];

  const match = candidates.filter(Boolean).find(candidate => graphqlSchema.getType(candidate as string));

  if (!match)
    throw new Error(
      `Unable to find a matching type for resolving interface ${interfaceName}, checked in ${candidates.join(', ')}`,
    );

  return match;
};
