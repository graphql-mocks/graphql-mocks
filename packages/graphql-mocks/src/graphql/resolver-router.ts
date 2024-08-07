import { defaultFieldResolver, defaultTypeResolver } from 'graphql';
import { FieldResolver, ResolverMap, TypeResolver } from '../types';

export function fieldResolverRouter(resolverMap: ResolverMap): FieldResolver {
  return (parent, args, context, info) => {
    const { fieldName, parentType } = info;
    const resolver = resolverMap[parentType.name]?.[fieldName];

    if (resolver) {
      return resolver(parent, args, context, info);
    }

    return defaultFieldResolver(parent, args, context, info);
  };
}

export function typeResolverRouter(resolverMap: ResolverMap): TypeResolver {
  return function (value, context, info, abstractType) {
    const resolver = resolverMap[abstractType.name]?.__resolveType;

    if (resolver) {
      return resolver(value, context, info, abstractType);
    }

    return defaultTypeResolver(value, context, info, abstractType);
  };
}
