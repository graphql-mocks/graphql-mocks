import { GraphQLArgs } from 'graphql';
import { PackOptions } from '../../pack/types';
import { ResolverContext } from '../../types';

export function buildContext({
  initialContext,
  queryContext,
  packOptions,
}: {
  initialContext?: GraphQLArgs['contextValue'];
  queryContext?: GraphQLArgs['contextValue'];
  packOptions: PackOptions;
}): ResolverContext {
  const context = {
    ...(initialContext as Record<string, unknown>),
    ...(queryContext as Record<string, unknown>),
  };

  Object.defineProperty(context, 'pack', {
    value: packOptions,
    configurable: false,
  });

  return context;
}
