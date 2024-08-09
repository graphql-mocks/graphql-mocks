import { clone } from 'ramda';
import { PackOptions, Packer, PackState } from './types';
import { defaultPackOptions, normalizePackOptions } from './utils/normalize-pack-options';

export const pack: Packer = async function pack(
  initialResolversMap = {},
  middlewares = [],
  packOptions = defaultPackOptions,
) {
  middlewares = [...middlewares];

  // make an initial copy
  let wrappedMap = clone(initialResolversMap);
  packOptions = normalizePackOptions(packOptions);

  for (const middleware of middlewares) {
    wrappedMap = await middleware(wrappedMap, packOptions as PackOptions);
  }

  return { resolverMap: wrappedMap, state: packOptions.state as PackState };
};
