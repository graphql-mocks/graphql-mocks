import { Packager, PackState, PackOptions } from '../types';

const defaultPackOptions = { packState: {} };

export const pack: Packager = (initialResolversMap, wrappers, packOptions = defaultPackOptions) => {
  // make an intial copy
  let wrappedMap = {
    ...initialResolversMap,
  };

  packOptions = {
    ...packOptions,

    packState: {
      ...packOptions.packState,
    },
  };

  wrappers.forEach(wrapper => {
    wrappedMap = wrapper(wrappedMap, packOptions);
  });

  return { resolvers: wrappedMap, packState: packOptions.packState };
};
