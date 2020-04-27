import { Resolver } from '../../types';
import { GraphQLNonNull } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';

export const mirageObjectResolver: Resolver = function (parent, _args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const { mapper }: { mapper: MirageGraphQLMapper } = extractDependencies(context);

  if (typeof parent !== 'object') {
    throw new Error(
      `Expected parent to be an object, got ${typeof parent}, when trying to resolve field "${fieldName}" on type "${parentType}"`,
    );
  }

  const [, mappedAttrName] = mapper ? mapper.matchForGraphQL([parentType.name, fieldName]) : [undefined, undefined];
  const candidates = [mappedAttrName, fieldName].filter(Boolean);
  const matchedAttr = candidates.find((candidate) => candidate in parent);
  const value = parent[matchedAttr];

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist
  const result = value?.models || value;

  if (result == null) {
    if (returnType instanceof GraphQLNonNull) {
      throw new Error(
        `Failed to resolve field "${fieldName}" on type "${
          parentType.name
        }". Tried to resolve the parent object ${parent.toString()}, with the following attrs: ${candidates.join(
          ', ',
        )}`,
      );
    }

    return null;
  }

  return result;
};
