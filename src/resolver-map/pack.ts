import { Packer, PackOptions, PackState } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { embedPackOptionsWrapper } from '../utils';
import { embed } from '../resolver/embed';

export const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packer = (initialResolversMap = {}, middlewares = [], packOptions = defaultPackOptions) => {
  middlewares = [...middlewares, embed({ wrappers: [embedPackOptionsWrapper] })];

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

  middlewares.forEach((middleware) => {
    wrappedMap = middleware(wrappedMap, packOptions as PackOptions);
  });

  return { resolverMap: wrappedMap, state: packOptions.state as PackState };
};
