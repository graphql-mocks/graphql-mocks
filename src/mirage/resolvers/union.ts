import { Resolver } from '../../types';
import { GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';

export const mirageUnionResolver: Resolver = function(parent, _args, context, info) {
  const useFindInCommon = '__testUseFindInCommon' in context ? context.__testUseFindInCommon : true;
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name } = info;
  const unionTypes = info.getTypes();

  const parentModelName = modelNameToTypeName(parent?.modelName);
  let matchingFieldsCandidate;
  let matchingFieldsCandidateError;

  try {
    matchingFieldsCandidate = useFindInCommon ? findMostInCommon(parent, unionTypes) : undefined;
  } catch (error) {
    matchingFieldsCandidateError = error;
  }

  const [mappedModelName] = mapper && parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];

  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate].filter(Boolean);
  const match = candidates.find(candidate => graphqlSchema.getType(candidate as string));

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
