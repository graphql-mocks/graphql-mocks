import { ResolverMap, ResolverMapWrapper } from "../types";

export const wrap = (wrapper: ResolverMapWrapper): ResolverMapWrapper => {
  return (map: ResolverMap) => {
    const wrappedMap = wrapper(map);

    if (typeof wrappedMap !== 'object') {
      throw new Error(`wrapper should return a resolver map object, got ${typeof wrappedMap}`);
    }

    return wrappedMap;
  };
};