import { GraphQLSchema, GraphQLTypeResolver, GraphQLUnionType, GraphQLAbstractType } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';

export const mirageUnionResolver: GraphQLTypeResolver<any, any> = function (
  obj,
  context,
  _info,
  unionType: GraphQLAbstractType,
) {
  if (!(unionType instanceof GraphQLUnionType)) {
    throw new Error(
      'Expected info to be an instance of a GraphQLUnionType. This resolver can only be used as a GraphQLTypeResolver on GraphQLUnionType types',
    );
  }

  const useFindInCommon = '__testUseFindInCommon' in context ? (context as any).__testUseFindInCommon : true;
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name } = unionType;
  const unionTypes = unionType.getTypes();

  const parentModelName = modelNameToTypeName(obj?.modelName);
  let matchingFieldsCandidate;
  let matchingFieldsCandidateError;

  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(obj, unionTypes) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const [mappedModelName] = mapper && parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];

  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate].filter(Boolean);
  const match = candidates.find((candidate) => graphqlSchema.getType(candidate as string));

  if (!match) {
    const matchingFieldsError = matchingFieldsCandidateError
      ? `Was also unable to find automatically determine the type based on matching fields: ${matchingFieldsCandidateError.message}`
      : '';
    const triedCandidates = candidates.join(', ');

    throw new Error(
      `Unable to find a matching type for resolving union ${name}, checked in ${triedCandidates}. ${matchingFieldsError}`,
    );
  }

  return match;
};
