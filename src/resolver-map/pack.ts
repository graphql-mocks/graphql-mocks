import { Packer, PackOptions, PackState } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { wrapEach } from './wrap-each';
import { embedPackOptions } from '../utils';

const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const packWrapper = wrapEach((resolver, { packOptions }) => {
  return embedPackOptions(resolver, packOptions);
});

export const pack: Packer = (initialResolversMap, wrappers, packOptions = defaultPackOptions) => {
  wrappers = [packWrapper, ...wrappers];

  // make an intial copy
  let wrappedMap = cloneDeep(initialResolversMap);

  packOptions = {
    ...packOptions,

    state: {
      ...packOptions.state,
    },

    dependencies: {
      ...packOptions.dependencies,
    },
  };

  wrappers.forEach((wrapper) => {
    wrappedMap = wrapper(wrappedMap, packOptions as PackOptions);
  });

  return { resolvers: wrappedMap, state: packOptions.state as PackState };
};
