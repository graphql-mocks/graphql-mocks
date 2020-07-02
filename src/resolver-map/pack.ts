import { Packer, PackOptions, PackState } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { embed } from './embed';
import { embedPackOptionsWrapper } from './utils';

export const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packer = async (initialResolversMap = {}, middlewares = [], packOptions = defaultPackOptions) => {
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

  for (const middleware of middlewares) {
    wrappedMap = await middleware(wrappedMap, packOptions as PackOptions);
  }

  return { resolverMap: wrappedMap, state: packOptions.state as PackState };
};
