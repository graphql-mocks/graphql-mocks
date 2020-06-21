import { GraphQLObjectType, GraphQLSchema, GraphQLTypeResolver } from 'graphql';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';
import { extractDependencies } from '../../resolver-map/extract-dependencies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mirageInterfaceResolver: GraphQLTypeResolver<any, any> = function (object, context, _info, interfaceType) {
  // special property on context to be able to test the 'useFindInCommon' feature
  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;

  const { graphqlSchema } = extractDependencies<{
    graphqlSchema: GraphQLSchema;
  }>(['graphqlSchema'], context);

  const { mirageMapper } = extractDependencies<{
    mirageMapper: MirageGraphQLMapper;
  }>(['mirageMapper'], context, { required: false });

  const { name: interfaceName } = interfaceType;
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

  const parentModelName = modelNameToTypeName(object?.modelName);

  let matchingFieldsCandidate;
  let matchingFieldsCandidateError: Error | undefined;
  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(object, typesUsingInterface) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const mappedModelName = mirageMapper && parentModelName ? mirageMapper.findMatchForModel(parentModelName) : undefined;
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
