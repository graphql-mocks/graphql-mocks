import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, Resolver } from '../types';
import { defaultPackOptions } from './pack';
import { PackOptions } from './types';
import { ResolverWrapperOptions } from '../../src/types';

export function normalizePackOptions(packOptions: Partial<PackOptions> = defaultPackOptions): PackOptions {
  const normalized = {
    ...defaultPackOptions,

    dependencies: packOptions.dependencies ?? defaultPackOptions.dependencies,
    state: packOptions.state ?? defaultPackOptions.state,
  };

  return normalized;
}

export function embedPackOptionsInContext(context: Record<string, unknown>, packOptions: PackOptions): ResolverContext {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
}

export async function embedPackOptionsWrapper(resolver: Resolver, options: ResolverWrapperOptions) {
  return (
    parent: ResolverParent,
    args: ResolverArgs,
    context: ResolverContext,
    info: ResolverInfo,
  ): Promise<unknown> => {
    context = embedPackOptionsInContext(context, options.packOptions);
    return resolver(parent, args, context, info);
  };
}
