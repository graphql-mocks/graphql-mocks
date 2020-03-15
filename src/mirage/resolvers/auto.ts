import { Resolver } from '../../types';
import { classify } from 'inflected';

export const mirageAutoUnionResolver: Resolver = function(parent, _args, _context, _info) {
  return classify(parent.modelName.replace('-', '_')) as string;
};

export const mirageAutoObjectResolver: Resolver = function(parent, _args, _context, info) {
  const resolvedModel = parent;
  const { fieldName } = info;

  if (!resolvedModel) {
    throw new Error(`Could not resolve model from parent, got ${typeof parent}`);
  }

  if (typeof resolvedModel[fieldName] === 'undefined') {
    throw new Error(`${fieldName} does not exist on type}`);
  }

  const resolvedField = resolvedModel[fieldName].models ? resolvedModel[fieldName].models : resolvedModel[fieldName];

  if (resolvedField === undefined) {
    throw new Error(`Failed to resolve a field or model from ${resolvedModel.toString()} ${fieldName}`);
  }

  return resolvedField;
};
