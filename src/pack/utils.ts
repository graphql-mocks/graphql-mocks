import { ResolverWrapper, ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, Resolver } from '../types';
import { defaultPackOptions } from './pack';
import { PackOptions } from './types';

export function normalizePackOptions(packOptions: Partial<PackOptions> = defaultPackOptions): PackOptions {
  const normalized = {
    ...defaultPackOptions,

    dependencies: packOptions.dependencies ?? defaultPackOptions.dependencies,
    state: packOptions.state ?? defaultPackOptions.state,
  };

  return normalized;
}

export const embedPackOptionsInContext = (
  context: Record<string, unknown>,
  packOptions: PackOptions,
): Record<string, unknown> => {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const embedPackOptionsWrapper: ResolverWrapper = async (resolver, options): Promise<Resolver> => {
  return (
    parent: ResolverParent,
    args: ResolverArgs,
    context: ResolverContext,
    info: ResolverInfo,
  ): Promise<unknown> => {
    context = embedPackOptionsInContext(context, options.packOptions);
    return resolver(parent, args, context, info);
  };
};
