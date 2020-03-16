import { wrapEach } from '../../resolver-map/wrap-each';
import { Resolver, ResolverMapWrapper } from '../../types';

// wraps an existing resolver with patching the context object
// with a `mirage` key for access to the mirage server
export const addMirageToContextWrapper = (mirageServer: any): ResolverMapWrapper => {
  return wrapEach((originalResolver: Resolver) => {
    return async function wrapperRolverWithContext(parent, args, context, info): Promise<any> {
      context = context || {};
      context.mirage = context.mirage || {};
      context.mirage.server = context.mirage.server || mirageServer;
      context.mirage.schema = context.mirage.schema || mirageServer.schema;

      return await originalResolver(parent, args, context, info);
    };
  });
};
