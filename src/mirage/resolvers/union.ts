import { Resolver } from '../../types';
import { GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { findMostInCommon, modelNameToTypeName } from './helpers';

export const mirageUnionResolver: Resolver = function(parent, _args, context, info) {
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name } = info;
  const unionTypes = info.getTypes();

  const parentModelName = modelNameToTypeName(parent?.modelName);
  const matchingFieldsCandidate = findMostInCommon(parent, unionTypes);
  const [mappedModelName] = parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate];

  const match = candidates.filter(Boolean).find(candidate => graphqlSchema.getType(candidate as string));

  if (!match)
    throw new Error(`Unable to find a matching type for resolving union ${name}, checked in ${candidates.join(', ')}`);

  return match;
};
