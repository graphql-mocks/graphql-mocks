import { Resolver } from '../../types';
import { classify } from 'inflected';
import { GraphQLNonNull } from 'graphql';

export const mirageAutoUnionResolver: Resolver = function(parent, _args, _context, _info) {
  // TODO Make this more robust:
  // 1. Try mappings
  // 2. try parent.modelName
  // 3. try a property match based on what parent contains between the types it could be
  return classify(parent.modelName.replace('-', '_')) as string;
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
