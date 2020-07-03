import { TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from './reference/target-reference';

/**
 * For high-level middlwares that might have an exclude or include,
 * for consistency it's useful to allow for a single target reference
 * or a list of target references
 */
export type TargetMiddlewareOption = TargetReference | TargetReference[];

export interface IncludeExcludeMiddlewareOptions {
  include?: TargetMiddlewareOption;
  exclude?: TargetMiddlewareOption;
}

export const defaultIncludeExcludeOptions: IncludeExcludeMiddlewareOptions = {
  include: [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
  exclude: [],
};
