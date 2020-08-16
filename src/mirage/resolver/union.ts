import { GraphQLSchema, GraphQLTypeResolver, GraphQLAbstractType, isUnionType } from 'graphql';
import { MirageGraphQLMapper } from '../mapper/mapper';
import { findMostInCommon, modelNameToTypeName } from './utils';
import { extractDependencies } from '../../resolver/extract-dependencies';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mirageUnionResolver: GraphQLTypeResolver<any, any> = function mirageUnionResolver(
  obj,
  context,
  _info,
  unionType: GraphQLAbstractType,
) {
  if (!isUnionType(unionType)) {
    throw new Error(
      'Expected info to be an instance of a GraphQLUnionType. This resolver can only be used as a GraphQLTypeResolver on GraphQLUnionType types',
    );
  }

  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;

  const { graphqlSchema } = extractDependencies<{
    graphqlSchema: GraphQLSchema;
  }>(context, ['graphqlSchema']);

  const { mirageMapper } = extractDependencies<{
    mirageMapper: MirageGraphQLMapper;
  }>(context, ['mirageMapper'], { required: false });

  const unionTypes = unionType.getTypes();
  const parentModelName = modelNameToTypeName(obj?.modelName);
  let matchingFieldsCandidate;
  let matchingFieldsCandidateError;

  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(obj, unionTypes) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const mappedModelName = mirageMapper && parentModelName && mirageMapper.findMatchForModel(parentModelName);
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate].filter(Boolean);
  const match = candidates.find((candidate) => graphqlSchema.getType(candidate as string));

  if (!match) {
    const triedCandidates = candidates.map((c) => `*  ${c}`);

    let matchingFieldsError;
    if (matchingFieldsCandidateError) {
      matchingFieldsError = `Was also unable to find automatically determine the type based on matching fields: ${matchingFieldsCandidateError.message}`;
    }

    const message = [
      `Unable to find a matching type for resolving the union type "${unionType.name}"`,
      'Checked on types:',
      ...triedCandidates,
      matchingFieldsError,
      `Manually handle with a Type Resolver by adding the resolver at ["${unionType.name}", "__resolveType"] to the resolver map used by the \`GraphQLHandler\` instance or \`pack\`.`,
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(message);
  }

  return match;
};
