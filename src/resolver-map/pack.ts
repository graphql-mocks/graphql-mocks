import { Packager, PackState, PackOptions } from '../types';

export const pack: Packager = (initialResolversMap, wrappers, initialPackState: PackState = {}) => {
  // make an intial copy
  let wrappedMap = {
    ...initialResolversMap
  };

  const packOptions: PackOptions = {
    packState: {
      ...initialPackState
    }
  };

  wrappers.forEach((wrapper) => {
    wrappedMap = wrapper(wrappedMap, packOptions);
  });

  return { resolvers: wrappedMap, packState: packOptions.packState };
}