import { TargetReference } from './reference/target-reference';

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
