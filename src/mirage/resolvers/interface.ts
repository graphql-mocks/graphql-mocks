import { Resolver } from '../../types';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';

export const mirageInterfaceResolver: Resolver = function (parent, _args, context, info) {
  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name: interfaceName } = info;

  const typeMap = graphqlSchema.getTypeMap();
  const typesUsingInterface: GraphQLObjectType[] = Object.values(typeMap).filter(function filterTypesUsingInterface(
    type,
  ) {
    if (!('getInterfaces' in type)) {
      return false;
    }

    const interfacesForType = type.getInterfaces().map(({ name: interfaceName }: { name: string }) => interfaceName);
    return interfacesForType.includes(interfaceName);
  }) as GraphQLObjectType[];

  const parentModelName = modelNameToTypeName(parent?.modelName);

  let matchingFieldsCandidate;
  let matchingFieldsCandidateError: Error | undefined;
  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(parent, typesUsingInterface) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const [mappedModelName] = mapper && parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate].filter(Boolean);
  const match = candidates.find((candidate) => graphqlSchema.getType(candidate as string));

  if (!match) {
    const checkedCandidates = candidates.join(', ');
    const matchingFieldsErrorMessage = matchingFieldsCandidateError
      ? `Was also unable to find automatically determine the type based on matching fields: ${matchingFieldsCandidateError.message}`
      : '';
    throw new Error(
      `Unable to find a matching type for resolving interface ${interfaceName}, checked types: ${checkedCandidates}. ${matchingFieldsErrorMessage}`,
    );
  }

  return match;
};
