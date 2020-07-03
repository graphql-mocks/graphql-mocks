import {
  ResolverMap,
  PackOptions,
  ResolverWrapper,
  Resolver,
  ResolverParent,
  ResolverArgs,
  ResolverContext,
  ResolverInfo,
} from '../types';
import { FieldReference } from './reference/field-reference';

export function resolverExistsInResolverMap(fieldReference: FieldReference, resolverMap: ResolverMap): boolean {
  const [typeName, fieldName] = fieldReference;
  return typeof resolverMap?.[typeName]?.[fieldName] === 'function';
}

export const embedPackOptionsInContext = (
  context: Record<string, unknown>,
  packOptions: PackOptions,
): Record<string, unknown> => {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const embedPackOptionsWrapper: ResolverWrapper = async (resolver, options): Promise<Resolver> => {
  return (
    parent: ResolverParent,
    args: ResolverArgs,
    context: ResolverContext,
    info: ResolverInfo,
  ): Promise<unknown> => {
    context = embedPackOptionsInContext(context, options.packOptions);
    return resolver(parent, args, context, info);
  };
};

export function addResolverToMap({
  resolverMap,
  fieldReference,
  resolver,
  overwrite = false,
}: {
  resolverMap: ResolverMap;
  fieldReference: FieldReference;
  resolver: Resolver;
  overwrite?: boolean;
}): ResolverMap {
  const [typeName, fieldName] = fieldReference;
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  resolverMap[typeName] = resolverMap[typeName] ?? {};

  if (resolverMap[typeName][fieldName] && !overwrite) {
    throw new Error(
      `Cannot add resolver to resolver map at ["${typeName}", "${fieldName}"] when overwrite is set to false`,
    );
  }

  resolverMap[typeName][fieldName] = resolver;
  return resolverMap;
}
