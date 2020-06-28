import { ResolverMapMiddleware } from '../../types';
import { patchAutoFieldResolvers } from './patch-auto-field-resolvers';
import { patchAutoTypeResolvers } from './patch-auto-type-resolvers';

export const patchAutoResolvers: ResolverMapMiddleware = async (resolverMap, packOptions) => {
  //  piping these two together middlewares together
  const patchedResolverMap = await patchAutoFieldResolvers()(resolverMap, packOptions);
  return patchAutoTypeResolvers(patchedResolverMap, packOptions);
};
