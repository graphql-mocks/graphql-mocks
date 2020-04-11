import { Resolver } from '../../types';
import { classify } from 'inflected';
import { GraphQLNonNull, GraphQLUnionType, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { extractDependencies } from '../../utils';
import intersection from 'lodash.intersection';
import { MirageGraphQLMapper } from '../mapper';

export const mirageAutoUnionResolver: Resolver = function(parent, _args, context, info) {
  const { graphqlSchema, mapper }: { graphqlSchema: GraphQLSchema; mapper: MirageGraphQLMapper } = extractDependencies(
    context,
  );
  const { name } = info;

  let matchingFieldsCandidate: any;
  if (info instanceof GraphQLUnionType) {
    const unionTypes = info.getTypes();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    matchingFieldsCandidate = findMostInCommon(parent, unionTypes);
  }

  if (info instanceof GraphQLInterfaceType) {
    const interfaceName = name;

    const typeMap = graphqlSchema.getTypeMap();
    const typesUsingInterface = Object.values(typeMap).filter(function filterTypesUsingInterface(type) {
      if (!('getInterfaces' in type)) {
        return false;
      }

      const interfacesForType = type.getInterfaces().map(({ name: interfaceName }: { name: string }) => interfaceName);
      return interfacesForType.includes(interfaceName);
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    matchingFieldsCandidate = findMostInCommon(parent, typesUsingInterface as GraphQLObjectType[]);
  }

  const parentModelName = parent?.modelName ? classify(parent.modelName.replace('-', '_')) : null;
  const [mappedModelName] = parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate];

  const match = candidates
    .filter(Boolean)
    .filter(candidate => graphqlSchema.getType(candidate))
    .pop();

  if (!match)
    throw new Error(`Unable to find a matching type for resolving ${name}, checked in ${candidates.join(', ')}`);

  return match;
};

export const mirageAutoObjectResolver: Resolver = function(parent, _args, _context, info) {
  const resolvedModel = parent;
  const { fieldName, returnType } = info;

  if (!resolvedModel) {
    throw new Error(`Could not resolve model from parent, got ${typeof parent}`);
  }

  if (resolvedModel[fieldName] == null) {
    if (returnType instanceof GraphQLNonNull) {
      throw new Error(`${fieldName} does not exist on type}`);
    }

    return null;
  }

  // TODO: Resolve mapping here and fallback to fieldName
  const resolvedField = resolvedModel[fieldName].models ? resolvedModel[fieldName].models : resolvedModel[fieldName];

  if (resolvedField === undefined) {
    throw new Error(`Failed to resolve a field or model from ${resolvedModel.toString()} ${fieldName}`);
  }

  return resolvedField;
};

function findMostInCommon(parent: any, eligibleTypes: GraphQLObjectType[]) {
  let matchedType;
  let matchedFieldCount = 0;
  const parentFields = Object.keys(parent.attrs ? parent.attrs : parent);

  for (const type of eligibleTypes) {
    const typeFields = Object.keys(type.getFields());
    const { length: currentMatchingCount } = intersection(parentFields, typeFields);

    if (currentMatchingCount > matchedFieldCount) {
      matchedType = type;
      matchedFieldCount = currentMatchingCount;
    }
  }

  return matchedType?.name;
}
