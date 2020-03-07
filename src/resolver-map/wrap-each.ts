import { Resolver, ResolverMap, ResolverMapWrapper } from '../types';

export type WrapEachDetails = {
  resolvers: ResolverMap,
  path: [string, string],
  state: Record<any, any>
}

type EachWrapper = (
  resolver: Resolver,
  reducerMapDetails: WrapEachDetails
) => Resolver;

export const wrapEach = (eachWrapper: EachWrapper): ResolverMapWrapper => (resolvers: ResolverMap) => {
  for (const type in resolvers) {
    for (const field in resolvers[type]) {
      const resolver = resolvers[type][field];
      const newResolver = eachWrapper(
        resolver,
        {
          resolvers,
          path: [type, field],
          state: {},
        }
      );

      if (typeof newResolver !== 'function') {
        throw new Error(`${wrapEach.toString()} must return a function for resolver type: ${type}, field: ${field}`);
      }

      resolvers[type][field] = newResolver;
    }
  }

  return resolvers;
}
