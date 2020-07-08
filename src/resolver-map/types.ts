import { TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from './reference/target-reference';

type FlexibleTargetOption = TargetReference | TargetReference[];

/**
 * For common high-level middlwares that support targets (include, exclude, and replace)
 */
export interface TargetableMiddlewareOptions {
  include?: FlexibleTargetOption;
  exclude?: FlexibleTargetOption;
  replace?: boolean;
}

export const defaultTargetableOptions: TargetableMiddlewareOptions = {
  include: [SPECIAL_TYPE_TARGET.ALL_TYPES, SPECIAL_FIELD_TARGET.ALL_FIELDS],
  exclude: [],
  replace: false,
};
