import iteratorReducer from '../../resolvers/reducer-map';
import { Resolver } from '../../types';

// wraps an existing resolver with patching the context object
// with a `mirage` key for access to the mirage server
function addMirageContext(originalResolver: Resolver, reducerMapDetails: any): Resolver {
  const { mirageServer } = reducerMapDetails.namedArgs;

  return function wrapperRolverWithContext(parent, args, context, info) {
    debugger;
    context = context || {};
    context.mirage = context.mirage || {};
    context.mirage.server = context.mirage.server || mirageServer;
    context.mirage.schema = context.mirage.schema || mirageServer.schema;

    return originalResolver(parent, args, context, info);
  };
}

export const addContextToResolvers = (mirageServer: any) => iteratorReducer(addMirageContext, { mirageServer });
