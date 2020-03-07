import { ResolverMap, ResolverMapWrapper, PackOptions } from "../types";

export const wrap = (wrapper: ResolverMapWrapper): ResolverMapWrapper => {
  return (map: ResolverMap, packOptions: PackOptions) => {
    const wrappedMap = wrapper(map, packOptions);

    if (typeof wrappedMap !== 'object') {
      throw new Error(`wrapper should return a resolver map object, got ${typeof wrappedMap}`);
    }

    return wrappedMap;
  };
};