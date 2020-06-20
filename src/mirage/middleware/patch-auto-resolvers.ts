import { ResolverMapMiddleware } from '../../types';
import { patchModelTypes } from './patch-model-types';
import { patchUnionsInterfaces } from './patch-auto-unions-interfaces';

export const patchAutoResolvers: ResolverMapMiddleware = (resolverMap, packOptions) => {
  //  piping these two together middlewares together
  return patchUnionsInterfaces(patchModelTypes(resolverMap, packOptions), packOptions);
};
