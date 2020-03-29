import { Packager, PackOptions, PackState } from '../types';
import { packWrapper } from './pack-wrapper';

const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packager = (initialResolversMap, wrappers, packOptions = defaultPackOptions) => {
  wrappers = [packWrapper, ...wrappers];

  // make an intial copy
  let wrappedMap = {
    ...initialResolversMap,
  };

  packOptions = {
    ...packOptions,

    state: {
      ...packOptions.state,
    },

    dependencies: {
      ...packOptions.dependencies,
    },
  };

  wrappers.forEach(wrapper => {
    wrappedMap = wrapper(wrappedMap, packOptions as PackOptions);
  });

  return { resolvers: wrappedMap, state: packOptions.state as PackState };
};
