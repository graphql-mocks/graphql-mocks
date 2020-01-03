import { Resolver, FieldResolvers } from '../types';

type ReducerMapDetails = {
  resolvers: FieldResolvers,
  path: [string, string],
  namedArgs: {[key: string]: any}
}

type MapFunction = (
  resolver: Resolver,
  reducerMapDetails: ReducerMapDetails
) => Resolver;

export default (mapFunction: MapFunction, namedArgs: {[key: string]: any}) => (resolvers: FieldResolvers) => {
  for (const type in resolvers) {
    for (const field in resolvers[type]) {
      const resolver = resolvers[type][field];
      const newResolver = mapFunction(
        resolver,
        {
          resolvers,
          path: [type, field],
          namedArgs
        }
      );

      if (typeof newResolver !== 'function') {
        throw new Error(`${mapFunction.toString()} must return a function for resolver type: ${type}, field: ${field}`);
      }

      resolvers[type][field] = newResolver;
    }
  }

  return resolvers;
}
