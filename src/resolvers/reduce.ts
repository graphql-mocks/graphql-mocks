import { FieldResolvers, ResolverReducer } from "../types";

export default ({resolvers, reducers}: {resolvers: FieldResolvers, reducers: ResolverReducer[]}) => {
  return reducers.reduce(
    (resolvers: FieldResolvers, reducer: ResolverReducer) => {
      resolvers = {
        ...resolvers
      };

      resolvers = reducer(resolvers);
      if (typeof resolvers !== 'object') {
        throw new Error(`resolverModifier ${reducer.toString()} should return a resolvers object, got ${typeof resolvers}`);
      }

      return resolvers;
    },
    resolvers
  );
};
