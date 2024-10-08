import { defaultFieldResolver, defaultTypeResolver } from 'graphql';
import { FieldResolver, ResolverMap, TypeResolver } from '../types';

export function createFieldResolverRouter(resolverMap: ResolverMap): FieldResolver {
  return (parent, args, context, info) => {
    const { fieldName, parentType } = info;
    const resolver = resolverMap[parentType.name]?.[fieldName];

    let result;
    if (resolver) {
      result = resolver(parent, args, context, info);
    } else {
      result = defaultFieldResolver(parent, args, context, info);
    }

    if (typeof result === 'function') {
      result = result(parent, args, context, info);
    }

    return result;
  };
}

export function createTypeResolverRouter(resolverMap: ResolverMap): TypeResolver {
  return function (value, context, info, abstractType) {
    const resolver = resolverMap[abstractType.name]?.__resolveType;

    if (resolver) {
      return resolver(value, context, info, abstractType);
    }

    return defaultTypeResolver(value, context, info, abstractType);
  };
}
