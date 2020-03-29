import { Resolver, ResolverMap, ResolverMapWrapper, PackOptions } from '../types';

export type WrapEachDetails = {
  resolvers: ResolverMap;
  path: [string, string];
  packOptions: PackOptions;
};

type EachWrapper = (resolver: Resolver, reducerMapDetails: WrapEachDetails) => Resolver;

export const wrapEach = (eachWrapper: EachWrapper): ResolverMapWrapper => (
  resolvers: ResolverMap,
  packOptions: PackOptions,
) => {
  for (const type in resolvers) {
    for (const field in resolvers[type]) {
      const resolver = resolvers[type][field];

      const newResolver = eachWrapper(resolver, {
        resolvers,
        path: [type, field],
        packOptions,
      });

      if (typeof newResolver !== 'function') {
        throw new Error(`${wrapEach.toString()} must return a function for resolver type: ${type}, field: ${field}`);
      }

      resolvers[type][field] = newResolver;
    }
  }

  return resolvers;
};
