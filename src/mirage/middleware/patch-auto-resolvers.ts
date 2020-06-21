import { ResolverMapMiddleware } from '../../types';
import { patchAutoFieldResolvers } from './patch-auto-field-resolvers';
import { patchAutoTypeResolvers } from './patch-auto-type-resolvers';

export const patchAutoResolvers: ResolverMapMiddleware = (resolverMap, packOptions) => {
  //  piping these two together middlewares together
  return patchAutoTypeResolvers(patchAutoFieldResolvers(resolverMap, packOptions), packOptions);
};
