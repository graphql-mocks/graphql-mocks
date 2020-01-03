import { Resolver } from '../../types';

export const mirageAutoResolver: Resolver = function(parent, _args, _context, info) {
  const resolvedModel = parent;
  const {fieldName} = info;

  if (!resolvedModel) {
    throw new Error(`Could not resolve model from parent, got ${typeof parent}`);
  }

  if (!resolvedModel[fieldName]) {
    throw new Error(`${fieldName} does not exist on type}`);
  }

  const resolvedField = resolvedModel[fieldName].models ? resolvedModel[fieldName].models : resolvedModel[fieldName];
  return resolvedField;
}
