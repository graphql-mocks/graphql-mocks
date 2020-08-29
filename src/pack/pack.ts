import cloneDeep from 'lodash.clonedeep';
import { embed } from '../resolver-map/embed';
import { embedPackOptionsWrapper, normalizePackOptions } from './utils';
import { PackOptions, Packer, PackState } from './types';

export const defaultPackOptions: PackOptions = { state: {}, dependencies: {} };

export const pack: Packer = async function pack(
  initialResolversMap = {},
  middlewares = [],
  packOptions = defaultPackOptions,
) {
  middlewares = [...middlewares, embed({ wrappers: [embedPackOptionsWrapper] })];

  // make an initial copy
  let wrappedMap = cloneDeep(initialResolversMap);
  packOptions = normalizePackOptions(packOptions);

  for (const middleware of middlewares) {
    wrappedMap = await middleware(wrappedMap, packOptions as PackOptions);
  }

  return { resolverMap: wrappedMap, state: packOptions.state as PackState };
};
