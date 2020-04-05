import { Resolver } from '../../types';
import { classify } from 'inflected';
import { GraphQLNonNull } from 'graphql';
import { extractDependencies } from '../../utils';

export const mirageAutoUnionResolver: Resolver = function(parent, _args, context, info) {
  const { graphqlSchema, mapper } = extractDependencies(context);
  const { name: unionOrInterfaceName } = info;

  const typeMap = graphqlSchema.getTypeMap();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const matchingFieldsCandidate = findCanadidatesByField(parent, typeMap, unionOrInterfaceName);
  const parentModelName = parent?.modelName ? classify(parent.modelName.replace('-', '_')) : null;
  const [mappedModelName] = parentModelName ? mapper.matchForMirage([parentModelName]) : [undefined];
  const candidates = [mappedModelName, parentModelName, matchingFieldsCandidate];

  const match = candidates
    .filter(Boolean)
    .filter(candidate => graphqlSchema.getType(candidate))
    .pop();

  if (!match)
    throw new Error(
      `Unable to find a matching type for resolving ${unionOrInterfaceName}, checked in ${candidates.join(', ')}`,
    );

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

function findCanadidatesByField(parent: any, typeMap: any, unionOrInterfaceName: string) {
  const typesUsingInterfaceOrUnion = Object.keys(typeMap).filter(function filterTypesUsingUnionOrInterface(typeName) {
    if (!('getInterfaces' in typeMap[typeName])) {
      return false;
    }

    const type = typeMap[typeName];
    const interfacesForType = type.getInterfaces().map(({ name: interfaceName }: { name: string }) => interfaceName);
    return interfacesForType.includes(unionOrInterfaceName);
  });

  const matched = typesUsingInterfaceOrUnion.reduce(
    ({ typeName, matchingCount }, currentTypeName) => {
      const type = typeMap[currentTypeName];
      const fields = Object.keys(type.getFields());

      // pull fields from parent from attrs in the case of a mirage model
      // otherwise fallback to just pulling the keys off of parent assuming it's
      // a pojo
      const parentFields = Object.keys(parent.attrs ? parent.attrs : parent);
      const totalMatching = parentFields.reduce<number>(
        (acc, parentField) => (fields.includes(parentField) ? acc + 1 : acc),
        0,
      );

      if (totalMatching > matchingCount) {
        return { typeName: type.name, matchingCount: totalMatching };
      }

      return { typeName, matchingCount };
    },
    { typeName: undefined, matchingCount: 0 },
  );

  return matched.typeName;
}
