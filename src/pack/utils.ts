import { ResolverParent, ResolverArgs, ResolverContext, ResolverInfo, FieldResolver, TypeResolver } from '../types';
import { defaultPackOptions } from './pack';
import { PackOptions } from './types';
import { FieldResolverWrapperOptions } from '../../src/types';

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

export async function embedPackOptionsFieldResolverWrapper(
  resolver: FieldResolver,
  options: FieldResolverWrapperOptions,
) {
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

export async function embedPackOptionsTypeResolverWrapper(
  resolver: FieldResolver,
  options: FieldResolverWrapperOptions,
) {
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
