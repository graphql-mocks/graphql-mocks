import { Packer, PackOptions, PackState } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { wrapEachField } from './wrap-each-field';
import { embedPackOptionsResolverWrapper } from '../utils';

const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packer = (initialResolversMap, wrappers, packOptions = defaultPackOptions) => {
  wrappers = [...wrappers, wrapEachField([embedPackOptionsResolverWrapper])];

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
