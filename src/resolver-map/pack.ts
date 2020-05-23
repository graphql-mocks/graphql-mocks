import { Packer, PackOptions, PackState } from '../types';
import cloneDeep from 'lodash.clonedeep';
import { wrapEachField } from './wrap-each-field';
import { embedPackOptionsWrapper } from '../utils';

const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packer = (initialResolversMap = {}, middlewares = [], packOptions = defaultPackOptions) => {
  middlewares = [...middlewares, wrapEachField([embedPackOptionsWrapper])];

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
