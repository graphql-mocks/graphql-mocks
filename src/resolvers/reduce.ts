import { FieldResolvers, ResolverReducer } from "../types";

// will return a copy of `resolvers` with the each of `reducers` applied
export default ({resolvers, reducers}: {resolvers: FieldResolvers, reducers: ResolverReducer[]}) => {
  // make an intial copy
  let reducedResolvers = {
    ...resolvers
  };

  reducers.forEach((reducer) => {
    // copy on each loop
    reducedResolvers = {
      ...resolvers
    };

    reducedResolvers = reducer(reducedResolvers);

    if (typeof reducedResolvers !== 'object') {
      throw new Error(`reducer ${reducer.toString()} should return a resolvers object, got ${typeof resolvers}`);
    }
  });

  return reducedResolvers;
};
