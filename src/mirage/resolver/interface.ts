import { GraphQLObjectType, GraphQLSchema, GraphQLTypeResolver } from 'graphql';
import { MirageGraphQLMapper } from '../mapper/mapper';
import { findMostInCommon, convertModelNameToTypeName } from './utils';
import { extractDependencies } from '../../resolver/extract-dependencies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mirageInterfaceResolver: GraphQLTypeResolver<any, any> = function mirageInterfaceResolver(
  object,
  context,
  _info,
  interfaceType,
) {
  // special property on context to be able to test the 'useFindInCommon' feature
  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;

  const { graphqlSchema } = extractDependencies<{
    graphqlSchema: GraphQLSchema;
  }>(context, ['graphqlSchema']);

  const { mirageMapper } = extractDependencies<{
    mirageMapper: MirageGraphQLMapper;
  }>(context, ['mirageMapper'], { required: false });

  const typesUsingInterface: GraphQLObjectType[] = graphqlSchema.getPossibleTypes(interfaceType) as GraphQLObjectType[];

  const parentModelName = convertModelNameToTypeName(object?.modelName);

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
    const checkedCandidates = candidates.map((c) => ` * ${c}`);

    let matchingFieldsErrorMessage = null;
    if (matchingFieldsCandidateError) {
      matchingFieldsErrorMessage = `Tried to automatically determined the type based on matching fields: ${matchingFieldsCandidateError.message}.`;
    }

    const message = [
      `Unable to find a matching type for resolving the interface type "${interfaceType.name}".`,
      'Checked on types:',
      ...checkedCandidates,
      matchingFieldsErrorMessage,
      `Manually handle with a Type Resolver by adding the resolver at ["${interfaceType.name}", "__resolveType"] to the resolver map used by the \`GraphQLHandler\` instance or \`pack\`.`,
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(message);
  }

  return match;
};
